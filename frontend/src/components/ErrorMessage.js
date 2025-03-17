import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="error-container" style={{ 
      padding: '16px', 
      margin: '16px 0', 
      backgroundColor: '#ffebee', 
      color: '#c62828',
      borderRadius: '4px',
      border: '1px solid #ef9a9a'
    }}>
      <h3>Error</h3>
      <p>{error || 'Error processing audio. Please try again.'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            backgroundColor: '#c62828',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      )}
      <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
        <p>Troubleshooting tips:</p>
        <ul>
          <li>Check your internet connection</li>
          <li>Ensure your audio file format is supported (.wav, .mp3, .ogg, .m4a)</li>
          <li>The file size should be less than 50MB</li>
          <li>Make sure your microphone permissions are enabled</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorMessage;
