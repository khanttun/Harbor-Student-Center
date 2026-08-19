import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedMain } from "@/components/animated-main"
import { HeroSection } from "@/components/sections/hero-section"
import { QuickInfoBar } from "@/components/sections/quick-info-bar"
import { MissionSection } from "@/components/sections/mission-section"
import { WhatWeDoSection } from "@/components/sections/what-we-do-section"
import { HarborDesignShowcase } from "@/components/sections/harbor-design-showcase"
import { UpcomingEventSection } from "@/components/sections/upcoming-event-section"
import { MemoriesSection } from "@/components/sections/memories-section"
import { CTASection } from "@/components/sections/cta-section"
import { Announcements } from "@/components/Announcements"

export default function HomePage() {
  return (
    <AnimatedMain>
      <Navbar />
      <HeroSection />
      <QuickInfoBar />

      <div className="relative z-10 bg-background">
        <UpcomingEventSection />
        <MissionSection />
        <WhatWeDoSection />
        <HarborDesignShowcase />

        <section className="py-20 sm:py-32 bg-background">
          <div className="container max-w-6xl px-4 mx-auto">
            <Announcements />
          </div>
        </section>

        <MemoriesSection />
        <CTASection />
      </div>

      <Footer />
    </AnimatedMain>
  );
}
