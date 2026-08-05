"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1 
          }}
          className="mb-8 flex justify-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Users className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-2xl font-bold text-white sm:text-4xl md:text-5xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          You Are Always Welcome Here
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10 text-base text-white/90 leading-relaxed sm:text-xl"
        >
          Whether you want a place to eat, relax, study, or simply feel at home — 
          our doors are always open for you. Come as you are.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button 
            asChild
            size="lg" 
            className="rounded-full bg-white px-10 py-7 text-lg font-semibold text-primary shadow-xl transition-all hover:bg-white/90 hover:scale-105"
          >
            <Link href="/events">See Events</Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="rounded-full border-white bg-transparent px-10 py-7 text-lg font-semibold text-white transition-all hover:bg-white/10"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
