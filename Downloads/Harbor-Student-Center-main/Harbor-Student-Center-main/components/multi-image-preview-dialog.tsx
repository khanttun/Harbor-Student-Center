"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

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
        className="max-h-[70dvh] w-full object-contain"
      />
    );
  }

  return (
    <div className="relative w-full aspect-video max-h-[70dvh]">
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [photoIndex, setPhotoIndex] = useState(initialIndex);
  const count = images.length;
  const hasMultiple = count > 1;
  const currentSrc = count > 0 ? images[photoIndex] ?? images[0] : null;

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoIndex(Math.min(initialIndex, Math.max(count - 1, 0)));
    }
  }, [open, initialIndex, count]);

  const goPrev = useCallback(() => {
    setPhotoIndex((i) => (count <= 1 ? i : (i - 1 + count) % count));
  }, [count]);

  const goNext = useCallback(() => {
    setPhotoIndex((i) => (count <= 1 ? i : (i + 1) % count));
  }, [count]);

  useEffect(() => {
    if (!open || count <= 1) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count, goPrev, goNext]);

  const hasInfo = !!(title || description);

  return (
    <Dialog open={open && !!currentSrc} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1.25rem)] max-w-5xl overflow-hidden rounded-2xl border-0 bg-black p-0 shadow-2xl gap-0 sm:p-0"
      >
        {currentSrc && (
          <>
            <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {description ?? "Use arrow keys or on-screen arrows to browse photos."}
            </DialogPrimitive.Description>

            <div ref={containerRef} className="relative flex flex-col">
              {/* Close */}
              <DialogPrimitive.Close
                className="absolute right-3 top-3 z-30 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden />
              </DialogPrimitive.Close>

              {/* Image area */}
              <div className="relative min-h-50 w-full bg-black">
                <PreviewImage src={currentSrc} alt={title} />

                {/* Nav arrows */}
                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 z-20 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4"
                    >
                      <ChevronLeft className="size-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 z-20 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4"
                    >
                      <ChevronRight className="size-5" aria-hidden />
                    </button>
                    <p className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {photoIndex + 1} / {count}
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
              {hasInfo && (
                <div className="border-t border-white/10 bg-zinc-900 px-5 py-4">
                  {meta && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {meta}
                    </p>
                  )}
                  <p
                    style={{ fontFamily: "var(--font-heading)" }}
                    className="text-base font-semibold text-white sm:text-lg"
                  >
                    {title}
                  </p>
                  {description && (
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{description}</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
