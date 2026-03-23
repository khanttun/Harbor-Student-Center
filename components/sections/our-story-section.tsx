import { SectionHeading } from "@/components/section-heading"

export function OurStorySection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          title="Our Story"
          subtitle="How it all began"
        />
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            It started with a simple observation: many Myanmar students at Mae Fah Luang University 
            were far from home, missing the warmth of family meals and the comfort of familiar faces. 
            Some were struggling, not just with their studies, but with the loneliness that comes 
            from being in a new place.
          </p>
          
          <p>
            We opened our doors—and our hearts. What began as occasional shared meals quickly grew 
            into something much bigger. Students started coming not just for the food, but for the 
            connection. They found a place where they could speak their language, share their stories, 
            and feel understood.
          </p>
          
          <p>
            Today, the Myanmar Student Center is more than a place to eat. It&apos;s a 
            <span className="text-foreground font-medium"> home away from home</span>—a community 
            built on the belief that no one should have to navigate university life alone. Every 
            Saturday gathering, every celebration, every quiet conversation over rice and curry 
            is part of our mission to make sure every Myanmar student at MFU feels like they belong.
          </p>
        </div>
      </div>
    </section>
  )
}
