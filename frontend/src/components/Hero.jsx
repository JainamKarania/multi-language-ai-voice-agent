import { Link } from "react-router-dom";
export function Hero() {
  return (
    <section className="text-center px-6 py-24 bg-[#0b0b0c] text-[#e5e5e5]">
      <h1 className="text-3xl sm:text-5xl font-semibold leading-tight max-w-3xl mx-auto">
        Talk to AI.
        <span className="text-[#c9a96e]"> Naturally.</span>
      </h1>

      <p className="mt-6 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
        A voice-first AI assistant that listens, understands, and responds in
        real-time.
      </p>

      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <Link
          to="/app"
          className="px-6 py-3 bg-[#c9a96e] text-black rounded-md text-sm"
        >
          Start Talking
        </Link>

        <a
          href="#services"
          className="px-6 py-3 border border-[#1f1f22] text-gray-300 rounded-md text-sm hover:border-[#c9a96e]"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
