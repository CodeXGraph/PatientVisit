import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Stack,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());
  const streamRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Cleanup function to stop any active streams and recording on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Timer effect to update recording time
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);
  
  // Audio playback listener
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);
  
  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        audioRef.current.src = audioUrl;
        
        // Stop all tracks
        streamRef.current.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };
  
  const togglePause = () => {
    if (isPaused) {
      // Resume recording
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      // Pause recording
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };
  
  const playAudio = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };
  
  const pauseAudio = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };
  
  const processAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('patientId', 'DEMO123'); // This would come from props/context in a real app
      formData.append('visitDate', new Date().toISOString().split('T')[0]);
      
      const response = await axios.post('/api/process-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setIsProcessing(false);
      setUploadProgress(0);
      
      if (response.data && response.data.status === 'success') {
        onRecordingComplete(response.data);
      } else {
        setError('Error processing audio. Please try again.');
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Error processing audio: ' + (err.response?.data?.error || err.message));
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result], { type: file.type });
      const url = URL.createObjectURL(blob);
      
      setAudioBlob(blob);
      setAudioUrl(url);
      audioRef.current.src = url;
      
      // Determine the duration if possible
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setRecordingTime(Math.floor(audio.duration));
      };
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Record Patient Visit
      </Typography>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        {isRecording ? (
          <>
            <Stack direction="row" spacing={2} sx={{ my: 2 }}>
              <IconButton 
                onClick={togglePause}
                color="primary"
                size="large"
              >
                {isPaused ? <PlayArrowIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
              </IconButton>
              
              <IconButton 
                onClick={stopRecording}
                color="error"
                size="large"
              >
                <StopIcon fontSize="large" />
              </IconButton>
            </Stack>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 120, height: 120 }}>
              <CircularProgress 
                variant="determinate" 
                value={(recordingTime % 60) * 100 / 60} 
                size={120} 
                thickness={4}
                color={isPaused ? "secondary" : "primary"}
              />
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" color="text.secondary">
                  {formatTime(recordingTime)}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {isPaused ? 'Recording paused' : 'Recording...'}
            </Typography>
          </>
        ) : audioBlob ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 2, minWidth: 70 }}>
                {formatTime(recordingTime)}
              </Typography>
              
              <Stack direction="row" spacing={1}>
                <IconButton 
                  onClick={isPlaying ? pauseAudio : playAudio}
                  color="primary"
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                
                <IconButton 
                  onClick={deleteRecording}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
            
            {isProcessing ? (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Processing audio... {uploadProgress}%
                </Typography>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={processAudio}
                fullWidth
                startIcon={<UploadFileIcon />}
                disabled={isProcessing}
              >
                Analyze Recording
              </Button>
            )}
          </>
        ) : (
          <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<MicIcon />}
              onClick={startRecording}
              fullWidth={isMobile}
              sx={{ py: 1.5 }}
            >
              Start Recording
            </Button>
            
            <Box sx={{ position: 'relative', flexGrow: isMobile ? 0 : 1 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Upload Audio File
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
      
      {!isRecording && !audioBlob && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Record or upload the doctor-patient conversation to generate a summary
        </Typography>
      )}
    </Paper>
  );
};

export default AudioRecorder;