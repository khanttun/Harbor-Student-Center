"use client";

import { useEffect, useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Announcements, type AnnouncementRecord } from "@/components/Announcements";
import { createClient } from "@/lib/supabase/client";

export function AnnouncementsSection() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      const { data } = await supabase
        .from("announcements")
        .select("id,title,content,created_at")
        .order("created_at", { ascending: false });

      setAnnouncements((data as AnnouncementRecord[]) ?? []);
      setLoading(false);
    }

    void loadAnnouncements();
  }, []);

  const latestAnnouncement = announcements[0] ?? null;
  const moreUpdates = announcements.slice(1);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Announcements"
          subtitle="Stay updated with the latest news"
        />

        <div className="max-w-3xl mx-auto space-y-8">
          <Announcements latestAnnouncement={latestAnnouncement} />

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">More Updates</h3>
            {loading ? (
              <div className="p-5 border shadow-sm rounded-xl bg-card border-border">
                <p className="text-muted-foreground">Loading announcements...</p>
              </div>
            ) : moreUpdates.length === 0 ? (
              <div className="p-5 border shadow-sm rounded-xl bg-card border-border">
                <p className="text-muted-foreground">No additional updates yet.</p>
              </div>
            ) : (
              moreUpdates.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className="relative p-5 transition-shadow border shadow-sm bg-card rounded-xl border-border hover:shadow-md"
                >
                  {index === 0 && (
                    <span className="absolute inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full -top-2 -right-2 bg-secondary text-secondary-foreground">
                      <Sparkles className="w-3 h-3" />
                      NEW
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary/10">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-primary">
                        Posted {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                      <h3 className="mb-1 text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        {announcement.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
