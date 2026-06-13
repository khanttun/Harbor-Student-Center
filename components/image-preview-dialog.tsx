"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export type ImagePreviewItem = {
  src: string;
  alt: string;
  title?: string;
  description?: string;
};

type ImagePreviewDialogProps = {
  item: ImagePreviewItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: ImagePreviewItem[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
};

export function ImagePreviewDialog({
  item,
  open,
  onOpenChange,
  items,
  currentIndex,
  onNavigate,
}: ImagePreviewDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasNav = !!(items && items.length > 1 && onNavigate && currentIndex !== undefined);
  const count = items?.length ?? 0;

  useEffect(() => {
    if (!open || !hasNav) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); onNavigate!((currentIndex! - 1 + count) % count); }
      if (e.key === "ArrowRight") { e.preventDefault(); onNavigate!((currentIndex! + 1) % count); }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, hasNav, currentIndex, count, onNavigate]);

  const hasInfo = !!(item?.title || item?.description);

  return (
    <Dialog open={open && !!item} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1.25rem)] max-w-5xl overflow-hidden rounded-2xl border-0 bg-black p-0 shadow-2xl gap-0 sm:p-0"
      >
        {item && (
          <>
            <DialogPrimitive.Title className="sr-only">
              {item.title ?? item.alt}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {item.description ?? "Enlarged image preview"}
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
              <div className="relative min-h-[200px] w-full bg-black">
                {item.src.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="max-h-[78dvh] w-full object-contain"
                  />
                ) : (
                  <div className={`relative w-full aspect-video ${hasInfo ? "max-h-[68dvh]" : "max-h-[80dvh]"}`}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                  </div>
                )}

                {/* Nav arrows */}
                {hasNav && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onNavigate!((currentIndex! - 1 + count) % count); }}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 z-20 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4"
                    >
                      <ChevronLeft className="size-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onNavigate!((currentIndex! + 1) % count); }}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 z-20 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4"
                    >
                      <ChevronRight className="size-5" aria-hidden />
                    </button>
                    <p className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {currentIndex! + 1} / {count}
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
                  {item.title && (
                    <p
                      style={{ fontFamily: "var(--font-heading)" }}
                      className="text-base font-semibold text-white sm:text-lg"
                    >
                      {item.title}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {item.description}
                    </p>
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
