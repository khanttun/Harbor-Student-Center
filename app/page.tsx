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

export default function HomePage() {
  return (
   <main
      className="min-h-screen"
    >
      <Navbar />
      <HeroSection />
      <MissionSection />
      <WhatWeDoSection />
      <UpcomingEventSection />
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <Announcements />
        </div>
      </section>
      <MemoriesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
