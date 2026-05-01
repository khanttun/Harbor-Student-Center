"use client";

import { ChevronLeft, ChevronRight, Leaf, TreeDeciduous } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type TimelineMemoryRecord = {
  id: string;
  title: string;
  date: string;
  caption: string;
  image_url: string;
  year: string;
};

const timelineColumnClass =
  "h-[min(400px,calc(52svh-1.5rem))] min-h-0 max-h-[min(400px,calc(52svh-1.5rem))]";

type TimelineMemoryNodeProps = {
  memory: TimelineMemoryRecord;
  side: "above" | "below";
  onPhotoClick: (memory: TimelineMemoryRecord) => void;
};

function TimelineMemoryNode({
  memory,
  side,
  onPhotoClick,
}: TimelineMemoryNodeProps) {
  const card = (
    <button
      type="button"
      onClick={() => onPhotoClick(memory)}
      className="relative w-[min(100%,220px)] cursor-pointer rounded-xl text-left outline-offset-4 transition-[box-shadow] hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring sm:w-[250px]"
      aria-haspopup="dialog"
      aria-label={`Open larger view: ${memory.title}`}
    >
      <div className="overflow-hidden transition-all duration-300 border shadow-md rounded-xl border-border bg-card">
        <div className="relative block w-full overflow-hidden aspect-16/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs */}
          <img
            src={memory.image_url}
            alt=""
            className="object-cover object-top w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm pointer-events-none">
            {memory.year}
          </span>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[11px] font-medium text-primary leading-tight pointer-events-none">
            {new Date(memory.date).toLocaleDateString()}
          </p>
          <h3
            className="text-sm font-bold text-foreground mt-0.5 line-clamp-2 leading-snug pointer-events-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {memory.title}
          </h3>
          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2 leading-snug pointer-events-none">
            {memory.caption}
          </p>
        </div>
      </div>
    </button>
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

type TimelineTreeScrollProps = {
  timelineItems: TimelineMemoryRecord[];
};

export function TimelineTreeScroll({ timelineItems }: TimelineTreeScrollProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = timelineItems.length;
  const focused = count > 0 ? timelineItems[activeIndex] ?? timelineItems[0] : null;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (count <= 1 ? i : (i - 1 + count) % count));
  }, [count]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (count <= 1 ? i : (i + 1) % count));
  }, [count]);

  useEffect(() => {
    if (!viewerOpen || count === 0) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((i) => (count <= 1 ? i : (i - 1 + count) % count));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((i) => (count <= 1 ? i : (i + 1) % count));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerOpen, count]);

  return (
    <>
      <div
        className="timeline-tree-scroll relative z-10 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 snap-x snap-proximity [-ms-overflow-style:auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                side={index % 2 === 0 ? "below" : "above"}
                onPhotoClick={(m) => {
                  const i = timelineItems.findIndex((x) => x.id === m.id);
                  setActiveIndex(i >= 0 ? i : 0);
                  setViewerOpen(true);
                }}
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

      <Dialog
        open={viewerOpen && !!focused}
        onOpenChange={setViewerOpen}
      >
        <DialogContent className="max-h-[calc(100dvh-3rem)] w-[calc(100%-1.25rem)] max-w-4xl overflow-y-auto p-0 gap-0 sm:p-0">
          {focused && (
            <>
              <DialogHeader className="gap-3 border-b border-border bg-muted/30 px-5 py-4 text-left">
                <div className="flex flex-wrap items-start justify-between gap-2 gap-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {focused.year} · {new Date(focused.date).toLocaleDateString()}
                  </p>
                </div>
                <DialogTitle
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-xl sm:text-2xl"
                >
                  {focused.title}
                </DialogTitle>
                <DialogDescription className={focused.caption ? "text-base text-muted-foreground" : "sr-only"}>
                  {focused.caption || "Enlarged memory photo. Use arrow keys or on-screen arrows to browse."}
                </DialogDescription>
              </DialogHeader>

              <div className="relative bg-black/90 p-2 pt-12 pb-14 sm:p-4 sm:pt-12 sm:pb-16">
                {count > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      aria-label="Previous memory"
                      className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4 sm:size-12"
                    >
                      <ChevronLeft className="size-6" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      aria-label="Next memory"
                      className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4 sm:size-12"
                    >
                      <ChevronRight className="size-6" aria-hidden />
                    </button>
                  </>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={focused.image_url}
                  alt={focused.title}
                  className="mx-auto max-h-[70dvh] w-auto max-w-full rounded-md object-contain"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
