"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  maxWidth?: "4xl" | "5xl";
};

export function ImagePreviewDialog({
  item,
  open,
  onOpenChange,
  maxWidth = "4xl",
}: ImagePreviewDialogProps) {
  const maxWClass = maxWidth === "5xl" ? "max-w-5xl" : "max-w-4xl";

  return (
    <Dialog open={open && !!item} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-h-[calc(100dvh-3rem)] w-[calc(100%-1.25rem)] ${maxWClass} gap-0 overflow-hidden p-0 sm:p-0`}
      >
        {item && (
          <>
            <DialogHeader className="gap-2 border-b border-border bg-muted/30 px-5 py-4 text-left">
              <DialogTitle
                style={{ fontFamily: "var(--font-heading)" }}
                className="pr-8 text-xl sm:text-2xl"
              >
                {item.title ?? item.alt}
              </DialogTitle>
              {item.description ? (
                <DialogDescription className="text-sm sm:text-base">
                  {item.description}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">
                  Enlarged image preview
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="relative flex min-h-[200px] w-full max-h-[75dvh] items-center justify-center bg-black p-2">
              {item.src.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt}
                  className="max-h-[70dvh] w-auto max-w-full rounded-md object-contain"
                />
              ) : (
                <div className="relative aspect-video h-full w-full max-h-[70dvh]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
