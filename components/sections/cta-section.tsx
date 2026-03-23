import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 
          className="mb-6 text-3xl font-bold text-white sm:text-4xl text-balance"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          You Are Always Welcome Here
        </h2>
        
        <p className="mb-10 text-lg text-white/90 leading-relaxed">
          Whether you want a place to eat, relax, study, or simply feel at home — 
          our doors are always open for you. Come as you are.
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
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
