"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function AboutHeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/images/about-hero.jpg"
          alt="Myanmar students gathering together as a community"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-[family-name:var(--font-heading)] text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 text-balance"
        >
          About Us
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl text-pretty"
        >
          Built on kindness, community, and care for Myanmar students
        </motion.p>
      </div>
    </section>
  )
}
