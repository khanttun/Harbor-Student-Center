import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function ContactCTASection() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 
          className="mb-6 text-3xl font-bold text-white sm:text-4xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Whether you're new or have been here for years, you are always welcome.
        </h2>
        
        <p className="mb-10 text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          Come by for a meal, join our community activities, or simply be part of a space where you belong. We can't wait to see you.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button 
            asChild
            size="lg" 
            className="rounded-full bg-white px-8 text-primary shadow-lg transition-all hover:bg-white/90 hover:scale-105"
          >
            <Link href="/events">See Events</Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="rounded-full border-white bg-transparent px-8 text-white transition-all hover:bg-white/10"
          >
            <Link href="/memories">View Memories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
