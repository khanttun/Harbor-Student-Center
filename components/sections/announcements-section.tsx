import { Bell, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const announcements = [
  {
    title: "The Harbor Opens This Tuesday",
    description: "Come by anytime between 2pm and 8pm. Everyone is welcome!",
    isNew: true,
  },
  {
    title: "Special Dinner This Saturday",
    description: "Join us for a special meal at Trios Mouth Restaurant at 12pm.",
    isNew: true,
  },
  {
    title: "New Students Welcome",
    description: "If you're new to MFU, come meet us! We'd love to have you.",
    isNew: false,
  },
];

export function AnnouncementsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Announcements"
          subtitle="Stay updated with the latest news"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className="relative bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              {announcement.isNew && (
                <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                  <Sparkles className="w-3 h-3" />
                  NEW
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 font-[family-name:var(--font-heading)]">
                    {announcement.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {announcement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
