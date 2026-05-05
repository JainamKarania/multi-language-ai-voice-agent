import { MessageBubble } from "./MessageBubble";

export function ChatArea({ messages, statusMsg, messagesEndRef }) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#0b0b0c]">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {messages.length === 0 && (
          <div className="text-center mt-24 text-gray-500">
            <p className="text-sm text-[#c9a96e]">Start a conversation</p>
            <p className="text-xs mt-1">Voice or text</p>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}
        </div>

        {statusMsg && (
          <div className="text-center text-xs text-[#a8894f] mt-6">
            {statusMsg}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}