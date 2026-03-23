import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EventsHeroSection } from "@/components/sections/events-hero-section";
import { ScheduleSection } from "@/components/sections/schedule-section";
import { SpecialEventsSection } from "@/components/sections/special-events-section";
import { AnnouncementsSection } from "@/components/sections/announcements-section";
import { EventsCtaSection } from "@/components/sections/events-cta-section";

export const metadata = {
  title: "Events & Schedule | The Harbor Student Center",
  description: "View our weekly schedule, special events, and announcements. Join us for meals, gatherings, and community activities.",
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <EventsHeroSection />
      <ScheduleSection />
      <SpecialEventsSection />
      <AnnouncementsSection />
      <EventsCtaSection />
      <Footer />
    </main>
  );
}
