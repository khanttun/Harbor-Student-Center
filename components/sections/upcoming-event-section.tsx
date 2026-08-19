"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, MapPin, CalendarPlus, Navigation } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePreviewDialog } from "@/components/image-preview-dialog"
import { motion } from "framer-motion"

const SPOTLIGHT_IMAGE_SRC = "/images/event.jpg"
const SPOTLIGHT_TITLE = "Saturday Lunch at TROIS MONTS Restaurant"
const SPOTLIGHT_META = "Saturday · 3:00 PM – 5:30 PM · TROIS MONTS Restaurant, Chiang Rai"
const SPOTLIGHT_IMAGE_ALT = "Myanmar students sharing Saturday lunch together at TROIS MONTS Restaurant"
const DIRECTIONS_URL = "https://www.google.com/maps/search/?api=1&query=TROIS+MONTS+pizza+cafe"

function getNextSaturdayAt3pm(): Date {
  const now = new Date()
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSaturday, 15, 0, 0)
  return next
}

function formatIcsLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`
}

function downloadCalendarInvite() {
  const start = getNextSaturdayAt3pm()
  const end = new Date(start)
  end.setHours(17, 30, 0, 0)
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Harbor Student Center//EN",
    "BEGIN:VEVENT",
    "UID:harbor-saturday-lunch@harbor-student-center",
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${formatIcsLocal(start)}`,
    `DTEND:${formatIcsLocal(end)}`,
    "RRULE:FREQ=WEEKLY;BYDAY=SA",
    `SUMMARY:${SPOTLIGHT_TITLE}`,
    "LOCATION:TROIS MONTS Restaurant\\, Chiang Rai",
    "DESCRIPTION:Free Saturday lunch with The Harbor Student Center community. Everyone welcome\\, especially new students.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "harbor-saturday-lunch.ics"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function UpcomingEventSection() {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <section id="events" className="py-24 bg-muted sm:py-32">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
              alt={SPOTLIGHT_IMAGE_ALT}
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
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold rounded-full bg-primary/10 text-primary">
              Weekend Activity (Unless Otherwise Specified)
            </span>

            <h2
              className="mb-6 text-2xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {SPOTLIGHT_TITLE}
            </h2>

            <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-xl">
              Join us for a delicious meal with your fellow Myanmar students! Great food, great company,
              and everything is completely free. New students are especially welcome.
            </p>

            <Card className="mb-8 border-0 shadow-lg bg-card">
              <CardContent className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-8">
                <div className="flex items-start gap-3 text-foreground sm:items-center sm:gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">Saturday</span>
                </div>
                <div className="flex items-start gap-3 text-foreground sm:items-center sm:gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl shrink-0 bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">3:00 PM - 5:30 PM</span>
                </div>
                <div className="flex items-start gap-3 text-foreground sm:items-center sm:gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl shrink-0 bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-base font-medium sm:text-lg">TROIS MONTS Restaurant, Chiang Rai</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="w-full px-6 py-5 text-base font-semibold transition-all rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 sm:w-auto sm:px-10 sm:py-7 sm:text-lg"
              >
                <Link href="/events">View All Events</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full transition-all rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
              >
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full transition-all rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
                onClick={downloadCalendarInvite}
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Calendar
              </Button>
            </div>
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
