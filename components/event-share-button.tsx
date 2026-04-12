"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

type EventShareButtonProps = {
    title: string;
};

export function EventShareButton({ title }: EventShareButtonProps) {
    const [status, setStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

    async function handleShare() {
        const pageUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: `Check out this event: ${title}`,
                    url: pageUrl,
                });
                setStatus("shared");
                return;
            }

            await navigator.clipboard.writeText(pageUrl);
            setStatus("copied");
        } catch {
            setStatus("error");
        }
    }

    const label =
        status === "shared"
            ? "Shared"
            : status === "copied"
                ? "Link copied"
                : status === "error"
                    ? "Share failed"
                    : "Share";

    return (
        <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border rounded-lg cursor-pointer border-border bg-background hover:bg-muted"
        >
            <Share2 className="w-4 h-4" />
            {label}
        </button>
    );
}
