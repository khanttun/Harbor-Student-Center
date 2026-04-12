import Image from "next/image";
import Link from "next/link";
import { Cake, Drumstick, Pizza, PartyPopper } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { createClient } from "@/lib/supabase/server";

type EventRecord = {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string | null;
  category?: string | null;
};

const CATEGORY_LABELS = {
  birthday: "Birthday Celebrations",
  postExam: "Post-Exam Feast",
  holiday: "Holiday Gatherings",
  welcome: "Welcome Parties",
} as const;

function getEventCategory(event: EventRecord) {
  const source = `${event.category ?? ""} ${event.title}`.toLowerCase();

  if (source.includes("birthday")) {
    return "birthday" as const;
  }

  if (source.includes("post-exam") || source.includes("post exam") || source.includes("exam") || source.includes("feast")) {
    return "postExam" as const;
  }

  if (source.includes("holiday")) {
    return "holiday" as const;
  }

  if (source.includes("welcome") || source.includes("party")) {
    return "welcome" as const;
  }

  return "welcome" as const;
}

function getCategoryIcon(category: ReturnType<typeof getEventCategory>) {
  if (category === "birthday") {
    return Cake;
  }

  if (category === "postExam") {
    return Drumstick;
  }

  if (category === "holiday") {
    return Pizza;
  }

  return PartyPopper;
}

export async function UpcomingEventsSection() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,title,date,description,image_url,category")
    .order("date", { ascending: true });

  const events = ((data as EventRecord[] | null) ?? []).filter(Boolean);

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container px-4 mx-auto">
        <SectionHeading
          title="Upcoming Events"
          subtitle="Beyond our regular schedule, we host memorable gatherings"
        />
        {error ? (
          <div className="p-4 text-red-600 border border-red-300 rounded-xl bg-red-50">
            Unable to load events right now.
          </div>
        ) : events.length === 0 ? (
          <div className="p-4 text-gray-600 border border-gray-300 rounded-xl bg-gray-50">
            No upcoming events at the moment. Check back later!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              (() => {
                const category = getEventCategory(event);
                const Icon = getCategoryIcon(category);

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="overflow-hidden transition-all duration-300 border shadow-sm group bg-card rounded-2xl border-border hover:shadow-lg"
                  >
                    {event.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                        <div className="absolute inline-flex items-center gap-2 p-3 text-xs font-semibold text-white rounded-full shadow-sm bottom-3 left-3 bg-primary">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col justify-between flex-1 p-4">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground font-heading">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                      </div>
                      <span className="inline-flex mt-4 text-sm font-semibold text-primary">
                        View details
                      </span>
                    </div>
                  </Link>
                );
              })()
            ))}
          </div>
        )}
      </div>
    </section>
  );
}