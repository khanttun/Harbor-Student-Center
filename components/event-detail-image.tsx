"use client";

import { useState, type ReactNode } from "react";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";

type EventDetailImageProps = {
  src: string;
  alt: string;
  title: string;
  description?: string;
  badge?: ReactNode;
};

export function EventDetailImage({
  src,
  alt,
  title,
  description,
  badge,
}: EventDetailImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Open larger view: ${title}`}
        className="relative h-70 w-full cursor-pointer overflow-hidden bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring md:h-105"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        {badge}
      </button>
      <ImagePreviewDialog
        item={{ src, alt, title, description }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
