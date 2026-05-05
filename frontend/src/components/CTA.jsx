import { Link } from "react-router-dom";
export function CTA() {
  return (
    <section className="px-6 py-20 text-center bg-[#0b0b0c] text-[#e5e5e5] border-t border-[#1f1f22]">

      <h2 className="text-2xl sm:text-3xl font-medium">
        Start your voice AI experience
      </h2>

      <p className="text-gray-400 mt-3 text-sm">
        No setup. Just click and talk.
      </p>

      <Link
  to="/app"
  className="inline-block mt-6 px-6 py-3 bg-[#c9a96e] text-black rounded-md text-sm"
>
  Try Now
</Link>

    </section>
  );
}