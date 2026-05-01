"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const count = memories.length
  const preview =
    previewIndex !== null && previewIndex >= 0 ? memories[previewIndex] ?? null : null

  const goPrev = useCallback(() => {
    setPreviewIndex((i) => {
      if (i === null || count <= 1) return i
      return (i - 1 + count) % count
    })
  }, [count])

  const goNext = useCallback(() => {
    setPreviewIndex((i) => {
      if (i === null || count <= 1) return i
      return (i + 1) % count
    })
  }, [count])

  useEffect(() => {
    if (previewIndex === null || count === 0) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setPreviewIndex((i) => (i === null || count <= 1 ? i : (i - 1 + count) % count))
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        setPreviewIndex((i) => (i === null || count <= 1 ? i : (i + 1) % count))
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [previewIndex, count])

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
            <motion.button 
              key={memory.src}
              type="button"
              variants={itemVariants}
              onClick={() => setPreviewIndex(index)}
              aria-haspopup="dialog"
              aria-label={`Open larger view: ${memory.alt}`}
              className={`group relative overflow-hidden rounded-2xl text-left outline-offset-4 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring ${
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
            </motion.button>
          ))}
        </motion.div>

        <Dialog
          open={previewIndex !== null}
          onOpenChange={(open) => {
            if (!open) {
              setPreviewIndex(null)
            }
          }}
        >
          <DialogContent className="max-h-[calc(100dvh-3rem)] w-[calc(100%-1.25rem)] max-w-4xl overflow-hidden p-0 gap-0 sm:p-0">
            {preview && previewIndex !== null && (
              <>
                <DialogHeader className="gap-3 border-b border-border bg-muted/30 px-5 py-4 text-left">
                  <div className="flex flex-wrap items-start justify-between gap-2 gap-y-2">
                    <DialogTitle
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-xl sm:text-2xl pr-8"
                    >
                      {preview.alt}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="sr-only">
                    Community memory photo. Use arrow keys or on-screen arrows to browse photos.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative aspect-square w-full max-h-[72dvh] bg-black">
                  {count > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          goPrev()
                        }}
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4 sm:size-12"
                      >
                        <ChevronLeft className="size-6" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          goNext()
                        }}
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4 sm:size-12"
                      >
                        <ChevronRight className="size-6" aria-hidden />
                      </button>
                    </>
                  ) : null}
                  <Image
                    src={preview.src}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 896px) 100vw, 896px"
                    priority={false}
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

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
