"use client"

import { motion } from "framer-motion"

export function QuoteSection() {
  return (
    <section className="overflow-hidden bg-primary/[0.03] px-4 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.blockquote 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative px-2 sm:px-8"
        >
          <span className="absolute -top-8 left-0 select-none font-serif text-5xl leading-none text-primary/10 sm:-top-12 sm:text-8xl md:text-9xl">&ldquo;</span>
          <p className="font-[family-name:var(--font-heading)] text-lg font-bold leading-tight text-foreground text-balance sm:text-3xl sm:leading-relaxed lg:text-4xl">
            We do this because we love Myanmar people.
          </p>
          <span className="absolute -bottom-10 right-0 select-none font-serif text-5xl leading-none text-primary/10 sm:-bottom-16 sm:text-8xl md:text-9xl">&rdquo;</span>
        </motion.blockquote>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 font-medium text-muted-foreground sm:mt-12 sm:text-lg"
        >
          — Katrina & Floyd Graham
        </motion.p>
      </div>
    </section>
  )
}
