import type { AnnouncementRecord } from "@/components/Announcements";
import type { EventCardRecord } from "@/components/sections/upcoming-events-grid";
import { createClient } from "@/lib/supabase/server";

export async function getWelcomeContent(): Promise<{
  announcement: AnnouncementRecord | null;
  event: EventCardRecord | null;
}> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [announcementResult, eventResult] = await Promise.all([
    supabase
      .from("announcements")
      .select("id,title,content,created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("events")
      .select("id,title,date,description,image_url,category")
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    announcement: (announcementResult.data as AnnouncementRecord | null) ?? null,
    event: (eventResult.data as EventCardRecord | null) ?? null,
  };
}
