"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Mail } from "lucide-react"
import { motion } from "framer-motion"

export function AboutCtaSection() {
  return (
    <section className="py-24 sm:py-32 px-4 bg-secondary">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-foreground mb-6 text-balance"
        >
          Come visit us, share a meal, and be part of the community.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-secondary-foreground/80 mb-10 max-w-xl mx-auto text-base sm:text-lg"
        >
          Everyone is welcome. No registration needed—just show up with an open heart.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-white px-6 py-5 text-base font-semibold text-secondary shadow-lg transition-all hover:scale-105 hover:bg-white/90 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
          >
            <Link href="/events">
              <Calendar className="w-5 h-5 mr-2" />
              See Events
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full rounded-full border-white bg-transparent px-6 py-5 text-base font-semibold text-white hover:bg-white/10 sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
          >
            <Link href="/contact">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
