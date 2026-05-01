import { SectionHeading } from "@/components/section-heading";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { UpcomingEventsGrid, type EventCardRecord } from "./upcoming-events-grid";

export async function UpcomingEventsSection() {
  let data: unknown = null;
  let error: { message?: string } | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase
      .from("events")
      .select("id,title,date,description,image_url,category")
      .order("date", { ascending: true });
    data = result.data;
    error = result.error;
  }

  const events = ((data as EventCardRecord[] | null) ?? []).filter(Boolean);

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container px-4 mx-auto">
        <SectionHeading
          title="Upcoming Events"
          subtitle="Beyond our regular schedule, we host memorable gatherings"
        />
        {!isSupabaseConfigured() ? (
          <div className="p-4 text-gray-600 border border-gray-300 rounded-xl bg-gray-50">
            Events are unavailable until Supabase credentials are configured.
          </div>
        ) : error ? (
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
