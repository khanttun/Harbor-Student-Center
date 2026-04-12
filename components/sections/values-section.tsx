"use client"

import { Heart, Users, Gift, Home } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { motion } from "framer-motion"

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

function ValueCard({ icon, title, description, index }: ValueCardProps) {
  return (
    <motion.div 
      custom={index}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export function ValuesSection() {
  const values = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "No one should feel alone while studying abroad"
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: "Generosity",
      description: "Everything is given freely, with no expectations"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Care",
      description: "A safe and welcoming space for everyone"
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: "Belonging",
      description: "A place where you can truly feel at home"
    }
  ]

  return (
    <section className="py-24 sm:py-32 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="What We Believe"
            subtitle="The values that guide everything we do"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {values.map((value, index) => (
            <ValueCard key={value.title} {...value} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
