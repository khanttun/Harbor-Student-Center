"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  {
    src: "/images/hero-group.jpg",
    alt: "The Harbor Student Center",
  },
  {
    src: "/images/hero-2.png",
    alt: "Community cooking session",
  },
  {
    src: "/images/hero-3.png",
    alt: "Group celebration",
  },
]

const AUTOPLAY_DELAY_MS = 7500

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutoplayEnabled(!mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setAutoplayEnabled(!e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (isPaused || !autoplayEnabled) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_DELAY_MS)
    return () => clearInterval(timer)
  }, [isPaused, autoplayEnabled])

  function goToSlide(index: number) {
    setCurrentSlide(index)
    // A manual choice means the visitor wants control — stop auto-advancing.
    setAutoplayEnabled(false)
  }

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        if (!sectionRef.current?.contains(e.relatedTarget as Node)) setIsPaused(false)
      }}
      className="relative h-[70svh] min-h-[420px] w-full overflow-hidden sm:min-h-[500px] md:min-h-[560px] lg:min-h-[600px]"
    >
      {/* Slideshow */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].src}
            alt={slides[currentSlide].alt}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-3xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          A Home Away From Home
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mb-8 text-base text-white/90 sm:text-xl md:text-2xl"
        >
          For Myanmar students at Mae Fah Luang University
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <Button
            asChild
            size="lg"
            className="px-6 py-5 text-base font-semibold transition-all rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 sm:px-8 sm:py-6 sm:text-lg"
          >
            <Link href="/events">See This Week&rsquo;s Events</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-6 py-5 text-base font-semibold text-white transition-all border-2 border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 sm:px-8 sm:py-6 sm:text-lg"
          >
            <Link href="/contact">How to Find Us</Link>
          </Button>
        </motion.div>
      </div>

      {/* Prev / Next controls */}
      <button
        type="button"
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute z-10 hidden p-2 text-white transition-colors -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/30 outline-offset-2 hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-white sm:flex sm:left-4"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute z-10 hidden p-2 text-white transition-colors -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/30 outline-offset-2 hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-white sm:flex sm:right-4"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-8 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all outline-offset-2 focus-visible:outline-2 focus-visible:outline-white ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}