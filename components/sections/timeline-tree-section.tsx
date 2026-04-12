"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Leaf, TreeDeciduous } from "lucide-react";

interface Memory {
  id: number;
  title: string;
  date: string;
  caption: string;
  image: string;
}

interface MemoriesByYear {
  [year: string]: Memory[];
}

const memoriesByYear: MemoriesByYear = {
  "2026": [
    {
      id: 1,
      title: "Spring Welcome Party",
      date: "March 2026",
      caption: "Welcoming new students with open arms and warm hearts",
      image: "/images/welcome-event.jpg",
    },
  ],
  "2025": [
    {
      id: 2,
      title: "Birthday Celebrations",
      date: "January - March 2025",
      caption: "Every birthday is a reason to come together and celebrate life",
      image: "/images/birthday-1.jpg",
    },
    {
      id: 3,
      title: "Pizza Night",
      date: "February 2025",
      caption: "Simple joys - good pizza, great company, endless conversations",
      image: "/images/pizza-night-1.jpg",
    },
    {
      id: 4,
      title: "150 Fried Chicken Celebration",
      date: "March 2025",
      caption: "The legendary post-exam feast that brought everyone together",
      image: "/images/chicken-1.jpg",
    },
  ],
  "2024": [
    {
      id: 5,
      title: "Halloween Night",
      date: "October 2024",
      caption: "A spooky night full of costumes, laughter, and unforgettable fun",
      image: "/images/halloween-1.jpg",
    },
    {
      id: 6,
      title: "Thanksgiving Dinner",
      date: "November 2024",
      caption: "Grateful hearts gathered around a table full of love and turkey",
      image: "/images/thanksgiving-1.jpg",
    },
    {
      id: 7,
      title: "End of Semester Feast",
      date: "December 2024",
      caption: "Celebrating the end of exams with food, friends, and freedom",
      image: "/images/semester-feast-1.jpg",
    },
  ],
  "2023": [
    {
      id: 8,
      title: "First Gathering",
      date: "September 2023",
      caption: "Where it all began - our first community meal together",
      image: "/images/memory-1.jpg",
    },
    {
      id: 9,
      title: "Holiday Dinner",
      date: "December 2023",
      caption: "Ending the year with warmth, gratitude, and new friendships",
      image: "/images/holiday-event.jpg",
    },
  ],
};

type TimelineEntry = Memory & { year: string };

/** Shared column height: fits cards + trunk; horizontal scroll only on the strip. */
const timelineColumnClass =
  "h-[min(400px,calc(52svh-1.5rem))] min-h-0 max-h-[min(400px,calc(52svh-1.5rem))]";

function TimelineMemoryNode({
  memory,
  year,
  side,
}: {
  memory: Memory;
  year: string;
  side: "above" | "below";
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const card = (
    <div className="w-[min(100%,220px)] sm:w-[250px]">
      <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <button
          type="button"
          className="relative block aspect-16/10 w-full overflow-hidden text-left cursor-pointer group"
          onClick={() => setSelectedImage(memory.image)}
        >
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width:640px) 220px, 250px"
          />
          <span className="absolute top-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            {year}
          </span>
        </button>
        <div className="px-3 py-2.5">
          <p className="text-[11px] font-medium text-primary leading-tight">
            {memory.date}
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
      className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-green-600 shadow-md ring-2 ring-green-200/70"
      aria-hidden
    >
      <Leaf className="h-4 w-4 text-white" />
    </div>
  );

  return (
    <>
      <div
        className={`grid w-[min(100%,252px)] shrink-0 snap-center px-1.5 sm:px-2 md:px-2.5 ${timelineColumnClass} ${
          side === "below"
            ? "grid-rows-[1fr_auto_auto]"
            : "grid-rows-[auto_auto_1fr]"
        }`}
      >
        {side === "below" ? (
          <>
            <div className="min-h-0" />
            <div className="flex justify-center">{node}</div>
            <div className="flex min-w-0 flex-col items-center justify-end gap-0 pb-1">
              <div className="h-10 w-0.5 shrink-0 rounded-full bg-linear-to-b from-green-400 to-green-500" />
              {card}
            </div>
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-col items-center justify-start gap-0 pt-1">
              {card}
              <div className="h-10 w-0.5 shrink-0 rounded-full bg-linear-to-t from-green-400 to-green-500" />
            </div>
            <div className="flex justify-center">{node}</div>
            <div className="min-h-0" />
          </>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Enlarged photo"
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-lg"
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function TimelineTreeSection() {
  const timelineItems = useMemo(() => {
    const entries: TimelineEntry[] = Object.entries(memoriesByYear)
      .sort(([a], [b]) => Number(a) - Number(b))
      .flatMap(([year, memories]) =>
        memories.map((m) => ({ ...m, year })),
      );
    return entries;
  }, []);

  return (
    <section className="py-10 md:py-12 px-0 sm:px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-green-50/50 via-background to-amber-50/30" />
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-amber-100/40 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-amber-100/40 to-transparent" />
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
          <div className="relative mx-auto min-w-max px-4 sm:px-8 md:px-12 py-3 md:py-4">
            <div
              className="pointer-events-none absolute left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 top-1/2 h-1 -translate-y-1/2 rounded-full bg-linear-to-r from-amber-600 via-green-500 to-green-400 shadow-sm"
              aria-hidden
            />
            <div
              className={`relative flex flex-row items-stretch justify-start gap-0 md:gap-0.5 ${timelineColumnClass}`}
            >
              <div
                className={`flex shrink-0 flex-col items-center justify-center gap-1 pr-2 sm:pr-3 ${timelineColumnClass}`}
              >
                <div className="rounded-full bg-linear-to-br from-green-500 to-green-700 p-2.5 shadow-md ring-2 ring-green-200/50">
                  <TreeDeciduous className="h-6 w-6 text-white" />
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
                <div className="h-9 w-9 rounded-full border-2 border-dashed border-green-400/80 bg-background/80" />
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
        <div className="relative z-10 text-center py-16 px-4">
          <p className="text-muted-foreground text-lg">No memories yet.</p>
        </div>
      )}

      <style jsx global>{`
        .timeline-tree-scroll {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </section>
  );
}
