#!/usr/bin/env python3
import os
import whisper
import tempfile
import numpy as np
import soundfile as sf

def generate_test_audio():
    """Generate a simple test audio file with a sine wave"""
    print("Generating test audio file...")
    
    # Create a 3-second sine wave at 440 Hz
    sample_rate = 16000
    t = np.linspace(0, 3, sample_rate * 3)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)
    
    # Save to a temporary file
    temp_file = os.path.join(tempfile.gettempdir(), "test_audio.wav")
    sf.write(temp_file, audio, sample_rate)
    
    print(f"Test audio saved to: {temp_file}")
    return temp_file

def test_whisper_transcription(audio_file=None):
    """Test if Whisper can transcribe audio"""
    if audio_file is None:
        audio_file = generate_test_audio()

    try:
        print("Loading Whisper model...")
        model = whisper.load_model("tiny")
        
        print(f"Transcribing audio file: {audio_file}")
        result = model.transcribe(audio_file)
        
        print("\nTranscription result:")
        print(f"Text: {result['text']}")
        print(f"Language: {result.get('language', 'not detected')}")
        print(f"Segments: {len(result.get('segments', []))}")
        return True
    except Exception as e:
        print(f"\nError transcribing audio: {str(e)}")
        return False

if __name__ == "__main__":
    print("Whisper Transcription Test")
    print("-" * 30)
    
    # Test with generated audio
    success = test_whisper_transcription()
    
    if success:
        print("\nTranscription successful! Whisper is working correctly.")
    else:
        print("\nTranscription failed. Please check the error messages above.")