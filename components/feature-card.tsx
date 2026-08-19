import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 border shadow-sm group border-border bg-card hover:-translate-y-1 hover:shadow-md">
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-br from-primary/5 to-transparent group-hover:opacity-100" />
      <CardContent className="relative flex flex-col items-center gap-3 p-5 text-center sm:p-6">
        <div className="flex items-center justify-center w-12 h-12 transition-colors duration-300 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
