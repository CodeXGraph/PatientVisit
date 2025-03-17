// Audio recording and processing utility functions

/**
 * Start audio recording with noise reduction and voice isolation
 * @param {Object} options - Recording options
 * @returns {Promise<MediaRecorder>} - MediaRecorder instance
 */
export const startRecording = async (options = {}) => {
  // Default options
  const config = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    ...options
  };
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: config
    });
    
    // Create MediaRecorder instance
    const mediaRecorder = new MediaRecorder(stream);
    
    return { mediaRecorder, stream };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw new Error('Microphone access denied. Please check permissions.');
  }
};

/**
 * Convert audio blob to base64 string
 * @param {Blob} audioBlob - Audio blob
 * @returns {Promise<string>} - Base64 string
 */
export const audioToBase64 = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      resolve(base64Audio);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

/**
 * Create audio element from blob URL
 * @param {Blob} audioBlob - Audio blob
 * @returns {HTMLAudioElement} - Audio element
 */
export const createAudioElement = (audioBlob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  return { audio, audioUrl };
};

/**
 * Format recording time in MM:SS format
 * @param {number} seconds - Recording time in seconds
 * @returns {string} - Formatted time string
 */
export const formatRecordingTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Check if browser supports required audio capabilities
 * @returns {Object} - Object with boolean flags for each capability
 */
export const checkAudioSupport = () => {
  const mediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const audioContext = !!window.AudioContext || !!window.webkitAudioContext;
  const mediaRecorder = !!window.MediaRecorder;
  
  return {
    mediaDevices,
    audioContext,
    mediaRecorder,
    supported: mediaDevices && audioContext && mediaRecorder
  };
};

/**
 * Create audio visualizer with Web Audio API
 * @param {MediaStream} stream - Media stream from getUserMedia
 * @param {HTMLCanvasElement} canvas - Canvas element for visualization
 * @returns {Object} - Visualizer control functions
 */
export const createAudioVisualizer = (stream, canvas) => {
  if (!canvas || !stream) return null;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;
  source.connect(analyser);
  
  const canvasCtx = canvas.getContext('2d');
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  let animationFrame;
  let running = false;
  
  const draw = () => {
    if (!running) return;
    
    animationFrame = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 255 * canvas.height;
      
      // Create gradient for bar color based on frequency
      const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1976d2');
      gradient.addColorStop(1, '#42a5f5');
      
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };
  
  const start = () => {
    running = true;
    draw();
  };
  
  const stop = () => {
    running = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
  
  return {
    start,
    stop,
    analyser
  };
};