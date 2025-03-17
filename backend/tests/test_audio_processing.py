import os
import unittest
import numpy as np
from utils.audio_processing import noise_reduction, voice_isolation

class TestAudioProcessing(unittest.TestCase):
    def setUp(self):
        # Create sample audio data (sine wave with noise)
        self.sample_rate = 44100
        t = np.linspace(0, 2, self.sample_rate * 2)
        # Clean signal (440 Hz sine wave)
        clean_signal = 0.5 * np.sin(2 * np.pi * 440 * t)
        # Add noise
        noise = 0.1 * np.random.normal(0, 1, len(t))
        self.noisy_signal = clean_signal + noise
        # Reshape to match expected format
        self.noisy_signal = self.noisy_signal.reshape(-1, 1)
    
    def test_noise_reduction(self):
        # Test that noise reduction reduces noise
        processed_signal = noise_reduction(self.noisy_signal, self.sample_rate)
        
        # Check shape is preserved
        self.assertEqual(processed_signal.shape, self.noisy_signal.shape)
        
        # Check that overall signal power is reduced (as noise is removed)
        original_power = np.mean(self.noisy_signal**2)
        processed_power = np.mean(processed_signal**2)
        self.assertLess(processed_power, original_power)
    
    def test_voice_isolation(self):
        # Test that voice isolation keeps speech frequencies
        processed_signal = voice_isolation(self.noisy_signal, self.sample_rate)
        
        # Check shape is preserved (may be reshaped to 1D in function)
        self.assertEqual(processed_signal.shape, self.noisy_signal.shape)
        
        # More sophisticated tests would analyze the frequency spectrum
        # to ensure speech frequencies are preserved

if __name__ == "__main__":
    unittest.main()