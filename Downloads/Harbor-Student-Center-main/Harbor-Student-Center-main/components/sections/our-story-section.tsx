"use client"

import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"

export function OurStorySection() {
  return (
    <section className="py-24 sm:py-32 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Our Story"
            subtitle="How it all began"
          />
        </motion.div>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed text-base sm:text-lg">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            It started with a simple observation: many Myanmar students at Mae Fah Luang University 
            were far from home, missing the warmth of family meals and the comfort of familiar faces. 
            Some were struggling, not just with their studies, but with the loneliness that comes 
            from being in a new place.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We opened our doors—and our hearts. What began as occasional shared meals quickly grew 
            into something much bigger. Students started coming not just for the food, but for the 
            connection. They found a place where they could speak their language, share their stories, 
            and feel understood.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Today, The Harbor Student Center is more than a place to eat. It&apos;s a 
            <span className="text-foreground font-medium"> home away from home</span>—a community 
            built on the belief that no one should have to navigate university life alone. Every 
            Saturday gathering, every celebration, every quiet conversation over rice and curry 
            is part of our mission to make sure every Myanmar student at MFU feels like they belong.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
