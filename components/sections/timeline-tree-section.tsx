import { Leaf, TreeDeciduous } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TimelineTreeScroll } from "@/components/sections/timeline-tree-client";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  image_url: string;
  image_urls?: string[] | string | null;
}

interface MemoriesByYear {
  [year: string]: Memory[];
}

interface TimelineEntry extends Memory {
  year: string;
}

function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (!url || !key || url.includes("your-project") || key === "your-anon-key-here") {
    return false;
  }

  return true;
}

async function getMemoriesFromSupabase(): Promise<MemoriesByYear> {
  if (!isSupabaseConfigured()) {
    return {};
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      const errorMsg = error.message || JSON.stringify(error);
      if (errorMsg.includes("fetch failed") || errorMsg.includes("Network")) {
        console.error("Failed to fetch memories: Network error. Check your Supabase URL in .env.local is valid and not using placeholder values.");
      } else if (errorMsg.includes("does not exist")) {
        console.error("Failed to fetch memories: Memories table does not exist. Create the 'memories' table in Supabase.");
      } else {
        console.error("Failed to fetch memories:", errorMsg);
      }
      return {};
    }

    const memoriesByYear: MemoriesByYear = {};

    (data || []).forEach((memory) => {
      const date = new Date(memory.date);
      const year = date.getFullYear().toString();

      if (!memoriesByYear[year]) {
        memoriesByYear[year] = [];
      }

      memoriesByYear[year].push({
        id: memory.id,
        title: memory.title,
        date: memory.date,
        caption: memory.caption,
        image_url: memory.image_url,
        image_urls: memory.image_urls,
      });
    });

    return memoriesByYear;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes("fetch failed") || errorMsg.includes("Network")) {
      console.error("Error fetching memories: Network error. Verify Supabase credentials in .env.local are not placeholder values.");
    } else {
      console.error("Error fetching memories:", errorMsg);
    }
    return {};
  }
}

export async function TimelineTreeSection() {
  const memoriesByYear = await getMemoriesFromSupabase();

  const timelineItems: TimelineEntry[] = Object.entries(memoriesByYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .flatMap(([year, memories]) =>
      memories.map((m) => ({ ...m, year })),
    );

  return (
    <section className="relative overflow-hidden px-4 py-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-b from-green-50/50 via-background to-amber-50/30" />
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-linear-to-r from-amber-100/40 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-linear-to-l from-amber-100/40 to-transparent" />
        <div className="absolute top-24 left-[8%] text-green-300/35">
          <Leaf className="h-16 w-16 rotate-45" />
        </div>
        <div className="absolute bottom-32 right-[10%] text-green-200/25">
          <TreeDeciduous className="h-28 w-28" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-amber-100/40 to-transparent" />
      </div>

      {timelineItems.length > 0 ? (
        <TimelineTreeScroll timelineItems={timelineItems} />
      ) : (
        <div className="relative z-10 px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">No memories yet.</p>
        </div>
      )}
    </section>
  );
}
