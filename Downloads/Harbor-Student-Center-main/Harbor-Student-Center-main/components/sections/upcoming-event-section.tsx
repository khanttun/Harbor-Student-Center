"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePreviewDialog } from "@/components/image-preview-dialog"
import { motion } from "framer-motion"

const SPOTLIGHT_IMAGE_SRC = "/images/event.jpg"
const SPOTLIGHT_TITLE = "Saturday Lunch at TROIS MONTS Restaurant"
const SPOTLIGHT_META = "Saturday · 3:00 PM – 5:30 PM · TROIS MONTS Restaurant, Chiang Rai"

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
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {SPOTLIGHT_TITLE}
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
                  <span className="text-base font-medium sm:text-lg">Saturday</span>
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

        <ImagePreviewDialog
          item={{
            src: SPOTLIGHT_IMAGE_SRC,
            alt: SPOTLIGHT_TITLE,
            title: SPOTLIGHT_TITLE,
            description: SPOTLIGHT_META,
          }}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      </div>
    </section>
  )
}
