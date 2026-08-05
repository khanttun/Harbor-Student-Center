import Image from "next/image";

export function EventsHeroSection() {
  return (
    <section className="relative flex h-[45svh] min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[320px] md:h-[50vh] md:min-h-[360px]">
      <Image
        src="/images/event-hero.jpg"
        alt="Students gathering for events"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10 text-center px-4">
        <h1 className="mb-4 text-3xl font-bold text-white font-heading text-balance sm:text-4xl md:text-5xl lg:text-6xl">
          Events & Schedule
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-pretty">
          Join us, eat well, and spend time together
        </p>
      </div>
    </section>
  );
}
