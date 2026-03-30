import { Home, UtensilsCrossed, MapPin, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const scheduleItems: {
  days: string;
  title: string;
  description: string;
  icon: LucideIcon;
  location: string;
  mapLink: string;
}[] = [
  {
    days: "Tuesday – Thursday",
    title: "Open Student Center",
    description: "Come relax, cook, study, or hang out together",
    icon: Home,
    location: "The Harbor",
    mapLink: "https://www.google.com/maps/search/?api=1&query=The+Harbor+Student+Center",
  },
  {
    days: "Saturday",
    title: "Saturday Lunch at TROIS MONTS Restaurant",
    description: "Enjoy a large free meal with everyone",
    icon: UtensilsCrossed,
    location: "TROIS MONTS Restaurant",
    mapLink: "https://www.google.com/maps/search/?api=1&query=TROIS+MONTS+pizza+cafe",
  },
];

export function ScheduleSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Weekly Schedule"
          subtitle="Our regular activities throughout the week"
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {scheduleItems.map((item) => (
            <a
              key={item.title}
              href={item.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-sm font-medium text-secondary mb-1">
                    {item.days}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                    <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
