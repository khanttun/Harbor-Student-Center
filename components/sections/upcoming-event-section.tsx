"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const SPOTLIGHT_IMAGE_SRC = "/images/event.jpg"

export function UpcomingEventSection() {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <section id="events" className="bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={() => setPreviewOpen(true)}
            aria-haspopup="dialog"
            aria-label="Open larger event photo"
            className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl text-left shadow-2xl outline-offset-4 transition-transform hover:brightness-[1.02] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={SPOTLIGHT_IMAGE_SRC}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </motion.button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Weekend Activity (Unless Otherwise Specified)
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
              <CardContent className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-8">
                <div className="flex items-start gap-3 text-foreground sm:items-center sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">Saturday, March 29, 2026</span>
                </div>
                <div className="flex items-start gap-3 text-foreground sm:items-center sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">3:00 PM - 5:30 PM</span>
                </div>
                <div className="flex items-start gap-3 text-foreground sm:items-center sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">TROIS MONTS Restaurant, Chiang Rai</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              asChild
              size="lg" 
              className="w-full rounded-full bg-primary px-6 py-5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 sm:w-auto sm:px-10 sm:py-7 sm:text-lg"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </motion.div>
        </div>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-h-[calc(100dvh-3rem)] w-[calc(100%-1.25rem)] max-w-4xl overflow-hidden p-0 gap-0 sm:p-0">
            <DialogHeader className="gap-2 border-b border-border bg-muted/30 px-5 py-4 text-left">
              <DialogTitle style={{ fontFamily: "var(--font-heading)" }} className="text-xl sm:text-2xl">
                Saturday Lunch at TROIS MONTS Restaurant
              </DialogTitle>
              <p className="text-sm font-medium text-foreground">
                Saturday, March 29, 2026 · 3:00 PM – 5:30 PM · TROIS MONTS Restaurant, Chiang Rai
              </p>
              <DialogDescription className="sr-only">
                Large photo of Saturday lunch gathering
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full max-h-[72dvh] bg-black">
              <Image
                src={SPOTLIGHT_IMAGE_SRC}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
            <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-3">
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/events">See more events</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
