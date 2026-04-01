"use client";

import Image from "next/image";

export function MemoriesHeroSection() {
  return (
    <section className="relative h-[50vh] min-h-100 flex items-center justify-center overflow-hidden">
      <Image
        src="/images/memories-hero.jpg"
        alt="Group celebration"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Memories
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-balance">
          Moments we&apos;ve shared together
        </p>
      </div>
    </section>
  );
}
