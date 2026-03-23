import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Mail } from "lucide-react"

export function AboutCtaSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-secondary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-secondary-foreground mb-4 text-balance">
          Come visit us, share a meal, and be part of the community.
        </h2>
        <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
          Everyone is welcome. No registration needed—just show up with an open heart.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-secondary hover:bg-white/90"
          >
            <Link href="/events">
              <Calendar className="w-5 h-5 mr-2" />
              See Events
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 bg-transparent"
          >
            <Link href="/contact">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
