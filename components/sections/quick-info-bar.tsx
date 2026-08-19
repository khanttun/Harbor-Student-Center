import { Clock, UtensilsCrossed, MapPin } from "lucide-react"

const items = [
  { icon: Clock, label: "Open Tue–Thu · 3–7 PM" },
  { icon: UtensilsCrossed, label: "Free Saturday Meals" },
  { icon: MapPin, label: "Chiang Rai, Thailand" },
]

export function QuickInfoBar() {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex flex-wrap items-center justify-center px-4 py-4 mx-auto max-w-7xl gap-x-8 gap-y-3 sm:px-6 sm:py-5 lg:px-8">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-foreground sm:text-base">
            <Icon className="w-4 h-4 shrink-0 text-primary sm:h-5 sm:w-5" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
