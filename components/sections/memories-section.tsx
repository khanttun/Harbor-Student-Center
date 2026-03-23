import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"

const memories = [
  { src: "/images/memory-1.jpg", alt: "Students enjoying food together" },
  { src: "/images/memory-2.jpg", alt: "Group celebration photo" },
  { src: "/images/memory-3.jpg", alt: "Cooking session" },
  { src: "/images/memory-4.jpg", alt: "Birthday celebration" },
  { src: "/images/memory-5.jpg", alt: "Community gathering" },
  { src: "/images/memory-6.jpg", alt: "Students having fun" },
]

export function MemoriesSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Community Moments"
          subtitle="Real moments from our gatherings, celebrations, and everyday life together."
        />

        {/* Photo Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory, index) => (
            <div 
              key={memory.src}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <Image
                src={memory.src}
                alt={memory.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="rounded-full border-primary px-8 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/memories">View All Memories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
