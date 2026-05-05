export function Services() {
  const items = [
    {
      title: "Voice Interaction",
      desc: "Speak naturally and get instant AI responses.",
    },
    {
      title: "Multilingual Support",
      desc: "Communicate in English and Hindi seamlessly.",
    },
    {
      title: "Real-time AI",
      desc: "Fast responses powered by LLMs and speech models.",
    },
  ];

  return (
    <section
      id="services"
      className="px-6 py-20 bg-[#0b0b0c] text-[#e5e5e5]"
    >
      <h2 className="text-center text-2xl font-medium mb-12">
        What you can do
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {items.map((item, i) => (
          <div
            key={i}
            className="border border-[#1f1f22] bg-[#111113] p-6 rounded-lg hover:border-[#c9a96e] transition"
          >
            {/* Pixel Accent */}
            <div className="w-6 h-6 grid grid-cols-2 gap-[2px] mb-4">
              <div className="bg-[#c9a96e]" />
              <div className="bg-[#1f1f22]" />
              <div className="bg-[#1f1f22]" />
              <div className="bg-[#c9a96e]" />
            </div>

            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-2">{item.desc}</p>
          </div>
        ))}

      </div>
    </section>
  );
}