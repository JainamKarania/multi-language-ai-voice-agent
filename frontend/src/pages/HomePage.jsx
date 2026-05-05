import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div className="bg-[#0b0b0c]">
      <Navbar />
      <Hero />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
}