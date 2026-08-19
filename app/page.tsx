import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedMain } from "@/components/animated-main"
import { HeroSection } from "@/components/sections/hero-section"
import { MissionSection } from "@/components/sections/mission-section"
import { WhatWeDoSection } from "@/components/sections/what-we-do-section"
import { HarborDesignShowcase } from "@/components/sections/harbor-design-showcase"
import { UpcomingEventSection } from "@/components/sections/upcoming-event-section"
import { MemoriesSection } from "@/components/sections/memories-section"
import { CTASection } from "@/components/sections/cta-section"
import { Announcements } from "@/components/Announcements"
import { FirstVisitWelcomeDialog } from "@/components/first-visit-welcome-dialog"
import { getWelcomeContent } from "@/lib/welcome-data"

export default async function HomePage() {
  const { announcement, event } = await getWelcomeContent()

  return (
    <AnimatedMain>
      <FirstVisitWelcomeDialog announcement={announcement} event={event} />
      <Navbar />
      <HeroSection />

      <div className="relative z-10 bg-background">
        <MissionSection />
        <WhatWeDoSection />
        <HarborDesignShowcase />
        <UpcomingEventSection />

        <section className="py-20 sm:py-32 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <Announcements latestAnnouncement={announcement} />
          </div>
        </section>

        <MemoriesSection />
        <CTASection />
      </div>

      <Footer />
    </AnimatedMain>
  );
}
