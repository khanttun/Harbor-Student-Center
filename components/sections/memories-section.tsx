"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"

const memories = [
  { src: "/images/memory-1.jpg", alt: "Students enjoying food together" },
  { src: "/images/memory-2.jpg", alt: "Group celebration photo" },
  { src: "/images/memory-3.jpg", alt: "Cooking session" },
  { src: "/images/memory-4.jpg", alt: "Birthday celebration" },
  { src: "/images/memory-5.jpg", alt: "Community gathering" },
  { src: "/images/memory-6.jpg", alt: "Students having fun" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function MemoriesSection() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Community Moments"
          subtitle="Real moments from our gatherings, celebrations, and everyday life together."
        />

        {/* Photo Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {memories.map((memory, index) => (
            <motion.div 
              key={memory.src}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <Image
                src={memory.src}
                alt={memory.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{memory.alt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="rounded-full border-primary px-10 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/memories">View All Memories</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
