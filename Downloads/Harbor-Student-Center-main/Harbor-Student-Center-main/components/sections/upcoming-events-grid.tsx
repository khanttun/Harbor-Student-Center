"use client";

import Image from "next/image";
import Link from "next/link";
import { Cake, ChevronLeft, ChevronRight, Drumstick, Maximize2, PartyPopper, Pizza, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { EventShareButton } from "@/components/event-share-button";

export type EventCardRecord = {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string | null;
  category?: string | null;
};

const CATEGORY_LABELS = {
  birthday: "Birthday Celebrations",
  postExam: "Post-Exam Feast",
  holiday: "Holiday Gatherings",
  welcome: "Welcome Parties",
} as const;

function getEventCategory(event: EventCardRecord) {
  const source = `${event.category ?? ""} ${event.title}`.toLowerCase();

  if (source.includes("birthday")) {
    return "birthday" as const;
  }

  if (
    source.includes("post-exam") ||
    source.includes("post exam") ||
    source.includes("exam") ||
    source.includes("feast")
  ) {
    return "postExam" as const;
  }

  if (source.includes("holiday")) {
    return "holiday" as const;
  }

  if (source.includes("welcome") || source.includes("party")) {
    return "welcome" as const;
  }

  return "welcome" as const;
}

function getCategoryIcon(category: ReturnType<typeof getEventCategory>) {
  if (category === "birthday") {
    return Cake;
  }

  if (category === "postExam") {
    return Drumstick;
  }

  if (category === "holiday") {
    return Pizza;
  }

  return PartyPopper;
}

function formatDialogDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return dateStr;
  }
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type UpcomingEventsGridProps = {
  events: EventCardRecord[];
};

export function UpcomingEventsGrid({ events }: UpcomingEventsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = events.length;
  const active = count > 0 ? events[activeIndex] ?? events[0] : null;

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

  function openViewer(index: number) {
    setActiveIndex(index);
    setViewerOpen(true);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {events.map((event, index) => {
          const category = getEventCategory(event);
          const Icon = getCategoryIcon(category);

          return (
            <article
              key={event.id}
              role="button"
              tabIndex={0}
              aria-label={`Open preview: ${event.title}`}
              className="overflow-hidden cursor-pointer transition-all duration-300 border shadow-sm group bg-card rounded-2xl border-border hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => openViewer(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openViewer(index);
                }
              }}
            >
              {event.image_url && (
                <div className="relative aspect-210/297 overflow-hidden pointer-events-none">
                  <Image
                    src={event.image_url}
                    alt=""
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                  <div className="absolute inline-flex items-center gap-2 p-2 text-xs font-semibold text-white rounded-full shadow-sm bottom-3 left-3 bg-primary">
                    <Icon className="w-4 h-4" aria-hidden />
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                  {!event.image_url ? (
                    <div className="inline-flex items-center gap-2 p-2 mb-3 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                      <Icon className="w-4 h-4" aria-hidden />
                      <span>{CATEGORY_LABELS[category]}</span>
                    </div>
                  ) : null}
                  <h3 className="mb-2 text-lg font-semibold text-foreground font-heading">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                </div>

                <div
                  className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex text-sm font-semibold cursor-pointer text-primary hover:underline"
                  >
                    View details
                  </Link>

                  <EventShareButton title={event.title} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={viewerOpen && !!active} onOpenChange={setViewerOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1.25rem)] max-w-4xl overflow-hidden rounded-2xl border-0 bg-black p-0 shadow-2xl gap-0 sm:p-0"
        >
          {active && (
            <div ref={containerRef} className="flex flex-col">
              <DialogPrimitive.Title className="sr-only">{active.title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                {active.description || "Event details."}
              </DialogPrimitive.Description>

              {/* Close */}
              <DialogPrimitive.Close
                className="absolute right-3 top-3 z-30 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden />
              </DialogPrimitive.Close>

              {/* Image area */}
              <div className="relative min-h-50 w-full bg-black">
                {active.image_url ? (
                  <div className="relative aspect-video w-full max-h-[55dvh]">
                    <Image
                      src={active.image_url}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(max-width: 896px) 100vw, 896px"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-50 items-center justify-center border border-dashed border-white/20 px-4 text-center text-sm text-white/50">
                    No image for this event
                  </div>
                )}

                {/* Nav arrows */}
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      aria-label="Previous event"
                      className="absolute left-3 top-1/2 z-20 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4"
                    >
                      <ChevronLeft className="size-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      aria-label="Next event"
                      className="absolute right-3 top-1/2 z-20 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4"
                    >
                      <ChevronRight className="size-5" aria-hidden />
                    </button>
                    <p className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {activeIndex + 1} / {count}
                    </p>
                  </>
                )}

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={() => containerRef.current?.requestFullscreen?.()}
                  aria-label="View fullscreen"
                  className="absolute bottom-3 right-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Maximize2 className="size-4" aria-hidden />
                </button>
              </div>

              {/* Info panel */}
              <div className="border-t border-white/10 bg-zinc-900 px-5 py-4">
                {(() => {
                  const previewCategory = getEventCategory(active);
                  const PreviewIcon = getCategoryIcon(previewCategory);
                  return (
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      <PreviewIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {CATEGORY_LABELS[previewCategory]}
                    </span>
                  );
                })()}
                <p
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-base font-semibold text-white sm:text-lg"
                >
                  {active.title}
                </p>
                <p className="mt-1 text-xs font-medium text-white/50">{formatDialogDate(active.date)}</p>
                {(active.description ?? "").trim() && (
                  <p className="mt-2 text-sm leading-relaxed text-white/60 whitespace-pre-line line-clamp-3">
                    {active.description}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-zinc-900/80 px-5 py-3">
                <Link
                  href={`/events/${active.id}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Open full details
                </Link>
                <EventShareButton title={active.title} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
