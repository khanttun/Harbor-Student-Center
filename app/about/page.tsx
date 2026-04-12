"use client";

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutHeroSection } from "@/components/sections/about-hero-section"
import { OurStorySection } from "@/components/sections/our-story-section"
import { PeopleSection } from "@/components/sections/people-section"
import { ValuesSection } from "@/components/sections/values-section"
import { QuoteSection } from "@/components/sections/quote-section"
import { MeaningSection } from "@/components/sections/meaning-section"
import { AboutCtaSection } from "@/components/sections/about-cta-section"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      <div className="relative z-10">
        <AboutHeroSection />
        <OurStorySection />
        <PeopleSection />
        <ValuesSection />
        <QuoteSection />
        <MeaningSection />
        <AboutCtaSection />
      </div>
      <Footer />
    </motion.main>
  )
}
