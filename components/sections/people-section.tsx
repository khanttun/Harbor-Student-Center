"use client"

import { SectionHeading } from "@/components/section-heading"
import { ImageCard } from "@/components/image-card"
import { motion } from "framer-motion"

export function PeopleSection() {
  return (
    <section className="py-24 sm:py-32 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="The People Behind the Community"
            subtitle="Meet the hearts that make this home"
          />
        </motion.div>

        <div className="mt-12 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            <ImageCard
              src="/images/katrina-floyd.jpg"
              alt="Katrina and Floyd"
              title="Katrina Trask Graham & Floyd S. Graham"
              description="The coordinators behind The Harbor Student Center — opening their hearts and home to Myanmar students at Mae Fah Luang University."
              className="aspect-[16/10] rounded-3xl shadow-2xl sm:aspect-[16/9]"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-center max-w-3xl mx-auto"
          >
            <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Katrina Trask Graham & Floyd S. Graham
            </h3>

            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              With hearts full of love for Myanmar students, Sayarma Katrina and Sayar Floyd
              have created more than just a place to gather — they have built a
              home. Every week, they open their space to provide warm meals,
              support, and a sense of belonging. Through their generosity,
              kindness, and dedication, countless students have found comfort,
              friendship, and family far from home.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
