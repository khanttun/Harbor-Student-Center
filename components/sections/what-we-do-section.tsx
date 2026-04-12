"use client"

import { Calendar, UtensilsCrossed, PartyPopper, Gift } from "lucide-react"
import { FeatureCard } from "@/components/feature-card"
import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"

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
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What We Do"
          subtitle="We provide a warm, welcoming space where Myanmar students can find community, food, and friendship."
        />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
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
