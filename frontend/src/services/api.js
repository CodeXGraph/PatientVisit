import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 60000, // 60 seconds timeout for long audio processing
  headers: {
    'Content-Type': 'application/json',
  }
});

// API service functions
export const apiService = {
  // Health check
  health: async () => {
    return await api.get('/health');
  },
  
  // Process audio file
  processAudio: async (audioFile, patientData) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    // Add patient data to form
    Object.keys(patientData).forEach(key => {
      formData.append(key, patientData[key]);
    });
    
    return await api.post('/process-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        // You can report upload progress here if needed
        console.log(
          'Upload progress: ' +
          Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%'
        );
      }
    });
  },
  
  // Get a list of patient summaries
  getSummaries: async () => {
    return await api.get('/summaries');
  },
  
  // Get a specific summary
  getSummary: async (summaryId) => {
    return await api.get(`/summaries/${summaryId}`);
  },
  
  // Delete a summary
  deleteSummary: async (summaryId) => {
    return await api.delete(`/summaries/${summaryId}`);
  },
  
  // Stream audio chunks
  streamAudioChunk: async (chunk, sessionId) => {
    return await api.post('/stream-audio', chunk, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Session-ID': sessionId
      }
    });
  },
  
  // Complete audio stream processing
  completeStream: async (sessionId, patientData) => {
    return await api.post('/complete-stream', {
      sessionId,
      ...patientData
    });
  },
  
  // Save application settings
  saveSettings: async (settings) => {
    return await api.post('/settings', settings);
  },
  
  // Get application settings
  getSettings: async () => {
    return await api.get('/settings');
  }
};

// Intercept response errors
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (response && response.data) {
      // Return error message from the API
      return Promise.reject(response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiService;