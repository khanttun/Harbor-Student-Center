import { Calendar, UtensilsCrossed, PartyPopper, Gift } from "lucide-react"
import { FeatureCard } from "@/components/feature-card"
import { SectionHeading } from "@/components/section-heading"

const features = [
  {
    icon: Calendar,
    title: "Weekly Hangout",
    description: "Tuesday to Thursday, our space is open for you to relax, cook, study, and spend quality time together with fellow students.",
  },
  {
    icon: UtensilsCrossed,
    title: "Saturday Meals",
    description: "Every Saturday, we provide free large meals at a local restaurant. Come hungry, leave happy!",
  },
  {
    icon: PartyPopper,
    title: "Celebrations",
    description: "From birthday parties to holiday events and special gatherings, we celebrate together as a family.",
  },
  {
    icon: Gift,
    title: "Completely Free",
    description: "Everything we offer is provided at absolutely no cost to students. No strings attached.",
  },
]

export function WhatWeDoSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What We Do"
          subtitle="We provide a warm, welcoming space where Myanmar students can find community, food, and friendship."
        />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
