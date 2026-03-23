import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MemoriesHeroSection } from "@/components/sections/memories-hero-section";
import { TimelineTreeSection } from "@/components/sections/timeline-tree-section";
import { MemoriesCtaSection } from "@/components/sections/memories-cta-section";

export const metadata = {
  title: "Memories | Myanmar Student Center",
  description: "Moments we've shared together - A collection of memories from our community gatherings and celebrations.",
};

export default function MemoriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <MemoriesHeroSection />
      <TimelineTreeSection />
      <MemoriesCtaSection />
      <Footer />
    </main>
  );
}
