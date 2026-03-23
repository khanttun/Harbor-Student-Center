import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactHeroSection } from "@/components/sections/contact-hero-section"
import { ContactMethodsSection } from "@/components/sections/contact-methods-section"
import { LocationSection } from "@/components/sections/location-section"
import { ContactCTASection } from "@/components/sections/contact-cta-section"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactHeroSection />
      <ContactMethodsSection />
      <LocationSection />
      <ContactCTASection />
      <Footer />
    </main>
  )
}
