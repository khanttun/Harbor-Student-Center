"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePreviewDialog, type ImagePreviewItem } from "@/components/image-preview-dialog";

const spaces = [
  {
    src: "/Design/front-room.png",
    title: "Main Lounge",
    blurb: "Comfy seating, soft lighting, and room for everyone to gather.",
    className: "col-span-2 row-span-2",
  },
  {
    src: "/Design/main-lounge.png",
    title: "Front Room",
    blurb: "A bright welcome area that feels like home right away.",
  },
  {
    src: "/Design/study-room.png",
    title: "Study Room",
    blurb: "A quiet corner for assignments, projects, and focused study time.",
  },
  {
    src: "/Design/kitchen.png",
    title: "Kitchen",
    blurb: "Where shared meals and new friendships begin.",
  },
  {
    src: "/Design/myanmar-map-dining.png",
    title: "Dining Space",
    blurb: "A warm dining spot that celebrates culture and connection.",
  },
  {
    src: "/Design/pool-table.png",
    title: "Game Corner",
    blurb: "Fun breaks and relaxed moments with friends.",
  },
  {
    src: "/Design/bbq-prep.png",
    title: "Event Setup",
    blurb: "Ready for BBQs, celebrations, and community nights.",
  },
  {
    src: "/Design/snack-shelf.png",
    title: "Snack Shelf",
    blurb: "Grab a quick bite and keep your energy up.",
  },
  {
    src: "/Design/Mulitmedia%20room.png",
    title: "Multimedia Room",
    blurb: "A flexible room for movies, presentations, and hangouts.",
  },
];

const previewItems: ImagePreviewItem[] = spaces.map((s) => ({
  src: s.src,
  alt: s.title,
  title: s.title,
  description: s.blurb,
}));

export function HarborDesignShowcase() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Welcome Home
          </p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
            Explore The Harbor Spaces We Built For You
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Inspired by modern realtor-style layouts, this is a quick tour of what we have: cozy lounges, study zones, shared dining, and activity spaces designed to help students feel at home.
          </p>
        </div>

        <div className="grid grid-cols-2 auto-rows-[120px] gap-2 sm:grid-cols-2 sm:auto-rows-[150px] sm:gap-3 md:grid-cols-4 md:auto-rows-[180px] lg:auto-rows-[200px] lg:gap-4">
          {spaces.map((space, index) => (
            <button
              key={space.src}
              type="button"
              onClick={() => setPreviewIndex(index)}
              aria-haspopup="dialog"
              aria-label={`Open space preview: ${space.title}`}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-sm outline-offset-4 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring ${space.className ?? ""}`}
            >
              <Image
                src={space.src}
                alt={space.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-sm font-semibold text-white sm:text-base">{space.title}</h3>
                <p className="mt-1 text-[11px] text-white/85 sm:text-xs">{space.blurb}</p>
              </div>
            </button>
          ))}
        </div>

        <ImagePreviewDialog
          item={previewIndex !== null ? previewItems[previewIndex] ?? null : null}
          open={previewIndex !== null}
          onOpenChange={(open) => { if (!open) setPreviewIndex(null); }}
          items={previewItems}
          currentIndex={previewIndex ?? 0}
          onNavigate={setPreviewIndex}
        />
      </div>
    </section>
  );
}
