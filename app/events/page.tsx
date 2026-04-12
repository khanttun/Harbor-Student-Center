import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EventsHeroSection } from "@/components/sections/events-hero-section";
import { EventsCtaSection } from "@/components/sections/events-cta-section";
import { ScheduleSection } from "@/components/sections/schedule-section";
import { UpcomingEventsSection } from "@/components/sections/upcoming-events-section";
import { AnnouncementsSection } from "@/components/sections/announcements-section";

export const metadata = {
  title: "Events & Schedule | The Harbor Student Center",
  description: "View our weekly schedule, special events, and announcements. Join us for meals, gatherings, and community activities.",
};


// function normalizeImageUrl(imageUrl: string | null) {
//   if (!imageUrl) {
//     return null;
//   }

//   try {
//     const parsedUrl = new URL(imageUrl);
//     parsedUrl.pathname = parsedUrl.pathname.replace(/\/+/g, "/");
//     return parsedUrl.toString();
//   } catch {
//     return imageUrl;
//   }
// }

export default async function EventsPage() {

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <EventsHeroSection />
      <ScheduleSection />
      <UpcomingEventsSection />
      <AnnouncementsSection />
      <EventsCtaSection />
      <Footer />
    </main>
  );
}
