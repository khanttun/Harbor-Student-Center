"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  className?: string;
  imageClassName?: string;
  showHoverOverlay?: boolean;
  caption?: ReactNode;
}

export function ImageCard({
  src,
  alt,
  title,
  description,
  className = "",
  imageClassName,
  showHoverOverlay = true,
  caption,
}: ImageCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Open larger view: ${title ?? alt}`}
        className={cn(
          "group relative block w-full cursor-pointer overflow-hidden rounded-2xl text-left outline-offset-4 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-110",
            imageClassName,
          )}
        />
        {showHoverOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
        {caption}
      </button>
      <ImagePreviewDialog
        item={{ src, alt, title, description }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
