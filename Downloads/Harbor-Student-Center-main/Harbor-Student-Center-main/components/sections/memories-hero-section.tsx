"use client";

import Image from "next/image";

export function MemoriesHeroSection() {
  return (
    <section className="relative flex h-[45svh] min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[320px] md:h-[50vh] md:min-h-[360px]">
      <Image
        src="/images/memories-hero.jpg"
        alt="Group celebration"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="mb-4 text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Memories
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-balance">
          Moments we&apos;ve shared together
        </p>
      </div>
    </section>
  );
}
