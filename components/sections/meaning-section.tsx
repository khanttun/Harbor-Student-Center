import Image from "next/image"
import { SectionHeading } from "@/components/section-heading"

export function MeaningSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <SectionHeading
              title="What This Place Means"
              subtitle="More than just a meal"
              align="left"
            />
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Yes, there&apos;s food—delicious, home-cooked meals that taste like the ones you 
                grew up with. But this place is about so much more than filling your stomach.
              </p>
              
              <p>
                It&apos;s about the conversations that happen around the table. The friendships 
                formed over shared plates. The advice from students who&apos;ve been where you 
                are. The comfort of knowing that someone cares about how you&apos;re doing.
              </p>
              
              <p>
                When you walk through our doors, you&apos;re not just a guest—you&apos;re 
                <span className="text-foreground font-medium"> family</span>. And that&apos;s 
                what makes all the difference.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/meaning-1.jpg"
                  alt="Students sharing a meal together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/meaning-2.jpg"
                  alt="Community gathering and conversation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
