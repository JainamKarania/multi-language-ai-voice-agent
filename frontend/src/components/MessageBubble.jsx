export function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : ""}`}>

      {/* AI Avatar (Pixel Style) */}
      {!isUser && (
        <div className="w-8 h-8 grid grid-cols-2 gap-[2px]">
          <div className="bg-[#c9a96e]" />
          <div className="bg-[#1f1f22]" />
          <div className="bg-[#1f1f22]" />
          <div className="bg-[#c9a96e]" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-md px-4 py-2 text-sm leading-relaxed rounded-lg border
        ${
          isUser
            ? "bg-[#c9a96e] text-black border-[#c9a96e]"
            : "bg-[#111113] text-[#e5e5e5] border-[#1f1f22]"
        }`}
      >
        {text}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 grid grid-cols-2 gap-[2px]">
          <div className="bg-white" />
          <div className="bg-[#c9a96e]" />
          <div className="bg-[#c9a96e]" />
          <div className="bg-white" />
        </div>
      )}
    </div>
  );
}