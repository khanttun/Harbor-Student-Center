import Image from "next/image";

export function EventsHeroSection() {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <Image
        src="/images/event-hero.jpg"
        alt="Students gathering for events"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-heading)] text-balance">
          Events & Schedule
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-pretty">
          Join us, eat well, and spend time together
        </p>
      </div>
    </section>
  );
}
