"use client"

import { Clock, UtensilsCrossed, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  { icon: Clock, label: "Open Tue–Thu · 3–7 PM" },
  { icon: UtensilsCrossed, label: "Free Saturday Meals" },
  { icon: MapPin, label: "Chiang Rai, Thailand" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function QuickInfoBar() {
  return (
    <div className="border-b border-border bg-card">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-wrap items-center justify-center gap-2 px-4 py-4 mx-auto max-w-7xl sm:gap-3 sm:px-6 sm:py-5 lg:px-8"
      >
        {items.map(({ icon: Icon, label }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 sm:px-4 sm:py-2 sm:text-base"
          >
            <Icon className="w-4 h-4 shrink-0 text-primary sm:h-5 sm:w-5" />
            <span>{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
