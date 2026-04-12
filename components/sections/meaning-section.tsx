"use client"

import Image from "next/image"
import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"

export function MeaningSection() {
  return (
    <section className="py-24 sm:py-32 px-4 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeading
              title="What This Place Means"
              subtitle="More than just a meal"
              centered={false}
            />
            
            <div className="space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
              <p>
                Yes, there&apos;s food—delicious, home-cooked meals that taste like the ones you 
                grew up with. But this place is about so much more than filling your stomach.
              </p>
              
              <p>
                It&apos;s about the conversations that happen around the table. The friendships 
                formed over shared plates. The advice from students who&apos;ve been where you 
                are. The comfort of knowing that someone cares about how you&apos;re doing.
              </p>
              
              <p>
                When you walk through our doors, you&apos;re not just a guest—you&apos;re 
                <span className="text-foreground font-medium"> family</span>. And that&apos;s 
                what makes all the difference.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/meaning-1.jpg"
                  alt="Students sharing a meal together"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 pt-12"
            >
              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/meaning-2.jpg"
                  alt="Community gathering and conversation"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
