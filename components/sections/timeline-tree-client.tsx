"use client";

import { Images, Leaf, TreeDeciduous } from "lucide-react";
import { useState } from "react";
import { MultiImagePreviewDialog } from "@/components/multi-image-preview-dialog";
import { getMemoryCoverImage, getMemoryImages } from "@/lib/memory-images";

export type TimelineMemoryRecord = {
  id: string;
  title: string;
  date: string;
  caption: string;
  image_url: string;
  image_urls?: string[] | string | null;
  year: string;
};

const timelineColumnClass =
  "h-[min(320px,calc(48svh-1.5rem))] min-h-0 max-h-[min(320px,calc(48svh-1.5rem))] sm:h-[min(400px,calc(52svh-1.5rem))] sm:max-h-[min(400px,calc(52svh-1.5rem))]";

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
  const images = getMemoryImages(memory);
  const coverImage = getMemoryCoverImage(memory);

  const card = (
    <button
      type="button"
      onClick={() => onPhotoClick(memory)}
      className="relative w-[min(100%,220px)] cursor-pointer rounded-xl text-left outline-offset-4 transition-[box-shadow] hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring sm:w-[250px]"
      aria-haspopup="dialog"
      aria-label={`Open larger view: ${memory.title}${images.length > 1 ? ` (${images.length} photos)` : ""}`}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300">
        <div className="relative block aspect-16/10 w-full overflow-hidden">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs
            <img
              src={coverImage}
              alt=""
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <Images className="h-8 w-8 opacity-40" />
            </div>
          )}
          <span className="pointer-events-none absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            {memory.year}
          </span>
          {images.length > 1 ? (
            <span className="pointer-events-none absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              <Images className="h-3 w-3" />
              {images.length}
            </span>
          ) : null}
        </div>
        <div className="px-3 py-2.5">
          <p className="pointer-events-none text-[11px] font-medium leading-tight text-primary">
            {new Date(memory.date).toLocaleDateString()}
          </p>
          <h3
            className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {memory.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {memory.caption}
          </p>
        </div>
      </div>
    </button>
  );

  const node = (
    <div
      className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-primary shadow-md ring-2 ring-primary/20"
      aria-hidden
    >
      <Leaf className="h-4 w-4 text-white" />
    </div>
  );

  return (
    <div
      className={`grid w-[min(100%,252px)] shrink-0 snap-center px-1.5 sm:px-2 md:px-2.5 ${timelineColumnClass} ${
        side === "below" ? "grid-rows-[1fr_auto_auto]" : "grid-rows-[auto_auto_1fr]"
      }`}
    >
      {side === "below" ? (
        <>
          <div className="min-h-0" />
          <div className="flex justify-center">{node}</div>
          <div className="flex min-w-0 flex-col items-center justify-end gap-0 pb-1">
            <div className="h-10 w-0.5 shrink-0 rounded-full bg-linear-to-b from-primary/60 to-primary" />
            {card}
          </div>
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-col items-center justify-start gap-0 pt-1">
            {card}
            <div className="h-10 w-0.5 shrink-0 rounded-full bg-linear-to-t from-primary/60 to-primary" />
          </div>
          <div className="flex justify-center">{node}</div>
          <div className="min-h-0" />
        </>
      )}
    </div>
  );
}

type TimelineTreeScrollProps = {
  timelineItems: TimelineMemoryRecord[];
};

export function TimelineTreeScroll({ timelineItems }: TimelineTreeScrollProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [focusedMemory, setFocusedMemory] = useState<TimelineMemoryRecord | null>(null);
  const focusedImages = focusedMemory ? getMemoryImages(focusedMemory) : [];

  return (
    <>
      <p className="relative z-10 mb-3 px-1 text-center text-xs text-muted-foreground sm:hidden">
        Tap a memory or swipe sideways to explore
      </p>
      <div
        className="timeline-tree-scroll relative z-10 -mx-4 w-[calc(100%+2rem)] overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 snap-x snap-proximity [-ms-overflow-style:auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mx-0 sm:w-full"
        tabIndex={0}
        role="region"
        aria-label="Memories timeline"
      >
        <div className="relative mx-auto min-w-max px-4 py-3 sm:px-8 md:px-12 md:py-4">
          <div
            className="pointer-events-none absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-linear-to-r from-amber-600 via-primary/70 to-primary shadow-sm sm:left-8 sm:right-8 md:left-12 md:right-12"
            aria-hidden
          />
          <div
            className={`relative flex flex-row items-stretch justify-start gap-0 md:gap-0.5 ${timelineColumnClass}`}
          >
            <div
              className={`flex shrink-0 flex-col items-center justify-center gap-1 pr-2 sm:pr-3 ${timelineColumnClass}`}
            >
              <div className="rounded-full bg-linear-to-br from-primary/80 to-primary p-2.5 shadow-md ring-2 ring-primary/20">
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
                side={index % 2 === 0 ? "below" : "above"}
                onPhotoClick={(selected) => {
                  setFocusedMemory(selected);
                  setViewerOpen(true);
                }}
              />
            ))}

            <div
              className={`flex shrink-0 flex-col items-center justify-center gap-1 pl-2 sm:pl-3 ${timelineColumnClass}`}
            >
              <div className="h-9 w-9 rounded-full border-2 border-dashed border-primary/60 bg-background/80" />
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

      <MultiImagePreviewDialog
        open={viewerOpen}
        onOpenChange={(open) => {
          setViewerOpen(open);
          if (!open) {
            setFocusedMemory(null);
          }
        }}
        title={focusedMemory?.title ?? ""}
        description={focusedMemory?.caption}
        images={focusedImages}
        meta={
          focusedMemory
            ? `${focusedMemory.year} · ${new Date(focusedMemory.date).toLocaleDateString()}`
            : undefined
        }
      />
    </>
  );
}
