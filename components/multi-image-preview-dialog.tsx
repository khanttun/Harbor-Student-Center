"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MultiImagePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  images: string[];
  initialIndex?: number;
  meta?: string;
};

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="mx-auto max-h-[70dvh] w-auto max-w-full rounded-md object-contain"
      />
    );
  }

  return (
    <div className="relative mx-auto h-[70dvh] w-full max-w-full">
      <Image src={src} alt={alt} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 1024px" />
    </div>
  );
}

export function MultiImagePreviewDialog({
  open,
  onOpenChange,
  title,
  description,
  images,
  initialIndex = 0,
  meta,
}: MultiImagePreviewDialogProps) {
  const [photoIndex, setPhotoIndex] = useState(initialIndex);
  const count = images.length;
  const hasMultiple = count > 1;
  const currentSrc = count > 0 ? images[photoIndex] ?? images[0] : null;

  useEffect(() => {
    if (open) {
      setPhotoIndex(Math.min(initialIndex, Math.max(count - 1, 0)));
    }
  }, [open, initialIndex, count]);

  const goPrev = useCallback(() => {
    setPhotoIndex((index) => (count <= 1 ? index : (index - 1 + count) % count));
  }, [count]);

  const goNext = useCallback(() => {
    setPhotoIndex((index) => (count <= 1 ? index : (index + 1) % count));
  }, [count]);

  useEffect(() => {
    if (!open || count <= 1) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count, goPrev, goNext]);

  return (
    <Dialog open={open && !!currentSrc} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-3rem)] w-[calc(100%-1.25rem)] max-w-4xl gap-0 overflow-hidden p-0 sm:p-0">
        {currentSrc && (
          <>
            <DialogHeader className="gap-3 border-b border-border bg-muted/30 px-5 py-4 text-left">
              {meta ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{meta}</p>
              ) : null}
              <DialogTitle
                style={{ fontFamily: "var(--font-heading)" }}
                className="pr-8 text-xl sm:text-2xl"
              >
                {title}
              </DialogTitle>
              <DialogDescription className={description ? "text-base text-muted-foreground" : "sr-only"}>
                {description || "Use arrow keys or on-screen arrows to browse photos in this memory."}
              </DialogDescription>
            </DialogHeader>

            <div className="relative bg-black/90 p-2 pt-12 pb-14 sm:p-4 sm:pt-12 sm:pb-16">
              {hasMultiple ? (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      goPrev();
                    }}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4 sm:size-12"
                  >
                    <ChevronLeft className="size-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      goNext();
                    }}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4 sm:size-12"
                  >
                    <ChevronRight className="size-6" aria-hidden />
                  </button>
                  <p className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {photoIndex + 1} / {count}
                  </p>
                </>
              ) : null}
              <PreviewImage src={currentSrc} alt={title} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
