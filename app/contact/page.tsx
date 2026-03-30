import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactHeroSection } from "@/components/sections/contact-hero-section"
import { ContactMethodsSection } from "@/components/sections/contact-methods-section"
import { LocationSection } from "@/components/sections/location-section"
import { ContactCTASection } from "@/components/sections/contact-cta-section"
import { ThankYouForm } from "@/components/ThankYouForm"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactHeroSection />
      <ContactMethodsSection />
      <LocationSection />
      
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">Leave a Note of Kindness</h2>
            <p className="text-muted-foreground text-lg">Did someone do something nice? Got a moment to be thankful? Drop it here.</p>
          </div>
          <ThankYouForm />
        </div>
      </section>

      <ContactCTASection />
      <Footer />
    </main>
  )
}
