/**
 * API utility functions with error handling
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Process audio file
 * @param {File} audioFile - The audio file to process
 * @param {string} patientId - The patient ID
 * @param {string} visitDate - The visit date
 * @returns {Promise} - The processed audio result
 */
export const processAudio = async (audioFile, patientId, visitDate) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('patientId', patientId);
    
    if (visitDate) {
      formData.append('visitDate', visitDate);
    }

    const response = await fetch(`${API_BASE_URL}/process-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Server error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing audio:', error);
    throw new Error(`Error processing audio: ${error.message}`);
  }
};

/**
 * Health check for API
 * @returns {Promise} - The health check result
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw new Error('API server is unavailable. Please check your connection.');
  }
};
