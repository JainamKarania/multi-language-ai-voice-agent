export function VoiceVisualizer({ isRecording }) {
  return (
    <div className="flex gap-1 items-end h-6">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-indigo-400 rounded ${
            isRecording ? "animate-pulse h-full" : "h-2"
          }`}
        />
      ))}
    </div>
  );
}