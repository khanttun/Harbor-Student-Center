import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function UpcomingEventSection() {
  return (
    <section id="events" className="bg-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/event.jpg"
              alt="Saturday lunch gathering at restaurant"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Upcoming Event
            </span>
            
            <h2 
              className="mb-6 text-3xl font-bold text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Saturday Lunch at Trios Mouth Restaurant
            </h2>
            
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Join us for a delicious meal with your fellow Myanmar students! Great food, great company, 
              and everything is completely free. New students are especially welcome.
            </p>

            <Card className="mb-8 border-0 bg-card shadow-md">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3 text-foreground">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span>Saturday, March 29, 2026</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>12:00 PM - 2:00 PM</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Trios Mouth Restaurant, Chiang Rai</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              asChild
              size="lg" 
              className="rounded-full bg-primary px-8 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
