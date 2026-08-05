import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EventsHeroSection } from "@/components/sections/events-hero-section";
import { EventsCtaSection } from "@/components/sections/events-cta-section";
import { ScheduleSection } from "@/components/sections/schedule-section";
import { UpcomingEventsSection } from "@/components/sections/upcoming-events-section";
import { UpcomingEventsSkeleton } from "@/components/sections/upcoming-events-skeleton";
import { AnnouncementsSection } from "@/components/sections/announcements-section";

export const metadata = {
  title: "Events & Schedule | The Harbor Student Center",
  description: "View our weekly schedule, special events, and announcements. Join us for meals, gatherings, and community activities.",
};

export default async function EventsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <EventsHeroSection />
      <ScheduleSection />
      <Suspense fallback={<UpcomingEventsSkeleton />}>
        <UpcomingEventsSection />
      </Suspense>
      <AnnouncementsSection />
      <EventsCtaSection />
      <Footer />
    </main>
  );
}
