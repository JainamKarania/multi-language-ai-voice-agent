export function MicButton({ isRecording, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-full border flex items-center justify-center
      ${isRecording ? "bg-black text-white" : "bg-white"}`}
    >
      {isRecording ? "●" : "🎤"}
    </button>
  );
}