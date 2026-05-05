import { Link } from "react-router-dom";
export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f22] bg-[#0b0b0c] text-[#e5e5e5]">
      
      <h1 className="text-sm tracking-wide">
        <span className="text-[#c9a96e]">◆</span> Voice AI
      </h1>

      <div className="hidden md:flex gap-6 text-sm text-gray-400">
        <a href="#services" className="hover:text-[#c9a96e]">Services</a>
        <a href="#about" className="hover:text-[#c9a96e]">About</a>
      </div>

      <Link
  to="/app"
  className="text-sm px-4 py-2 border border-[#c9a96e] text-[#c9a96e] rounded hover:bg-[#c9a96e] hover:text-black transition"
>
  Try Now
</Link>
    </nav>
  );
}