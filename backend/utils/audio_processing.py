#!/usr/bin/env python3
import numpy as np
import librosa
import noisereduce as nr
import torch
from scipy import signal

def noise_reduction(audio_data, sample_rate=44100):
    """
    Apply noise reduction to audio data
    
    Args:
        audio_data: numpy array of audio data
        sample_rate: sampling rate of audio data
        
    Returns:
        Processed audio data with reduced noise
    """
    # Convert to float32 if not already
    if audio_data.dtype != np.float32:
        audio_data = audio_data.astype(np.float32)
    
    # Apply noise reduction
    reduced_noise = nr.reduce_noise(
        y=audio_data.flatten(), 
        sr=sample_rate,
        stationary=False,
        prop_decrease=0.75
    )
    
    return reduced_noise.reshape(-1, 1)

def voice_isolation(audio_data, sample_rate=44100):
    """
    Isolate human voice from background sounds
    
    Args:
        audio_data: numpy array of audio data
        sample_rate: sampling rate of audio data
        
    Returns:
        Processed audio data with isolated voice
    """
    # Convert to float32 if not already
    if audio_data.dtype != np.float32:
        audio_data = audio_data.astype(np.float32)
    
    # Flatten if 2D
    audio_flat = audio_data.flatten()
    
    # Apply bandpass filter to focus on speech frequencies (typically 85-255 Hz)
    nyquist = 0.5 * sample_rate
    low = 80 / nyquist
    high = 3000 / nyquist
    b, a = signal.butter(4, [low, high], btype='band')
    filtered_audio = signal.lfilter(b, a, audio_flat)
    
    # Apply spectral gating
    # In a real implementation, would use a more sophisticated voice isolation model
    # For example, a deep learning model like Demucs or using a Wiener filter
    
    return filtered_audio.reshape(-1, 1)

def preprocess_audio_for_transcription(file_path):
    """
    Load audio file and preprocess it for transcription
    
    Args:
        file_path: path to audio file
        
    Returns:
        Processed audio data ready for transcription
    """
    # Load audio file
    audio_data, sample_rate = librosa.load(file_path, sr=None)
    
    # Apply noise reduction
    audio_data = noise_reduction(audio_data.reshape(-1, 1), sample_rate)
    
    # Apply voice isolation
    audio_data = voice_isolation(audio_data, sample_rate)
    
    return audio_data, sample_rate