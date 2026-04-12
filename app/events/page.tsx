import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EventsHeroSection } from "@/components/sections/events-hero-section";
import { EventsCtaSection } from "@/components/sections/events-cta-section";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Events & Schedule | The Harbor Student Center",
  description: "View our weekly schedule, special events, and announcements. Join us for meals, gatherings, and community activities.",
};

type EventRecord = {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string | null;
};

function normalizeImageUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+/g, "/");
    return parsedUrl.toString();
  } catch {
    return imageUrl;
  }
}

export default async function EventsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,title,date,description,image_url")
    .order("date", { ascending: true });

  const events = ((data as EventRecord[] | null) ?? []).filter(Boolean);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <EventsHeroSection />

      <section className="py-20 bg-background">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold md:text-4xl">Upcoming Events</h2>
            <p className="mt-2 text-muted-foreground">Live from Supabase. Any admin changes appear here automatically.</p>
          </div>

          {error ? (
            <div className="p-4 text-red-600 border border-red-300 rounded-xl bg-red-50">
              Unable to load events right now.
            </div>
          ) : events.length === 0 ? (
            <div className="p-6 border rounded-2xl bg-card border-border">
              <p className="text-muted-foreground">No events posted yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <article key={event.id} className="overflow-hidden border shadow-sm bg-card rounded-2xl border-border">
                  <div className="relative w-full h-52 bg-muted">
                    {normalizeImageUrl(event.image_url) ? (
                      <img
                        src={normalizeImageUrl(event.image_url)!}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">
                        No image uploaded
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <p className="text-sm font-medium text-primary">{new Date(event.date).toLocaleDateString()}</p>
                    <h3 className="text-xl font-semibold leading-tight">{event.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <EventsCtaSection />
      <Footer />
    </main>
  );
}
