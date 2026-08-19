"use client";

import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  // Check if using placeholder values or empty
  if (!url || !key || url.includes("your-project") || key === "your-anon-key-here") {
    return false;
  }

  return true;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

type AnnouncementsProps = {
  latestAnnouncement?: AnnouncementRecord | null;
};

const CONTENT_PREVIEW_LENGTH = 220;

export function Announcements({ latestAnnouncement }: AnnouncementsProps) {
  const supabase = createClient();
  const [announcement, setAnnouncement] = useState<AnnouncementRecord | null>(latestAnnouncement ?? null);
  const [loading, setLoading] = useState(latestAnnouncement === undefined);
  const [hasError, setHasError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (latestAnnouncement !== undefined) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isSupabaseConfigured()) { setLoading(false); return; }

    async function loadLatestAnnouncement() {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("id,title,content,created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error) {
          setAnnouncement((data as AnnouncementRecord | null) ?? null);
        } else {
          setHasError(true);
          console.error("Failed to load announcements:", error.message || JSON.stringify(error));
        }
      } catch (err) {
        setHasError(true);
        console.error("Failed to load announcements:", err instanceof Error ? err.message : String(err));
      }

      setLoading(false);
    }

    void loadLatestAnnouncement();
  }, [latestAnnouncement]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="p-5 border shadow-xl rounded-3xl border-border bg-card sm:p-8"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-primary/10 text-primary rounded-2xl">
          <Megaphone className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
          Latest Announcements
        </h2>
      </motion.div>

      <div className="space-y-6">
        {hasError && (
          <motion.div
            variants={itemVariants}
            className="p-6 border rounded-2xl bg-muted/40 border-border"
          >
            <p className="text-muted-foreground">Unable to load announcements. Please configure Supabase credentials in .env.local</p>
          </motion.div>
        )}
        {loading && !hasError ? (
          <motion.div
            variants={itemVariants}
            className="p-6 border rounded-2xl bg-muted/40 border-border"
            aria-busy="true"
            aria-label="Loading latest announcement"
          >
            <div className="h-3 rounded w-28 animate-pulse bg-muted-foreground/15" />
            <div className="w-2/3 h-6 mt-3 rounded animate-pulse bg-muted-foreground/15" />
            <div className="mt-4 space-y-2">
              <div className="w-full h-4 rounded animate-pulse bg-muted-foreground/10" />
              <div className="w-5/6 h-4 rounded animate-pulse bg-muted-foreground/10" />
              <div className="w-2/3 h-4 rounded animate-pulse bg-muted-foreground/10" />
            </div>
          </motion.div>
        ) : announcement ? (
          <motion.div
            variants={itemVariants}
            className="p-6 transition-colors border bg-muted/50 rounded-2xl border-border hover:border-primary/20"
          >
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-primary">
              Posted {new Date(announcement.created_at).toLocaleDateString()}
            </p>
            <h3 className="mb-2 text-xl font-bold text-foreground">
              {announcement.title}
            </h3>
            <p className="text-base whitespace-pre-line text-muted-foreground sm:text-lg">
              {expanded || announcement.content.length <= CONTENT_PREVIEW_LENGTH
                ? announcement.content
                : `${announcement.content.slice(0, CONTENT_PREVIEW_LENGTH).trimEnd()}…`}
            </p>
            {announcement.content.length > CONTENT_PREVIEW_LENGTH && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 text-sm font-semibold rounded text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="p-6 border rounded-2xl bg-muted/40 border-border"
          >
            <p className="text-muted-foreground">No announcements available right now.</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
