"use client"

import { motion } from "framer-motion"

export function QuoteSection() {
  return (
    <section className="py-24 sm:py-32 px-4 bg-primary/[0.03]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative px-8"
        >
          <span className="absolute -top-12 left-0 text-8xl sm:text-9xl text-primary/10 font-serif leading-none select-none">&ldquo;</span>
          <p className="font-[family-name:var(--font-heading)] text-xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight sm:leading-relaxed text-balance">
            We do this because we love Myanmar people.
          </p>
          <span className="absolute -bottom-16 right-0 text-8xl sm:text-9xl text-primary/10 font-serif leading-none select-none">&rdquo;</span>
        </motion.blockquote>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-muted-foreground font-medium sm:text-lg"
        >
          — Katrina & Floyd Graham
        </motion.p>
      </div>
    </section>
  )
}
