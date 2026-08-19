"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Megaphone, Sparkles, XIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

function WelcomeHeader({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="relative px-6 pt-8 pb-6 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary to-primary/85 sm:px-8">
      <div
        aria-hidden
        className="absolute w-32 h-32 rounded-full pointer-events-none -right-8 -top-10 bg-primary-foreground/10 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none -bottom-14 left-10 h-28 w-28 bg-primary-foreground/10 blur-2xl"
      />
      <DialogClose className="absolute right-3 top-3 z-[60] inline-flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/80 outline-none transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
        <XIcon className="size-4" aria-hidden />
        <span className="sr-only">Close</span>
      </DialogClose>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center mb-4 h-11 w-11 rounded-2xl bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20"
      >
        <Sparkles className="size-5" aria-hidden />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <DialogHeader className="gap-1.5 pr-8 text-left">
          <DialogTitle
            className="text-2xl text-primary-foreground sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome to Harbor
          </DialogTitle>
          <DialogDescription className="max-w-[60ch] text-primary-foreground/85">
            Here&apos;s what&apos;s new and coming up next.
          </DialogDescription>
        </DialogHeader>
      </motion.div>
    </div>
  );
}

function ContentCard({
  icon: Icon,
  badgeLabel,
  meta,
  title,
  description,
  delay,
  reduceMotion,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  badgeLabel: string;
  meta: string;
  title: string;
  description: string;
  delay: number;
  reduceMotion: boolean | null;
  children?: ReactNode;
}) {
  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden transition-colors border shadow-sm rounded-xl border-border bg-card hover:border-primary/25 hover:shadow-md"
    >
      {children}
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex items-center justify-center h-9 w-9 shrink-0 rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4.5" aria-hidden />
          </div>
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
            {badgeLabel}
          </span>
        </div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">{meta}</p>
        <p
          className="mb-2 text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </p>
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </motion.section>
  );
}

export function FirstVisitWelcomeDialog({
  announcement,
  event,
}: FirstVisitWelcomeDialogProps) {
  const hasContent = !!(announcement || event);
  const [open, setOpen] = useState(hasContent);
  const reduceMotion = useReducedMotion();

  if (!hasContent) {
    return null;
  }

  const announcementDelay = 0.12;
  const eventDelay = announcement ? 0.2 : 0.12;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <WelcomeHeader reduceMotion={reduceMotion} />

        <div className="px-6 py-6 space-y-4 sm:px-8">
          {announcement && (
            <ContentCard
              icon={Megaphone}
              badgeLabel="Latest Announcement"
              meta={`Posted ${new Date(announcement.created_at).toLocaleDateString()}`}
              title={announcement.title}
              description={announcement.content}
              delay={announcementDelay}
              reduceMotion={reduceMotion}
            />
          )}

          {event && (
            <ContentCard
              icon={Calendar}
              badgeLabel="Upcoming Event"
              meta={formatEventDate(event.date)}
              title={event.title}
              description={event.description}
              delay={eventDelay}
              reduceMotion={reduceMotion}
            >
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
            </ContentCard>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 px-6 py-4 border-t rounded-b-2xl border-border bg-muted/30 sm:flex-row sm:justify-end sm:px-8">
          {event && (
            <Button
              variant="ghost"
              className="transition-transform active:scale-[0.98]"
              onClick={() => setOpen(false)}
            >
              Maybe later
            </Button>
          )}
          {event ? (
            <Button
              asChild
              className="rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href={`/events/${event.id}`}>View event details</Link>
            </Button>
          ) : (
            <Button
              className="rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setOpen(false)}
            >
              Got it, thanks
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
