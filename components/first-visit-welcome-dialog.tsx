"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Megaphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AnnouncementRecord } from "@/components/Announcements";
import type { EventCardRecord } from "@/components/sections/upcoming-events-grid";

type FirstVisitWelcomeDialogProps = {
  announcement: AnnouncementRecord | null;
  event: EventCardRecord | null;
};

function formatEventDate(dateStr: string) {
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

export function FirstVisitWelcomeDialog({
  announcement,
  event,
}: FirstVisitWelcomeDialogProps) {
  const hasContent = !!(announcement || event);
  const [open, setOpen] = useState(hasContent);

  if (!hasContent) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="border-b border-border bg-primary/5 px-6 py-5">
          <DialogHeader className="gap-1 pr-8">
            <DialogTitle
              className="text-xl sm:text-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome to Harbor
            </DialogTitle>
            <DialogDescription>
              Here&apos;s what&apos;s new and coming up next.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-5">
          {announcement && (
            <section className="rounded-2xl border border-border bg-muted/40 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Megaphone className="size-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Latest Announcement
                </h3>
              </div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Posted {new Date(announcement.created_at).toLocaleDateString()}
              </p>
              <p
                className="mb-2 text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {announcement.title}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {announcement.content}
              </p>
            </section>
          )}

          {event && (
            <section className="overflow-hidden rounded-2xl border border-border bg-muted/40">
              {event.image_url && (
                <div className="relative aspect-[16/9] w-full bg-muted">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 576px"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Calendar className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Upcoming Event
                  </h3>
                </div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {formatEventDate(event.date)}
                </p>
                <p
                  className="mb-2 text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {event.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {event.description}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  View event details
                </Link>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
