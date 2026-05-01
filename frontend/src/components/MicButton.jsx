export function MicButton({ isRecording, isProcessing, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      style={{
        width: 72, height: 72, borderRadius: '50%', border: 'none',
        background: isRecording ? '#e74c3c' : isProcessing ? '#95a5a6' : '#6c63ff',
        color: '#fff', fontSize: 28, cursor: isProcessing ? 'not-allowed' : 'pointer',
        boxShadow: isRecording
          ? '0 0 0 8px rgba(231,76,60,0.25), 0 0 0 16px rgba(231,76,60,0.1)'
          : '0 4px 16px rgba(108,99,255,0.4)',
        transition: 'all 0.2s ease',
        animation: isRecording ? 'pulse 1.5s infinite' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
      title={isRecording ? 'Click to stop' : 'Click to speak'}
    >
      {isProcessing ? '⏳' : isRecording ? '⏹' : '🎤'}
    </button>
  )
}
