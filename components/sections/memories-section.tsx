"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePreviewDialog, type ImagePreviewItem } from "@/components/image-preview-dialog"
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

const previewItems: ImagePreviewItem[] = memories.map((m) => ({
  src: m.src,
  alt: m.alt,
  title: m.alt,
}))

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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

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
          className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-3 lg:gap-4"
        >
          {memories.map((memory, index) => (
            <motion.button
              key={memory.src}
              type="button"
              variants={itemVariants}
              onClick={() => setPreviewIndex(index)}
              aria-haspopup="dialog"
              aria-label={`Open larger view: ${memory.alt}`}
              className={`group relative overflow-hidden rounded-2xl text-left outline-offset-4 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring ${
                index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <Image
                src={memory.src}
                alt={memory.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-4 sm:left-4 sm:right-4">
                <p className="text-[11px] font-medium text-white sm:text-sm">{memory.alt}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <ImagePreviewDialog
          item={previewIndex !== null ? previewItems[previewIndex] ?? null : null}
          open={previewIndex !== null}
          onOpenChange={(open) => { if (!open) setPreviewIndex(null) }}
          items={previewItems}
          currentIndex={previewIndex ?? 0}
          onNavigate={setPreviewIndex}
        />

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
