"use client"

import Image from "next/image"

export function ContactHeroSection() {
  return (
    <section className="relative h-[50vh] min-h-100 w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-1.jpg"
          alt="Students connecting together"
          fill
          /* CHANGE: added 'object-top' to anchor the top of the photo. 
             If it moves too far up, use 'object-[center_25%]' for a more subtle shift.
          */
          className="object-cover object-top-[center_15%]" 
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/60" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 
          className="mb-4 text-4xl font-bold text-white sm:text-5xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Contact Us
        </h1>
        <p className="text-lg text-white/90 max-w-2xl">
          Stay connected and be part of our community
        </p>
      </div>
    </section>
  )
}