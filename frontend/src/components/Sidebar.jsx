export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-[#0b0b0c] border-r border-[#1f1f22] text-[#e5e5e5]">

      <div className="px-4 py-3 border-b border-[#1f1f22] text-sm font-medium">
        <span className="text-[#c9a96e]">◆</span> Voice AI
      </div>

      <div className="p-3">
        <button className="w-full text-left text-sm px-3 py-2 rounded-md border border-[#1f1f22] hover:border-[#c9a96e] hover:text-[#c9a96e] transition">
          + New Chat
        </button>
      </div>

      <div className="px-3 text-xs text-gray-500">
        No history yet
      </div>
    </aside>
  );
}