import { Heart, Users, Gift, Home } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export function ValuesSection() {
  const values = [
    {
      icon: <Users className="w-7 h-7 text-primary" />,
      title: "Community",
      description: "No one should feel alone while studying abroad"
    },
    {
      icon: <Gift className="w-7 h-7 text-primary" />,
      title: "Generosity",
      description: "Everything is given freely, with no expectations"
    },
    {
      icon: <Heart className="w-7 h-7 text-primary" />,
      title: "Care",
      description: "A safe and welcoming space for everyone"
    },
    {
      icon: <Home className="w-7 h-7 text-primary" />,
      title: "Belonging",
      description: "A place where you can truly feel at home"
    }
  ]

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="What We Believe"
          subtitle="The values that guide everything we do"
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {values.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  )
}
