"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export function MissionSection() {
  return (
    <section className="bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
            <Heart className="h-8 w-8 text-secondary" />
          </div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-2xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Our Purpose
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 text-base leading-relaxed text-muted-foreground sm:text-xl"
        >
          The Harbor Student Center is a free, independent space created with love for Myanmar students 
          studying at Mae Fah Luang University. We are not affiliated with the university — we are simply 
          a community of people who want to give students a place to relax, eat, connect, and feel at home.
        </motion.p>
        
        <motion.blockquote 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative rounded-3xl bg-card p-10 shadow-xl border border-primary/5"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <span className="text-7xl text-primary/20">&ldquo;</span>
          </div>
          <p 
            className="text-lg italic text-foreground sm:text-2xl md:text-3xl leading-snug"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            The Harbor: A secure and welcoming place where you can rest after a difficult journey.
          </p>
        </motion.blockquote>
      </div>
    </section>
  )
}
