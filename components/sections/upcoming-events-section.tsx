import Image from "next/image";
import { Cake, Drumstick, Pizza, PartyPopper } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { UpcomingEventsGrid, type EventCardRecord } from "./upcoming-events-grid";
import { createClient } from "@/lib/supabase/server";
import { EventShareButton } from "../event-share-button";
import Link from "next/link";

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
          <UpcomingEventsGrid events={events} />
        )}
      </div>
    </section>
  );
}
