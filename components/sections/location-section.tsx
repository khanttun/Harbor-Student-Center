"use client"

import { MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LocationSection() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 
            className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            📍 Visit Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Come by the student center and spend time with us
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Map Placeholder */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="relative h-[400px] w-full bg-gradient-to-br from-primary/20 to-primary/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.3949359987526!2d100.2!3d20.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHarbor%20Student%20Center!5e0!3m2!1sen!2sth!4v0000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Card>

          {/* Location Details */}
          <div className="flex flex-col justify-center space-y-6">
            <Card className="border-0 bg-card shadow-lg">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Harbor Student Center</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mae Fah Luang University<br />
                    Student Center Building<br />
                    Chiang Rai, Thailand
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-lg">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Hours of Operation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Tuesday – Friday:</strong> Open for meals and activities<br />
                    <strong>Saturday:</strong> Special meal gatherings<br />
                    <strong>Sunday – Monday:</strong> Closed
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-foreground leading-relaxed">
                💡 <strong>Pro Tip:</strong> We offer free food, a welcoming space to study, and a community ready to support you. Whether you're having a tough day or just want to connect, we're here for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
