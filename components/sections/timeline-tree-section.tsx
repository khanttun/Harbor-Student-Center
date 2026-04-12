import Image from "next/image";
import { Leaf, TreeDeciduous } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  image_url: string;
}

interface MemoriesByYear {
  [year: string]: Memory[];
}

interface TimelineEntry extends Memory {
  year: string;
}

const timelineColumnClass =
  "h-[min(400px,calc(52svh-1.5rem))] min-h-0 max-h-[min(400px,calc(52svh-1.5rem))]";

async function getMemoriesFromSupabase(): Promise<MemoriesByYear> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Failed to fetch memories:", error);
      return {};
    }

    const memoriesByYear: MemoriesByYear = {};

    (data || []).forEach(memory => {
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
      });
    });

    return memoriesByYear;
  } catch (error) {
    console.error("Error fetching memories:", error);
    return {};
  }
}

function TimelineMemoryNode({
  memory,
  year,
  side,
}: {
  memory: Memory;
  year: string;
  side: "above" | "below";
}) {
  const card = (
    <div className="w-[min(100%,220px)] sm:w-[250px]">
      <div className="overflow-hidden transition-all duration-300 border shadow-md rounded-xl border-border bg-card hover:shadow-lg">
        <div
          className="relative block w-full overflow-hidden text-left aspect-16/10 group"
        >
          <img
            src={memory.image_url}
            alt={memory.title}
            className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            {year}
          </span>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[11px] font-medium text-primary leading-tight">
            {new Date(memory.date).toLocaleDateString()}
          </p>
          <h3
            className="text-sm font-bold text-foreground mt-0.5 line-clamp-2 leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {memory.title}
          </h3>
          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2 leading-snug">
            {memory.caption}
          </p>
        </div>
      </div>
    </div>
  );

  const node = (
    <div
      className="relative z-10 flex items-center justify-center rounded-full shadow-md h-9 w-9 shrink-0 bg-linear-to-br from-green-400 to-green-600 ring-2 ring-green-200/70"
      aria-hidden
    >
      <Leaf className="w-4 h-4 text-white" />
    </div>
  );

  return (
    <>
      <div
        className={`grid w-[min(100%,252px)] shrink-0 snap-center px-1.5 sm:px-2 md:px-2.5 ${timelineColumnClass} ${side === "below"
          ? "grid-rows-[1fr_auto_auto]"
          : "grid-rows-[auto_auto_1fr]"
          }`}
      >
        {side === "below" ? (
          <>
            <div className="min-h-0" />
            <div className="flex justify-center">{node}</div>
            <div className="flex flex-col items-center justify-end min-w-0 gap-0 pb-1">
              <div className="h-10 w-0.5 shrink-0 rounded-full bg-linear-to-b from-green-400 to-green-500" />
              {card}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-start min-w-0 gap-0 pt-1">
              {card}
              <div className="h-10 w-0.5 shrink-0 rounded-full bg-linear-to-t from-green-400 to-green-500" />
            </div>
            <div className="flex justify-center">{node}</div>
            <div className="min-h-0" />
          </>
        )}
      </div>
    </>
  );
}
export async function TimelineTreeSection() {
  const memoriesByYear = await getMemoriesFromSupabase();

  const timelineItems: TimelineEntry[] = Object.entries(memoriesByYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .flatMap(([year, memories]) =>
      memories.map((m) => ({ ...m, year })),
    );

  return (
    <section className="relative px-0 py-10 overflow-hidden md:py-12 sm:px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-green-50/50 via-background to-amber-50/30" />
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-linear-to-r from-amber-100/40 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-linear-to-l from-amber-100/40 to-transparent" />
        <div className="absolute top-24 left-[8%] text-green-300/35">
          <Leaf className="w-16 h-16 rotate-45" />
        </div>
        <div className="absolute bottom-32 right-[10%] text-green-200/25">
          <TreeDeciduous className="w-28 h-28" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-amber-100/40 to-transparent" />
      </div>

      {timelineItems.length > 0 ? (
        <div
          className="timeline-tree-scroll relative z-10 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-none scroll-smooth pb-2 snap-x snap-proximity [-ms-overflow-style:auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          tabIndex={0}
          role="region"
          aria-label="Memories timeline"
        >
          <div className="relative px-4 py-3 mx-auto min-w-max sm:px-8 md:px-12 md:py-4">
            <div
              className="absolute h-1 -translate-y-1/2 rounded-full shadow-sm pointer-events-none left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 top-1/2 bg-linear-to-r from-amber-600 via-green-500 to-green-400"
              aria-hidden
            />
            <div
              className={`relative flex flex-row items-stretch justify-start gap-0 md:gap-0.5 ${timelineColumnClass}`}
            >
              <div
                className={`flex shrink-0 flex-col items-center justify-center gap-1 pr-2 sm:pr-3 ${timelineColumnClass}`}
              >
                <div className="rounded-full bg-linear-to-br from-green-500 to-green-700 p-2.5 shadow-md ring-2 ring-green-200/50">
                  <TreeDeciduous className="w-6 h-6 text-white" />
                </div>
                <span
                  className="max-w-[4.5rem] text-center text-[10px] font-semibold text-muted-foreground sm:text-xs"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Start
                </span>
              </div>

              {timelineItems.map((memory, index) => (
                <TimelineMemoryNode
                  key={memory.id}
                  memory={memory}
                  year={memory.year}
                  side={index % 2 === 0 ? "below" : "above"}
                />
              ))}

              <div
                className={`flex shrink-0 flex-col items-center justify-center gap-1 pl-2 sm:pl-3 ${timelineColumnClass}`}
              >
                <div className="border-2 border-dashed rounded-full h-9 w-9 border-green-400/80 bg-background/80" />
                <span
                  className="max-w-[4.5rem] text-center text-[10px] font-semibold text-muted-foreground sm:text-xs"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">No memories yet.</p>
        </div>
      )}
    </section>
  );
}
