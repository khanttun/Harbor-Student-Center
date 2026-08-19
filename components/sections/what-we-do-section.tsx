"use client"

import { Calendar, UtensilsCrossed, PartyPopper, Gift } from "lucide-react"
import { FeatureCard } from "@/components/feature-card"
import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"

const features = [
  {
    icon: Calendar,
    title: "Weekly Hangout",
    description: "Tue–Thu, 3–7 PM — relax, cook, and study together.",
  },
  {
    icon: UtensilsCrossed,
    title: "Saturday Meals",
    description: "Free lunch every Saturday, 3–5:30 PM.",
  },
  {
    icon: PartyPopper,
    title: "Celebrations",
    description: "Birthdays, holidays, and gatherings as a family.",
  },
  {
    icon: Gift,
    title: "Completely Free",
    description: "No cost, ever — no strings attached.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function WhatWeDoSection() {
  return (
    <section className="py-24 bg-background sm:py-32">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <SectionHeading
          title="What We Do"
          subtitle="We provide a warm, welcoming space where Myanmar students can find community, food, and friendship."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
