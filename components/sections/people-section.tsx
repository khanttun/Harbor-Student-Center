import Image from "next/image"
import { SectionHeading } from "@/components/section-heading"

export function PeopleSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="The People Behind the Community"
          subtitle="Meet the hearts that make this home"
        />

        <div className="mt-10">
          {/* Shared Image */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/images/katrina-floyd.jpg" // <-- put your combined image here
              alt="Katrina and Floyd"
              fill
              className="object-cover"
            />
          </div>

          {/* Combined Description */}
          <div className="mt-6 text-center max-w-3xl mx-auto">
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground mb-3">
              Katrina Trask Graham & Floyd S. Graham
            </h3>

            <p className="text-muted-foreground leading-relaxed text-base">
              With hearts full of love for Myanmar students, Sayarma Katrina and Sayar Floyd
              have created more than just a place to gather — they have built a
              home. Every week, they open their space to provide warm meals,
              support, and a sense of belonging. Through their generosity,
              kindness, and dedication, countless students have found comfort,
              friendship, and family far from home.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}