export function InputBar({
  textInput,
  setTextInput,
  onSend,
  isProcessing,
  isRecording,
  onMicClick,
}) {
  return (
    <footer className="border-t border-[#1f1f22] bg-[#0b0b0c]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">

        {/* Mic */}
        <button
          onClick={onMicClick}
          disabled={isProcessing}
          className={`w-9 h-9 flex items-center justify-center rounded border text-sm transition
          ${
            isRecording
              ? "bg-[#c9a96e] text-black border-[#c9a96e]"
              : "bg-[#111113] border-[#1f1f22] hover:border-[#c9a96e]"
          }`}
        >
          {isRecording ? "●" : "🎤"}
        </button>

        {/* Input */}
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Message..."
          disabled={isProcessing || isRecording}
          className="flex-1 px-3 py-2 text-sm bg-[#111113] border border-[#1f1f22] rounded outline-none focus:border-[#c9a96e] text-white placeholder-gray-500"
        />

        {/* Send */}
        <button
          onClick={onSend}
          disabled={!textInput.trim() || isProcessing || isRecording}
          className={`px-3 py-2 text-sm rounded border transition
          ${
            !textInput.trim() || isProcessing
              ? "text-gray-500 border-[#1f1f22]"
              : "text-[#c9a96e] border-[#c9a96e] hover:bg-[#c9a96e] hover:text-black"
          }`}
        >
          Send
        </button>
      </div>
    </footer>
  );
}