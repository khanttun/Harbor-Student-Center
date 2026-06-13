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

export function Announcements({ latestAnnouncement }: AnnouncementsProps) {
  const supabase = createClient();
  const [announcement, setAnnouncement] = useState<AnnouncementRecord | null>(latestAnnouncement ?? null);
  const [loading, setLoading] = useState(latestAnnouncement === undefined);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initial state already reflects latestAnnouncement; skip fetch when it was provided by SSR
    if (latestAnnouncement !== undefined) return;

    // Skip fetching if Supabase isn't configured
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
      className="rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-8"
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
          >
            <p className="text-muted-foreground">Loading latest announcement...</p>
          </motion.div>
        ) : announcement ? (
          <motion.div
            variants={itemVariants}
            className="p-6 bg-muted/50 rounded-2xl border border-border hover:border-primary/20 transition-colors"
          >
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-primary">
              Posted {new Date(announcement.created_at).toLocaleDateString()}
            </p>
            <h3 className="font-bold text-xl text-foreground mb-2">
              {announcement.title}
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg">
              {announcement.content}
            </p>
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
