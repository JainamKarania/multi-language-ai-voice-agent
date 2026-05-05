export function Footer() {
  return (
    <footer className="px-6 py-6 border-t border-[#1f1f22] bg-[#0b0b0c] text-gray-400 text-sm flex flex-col sm:flex-row justify-between items-center">

      <p>© 2026 Voice AI</p>

      <div className="flex gap-4 mt-2 sm:mt-0">
        <a href="#" className="hover:text-[#c9a96e]">GitHub</a>
        <a href="#" className="hover:text-[#c9a96e]">LinkedIn</a>
      </div>
    </footer>
  );
}