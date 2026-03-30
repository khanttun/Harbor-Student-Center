import Image from "next/image";
import { Cake, Drumstick, Pizza, PartyPopper } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const specialEvents = [
  {
    title: "Birthday Celebrations",
    description: "We celebrate everyone's birthday together each month with cake and good company",
    icon: Cake,
    image: "/images/birthday-event.jpg",
  },
  {
    title: "Post-Exam Feast",
    description: "After finals, we celebrate with massive meals — like 150 fried chickens!",
    icon: Drumstick,
    image: "/images/feast-event.jpg",
  },
  {
    title: "Holiday Gatherings",
    description: "Thanksgiving dinners, pizza nights, and seasonal celebrations throughout the year",
    icon: Pizza,
    image: "/images/holiday-event.jpg",
  },
  {
    title: "Welcome Parties",
    description: "Special events to welcome new students and help them feel at home",
    icon: PartyPopper,
    image: "/images/welcome-event.jpg",
  },
];

export function SpecialEventsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Special Events"
          subtitle="Beyond our regular schedule, we host memorable gatherings"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialEvents.map((event) => (
            <div
              key={event.title}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className={`object-cover ${event.image === "/images/feast-event.jpg" ? "object-top" : "object-center"} group-hover:scale-105 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <event.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2 font-[family-name:var(--font-heading)]">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
