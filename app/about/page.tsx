import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutHeroSection } from "@/components/sections/about-hero-section"
import { OurStorySection } from "@/components/sections/our-story-section"
import { PeopleSection } from "@/components/sections/people-section"
import { ValuesSection } from "@/components/sections/values-section"
import { QuoteSection } from "@/components/sections/quote-section"
import { MeaningSection } from "@/components/sections/meaning-section"
import { AboutCtaSection } from "@/components/sections/about-cta-section"

export const metadata = {
  title: "About Us | The Harbor Student Center",
  description: "Learn about The Harbor Student Center at Mae Fah Luang University - our story, our values, and the people who make this community a home away from home.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AboutHeroSection />
      <OurStorySection />
      <PeopleSection />
      <ValuesSection />
      <QuoteSection />
      <MeaningSection />
      <AboutCtaSection />
      <Footer />
    </main>
  )
}
