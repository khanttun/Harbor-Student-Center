"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export function UpcomingEventSection() {
  return (
    <section id="events" className="bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-2xl"
          >
            <Image
              src="/images/event.jpg"
              alt="Saturday lunch gathering at restaurant"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Upcoming Event
            </span>
            
            <h2 
              className="mb-6 text-2xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Saturday Lunch at TROIS MONTS Restaurant
            </h2>
            
            <p className="mb-8 text-base text-muted-foreground leading-relaxed sm:text-xl">
              Join us for a delicious meal with your fellow Myanmar students! Great food, great company, 
              and everything is completely free. New students are especially welcome.
            </p>

            <Card className="mb-8 border-0 bg-card shadow-lg">
              <CardContent className="flex flex-col gap-5 p-8">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">Saturday, March 29, 2026</span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">3:00 PM - 6:00 PM</span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">TROIS MONTS Restaurant, Chiang Rai</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              asChild
              size="lg" 
              className="rounded-full bg-primary px-10 py-7 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
