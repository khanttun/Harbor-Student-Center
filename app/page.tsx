'use client';
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { MissionSection } from "@/components/sections/mission-section"
import { WhatWeDoSection } from "@/components/sections/what-we-do-section"
import { UpcomingEventSection } from "@/components/sections/upcoming-event-section"
import { MemoriesSection } from "@/components/sections/memories-section"
import { CTASection } from "@/components/sections/cta-section"
import { Announcements } from "@/components/Announcements"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      <HeroSection />
      
      <div className="relative z-10 bg-background">
        <MissionSection />
        <WhatWeDoSection />
        <UpcomingEventSection />
        
        <section className="py-20 sm:py-32 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <Announcements />
          </div>
        </section>
        
        <MemoriesSection />
        <CTASection />
      </div>
      
      <Footer />
    </motion.main>
  );
}
