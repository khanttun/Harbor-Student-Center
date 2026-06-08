"use client";

import Image from "next/image";
import Link from "next/link";
import { Cake, ChevronLeft, ChevronRight, Drumstick, PartyPopper, Pizza } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
                <div className="relative h-48 overflow-hidden pointer-events-none">
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
        <DialogContent className="max-h-[calc(100dvh-3rem)] w-[calc(100%-1.25rem)] max-w-4xl overflow-y-auto p-0 gap-0 sm:p-0">
          {active && (
            <>
              <DialogHeader className="gap-3 border-b border-border bg-muted/30 px-5 py-4 text-left">
                <div className="flex flex-wrap items-start justify-between gap-2 gap-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {(() => {
                      const previewCategory = getEventCategory(active);
                      const PreviewIcon = getCategoryIcon(previewCategory);
                      return (
                        <>
                          <PreviewIcon className="h-4 w-4 shrink-0" aria-hidden />
                          {CATEGORY_LABELS[previewCategory]}
                        </>
                      );
                    })()}
                  </span>
                </div>
                <DialogTitle style={{ fontFamily: "var(--font-heading)" }} className="text-xl sm:text-2xl">
                  {active.title}
                </DialogTitle>
                <p className="text-sm font-medium text-foreground">{formatDialogDate(active.date)}</p>
                <DialogDescription className={(active.description ?? "").trim() ? "text-base whitespace-pre-line" : "sr-only"}>
                  {(active.description ?? "").trim()
                    ? active.description
                    : "Event details. Use arrow keys or buttons to browse events."}
                </DialogDescription>
              </DialogHeader>

              <div className="relative bg-black/90 px-2 pt-12 pb-14 sm:px-4 sm:pt-12 sm:pb-16">
                {count > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      aria-label="Previous event"
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
                      aria-label="Next event"
                      className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4 sm:size-12"
                    >
                      <ChevronRight className="size-6" aria-hidden />
                    </button>
                  </>
                ) : null}
                {active.image_url ? (
                  <div className="relative mx-auto aspect-video w-full max-h-[min(70dvh,480px)]">
                    <Image
                      src={active.image_url}
                      alt=""
                      fill
                      className="rounded-md object-contain"
                      sizes="(max-width: 896px) 100vw, 896px"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-white/20 bg-black/40 px-4 text-center text-sm text-white/70">
                    No image for this event
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-4">
                <Link
                  href={`/events/${active.id}`}
                  className="inline-flex text-sm font-semibold text-primary hover:underline"
                >
                  Open full details
                </Link>
                <EventShareButton title={active.title} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
