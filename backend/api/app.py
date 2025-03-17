#!/usr/bin/env python3
import os
import sys
import uuid
import datetime
import tempfile
import json
from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import whisper
import numpy as np
import soundfile as sf
from typing import Optional
import shutil

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.audio_processing import noise_reduction, voice_isolation
from utils.hipaa_compliance import encrypt_data, secure_storage
from utils.summarization import generate_medical_summary

app = FastAPI(title="Patient Visit Summarizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'uploads')
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'm4a'}
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB max upload

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load models
print("Loading Whisper model...")
speech_model = whisper.load_model("tiny")  # Use tiny model for demo, medical fine-tuned in production

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Mount static files for frontend
try:
    app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static")
except RuntimeError:
    print("Warning: Frontend static files not found. API will run without serving frontend.")

@app.get('/api/health')
def health_check():
    return {'status': 'ok', 'message': 'Patient Visit Summarizer API is running'}

@app.post('/api/process-audio')
async def process_audio(
    audio: UploadFile = File(...),
    patientId: str = Form('UNKNOWN'),
    visitDate: Optional[str] = Form(None)
):
    if not audio.filename:
        raise HTTPException(status_code=400, detail="No selected file")
    
    if not allowed_file(audio.filename):
        raise HTTPException(status_code=400, 
                           detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}")
    
    if visitDate is None:
        visitDate = datetime.datetime.now().strftime('%Y-%m-%d')
    
    try:
        # Save the uploaded file to a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        temp_filename = temp_file.name
        temp_file.close()
        
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        # Process audio (noise reduction and voice isolation)
        audio_data, sample_rate = sf.read(temp_filename)
        
        # Apply noise reduction and voice isolation if the audio is not too short
        if len(audio_data) > sample_rate * 0.5:  # At least 0.5 seconds of audio
            audio_data = noise_reduction(audio_data.reshape(-1, 1), sample_rate)
            audio_data = voice_isolation(audio_data, sample_rate)
            
            # Save processed audio
            processed_filename = os.path.join(UPLOAD_FOLDER, f"processed_{uuid.uuid4()}.wav")
            sf.write(processed_filename, audio_data, sample_rate)
        else:
            processed_filename = temp_filename
        
        # Transcribe audio
        result = speech_model.transcribe(processed_filename)
        transcription = result["text"]
        
        # Generate summary
        summary = generate_medical_summary(transcription)
        
        # Save encrypted summary
        summary_filename = os.path.join(UPLOAD_FOLDER, f"{patientId}_{uuid.uuid4()}.enc")
        encrypted_summary = encrypt_data(summary)
        secure_storage(encrypted_summary, summary_filename, patientId)
        
        # Clean up temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        
        # Return response
        return {
            'status': 'success',
            'patientId': patientId,
            'visitDate': visitDate,
            'transcription': transcription,
            'summary': summary,
            'summaryId': os.path.basename(summary_filename)
        }
    
    except Exception as e:
        # Clean up temporary file in case of error
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/stream-audio')
async def stream_audio(request: Request):
    """
    Handle streaming audio chunks
    """
    # Get the session ID from headers or create a new one
    session_id = request.headers.get('X-Session-ID', str(uuid.uuid4()))
    
    # Create session directory if it doesn't exist
    session_dir = os.path.join(UPLOAD_FOLDER, session_id)
    os.makedirs(session_dir, exist_ok=True)
    
    try:
        # Get raw audio data from request
        audio_data = await request.body()
        
        # Save this chunk
        chunk_file = os.path.join(session_dir, f"chunk_{int(datetime.datetime.now().timestamp()*1000)}.raw")
        with open(chunk_file, 'wb') as f:
            f.write(audio_data)
        
        return {
            'status': 'success',
            'session_id': session_id,
            'message': 'Audio chunk received'
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/complete-stream')
async def complete_stream(request: Request):
    """
    Process completed audio stream
    """
    data = await request.json()
    session_id = data.get('sessionId')
    patient_id = data.get('patientId', 'UNKNOWN')
    visit_date = data.get('visitDate', datetime.datetime.now().strftime('%Y-%m-%d'))
    
    if not session_id:
        raise HTTPException(status_code=400, detail="No session ID provided")
    
    session_dir = os.path.join(UPLOAD_FOLDER, session_id)
    if not os.path.exists(session_dir):
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        # Combine all audio chunks
        chunk_files = sorted([os.path.join(session_dir, f) for f in os.listdir(session_dir) if f.startswith('chunk_')])
        
        if not chunk_files:
            raise HTTPException(status_code=400, detail="No audio chunks found for this session")
        
        # Combine chunks into a single file
        combined_file = os.path.join(UPLOAD_FOLDER, f"{session_id}_combined.wav")
        
        # This is a simplified approach - in production would need to handle sample rates correctly
        sample_rate = 44100
        combined_data = np.array([], dtype=np.float32)
        
        for chunk_file in chunk_files:
            with open(chunk_file, 'rb') as f:
                # Assuming raw PCM 32-bit float data
                chunk_data = np.frombuffer(f.read(), dtype=np.float32)
                combined_data = np.append(combined_data, chunk_data)
        
        # Save combined audio
        sf.write(combined_file, combined_data, sample_rate)
        
        # Process audio
        if len(combined_data) > sample_rate * 0.5:
            processed_data = noise_reduction(combined_data.reshape(-1, 1), sample_rate)
            processed_data = voice_isolation(processed_data, sample_rate)
            
            # Save processed audio
            processed_file = os.path.join(UPLOAD_FOLDER, f"{session_id}_processed.wav")
            sf.write(processed_file, processed_data, sample_rate)
        else:
            processed_file = combined_file
        
        # Transcribe audio
        result = speech_model.transcribe(processed_file)
        transcription = result["text"]
        
        # Generate summary
        summary = generate_medical_summary(transcription)
        
        # Save encrypted summary
        summary_filename = os.path.join(UPLOAD_FOLDER, f"{patient_id}_{uuid.uuid4()}.enc")
        encrypted_summary = encrypt_data(summary)
        secure_storage(encrypted_summary, summary_filename, patient_id)
        
        # Clean up session files
        for chunk_file in chunk_files:
            os.remove(chunk_file)
        
        # Return response
        return {
            'status': 'success',
            'patientId': patient_id,
            'visitDate': visit_date,
            'transcription': transcription,
            'summary': summary,
            'summaryId': os.path.basename(summary_filename)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000, log_level="debug")