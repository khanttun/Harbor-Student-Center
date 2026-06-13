"use client";

import { Heart, MessageCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface KindnessNote {
  id: string;
  student_name: string;
  message: string;
  created_at: string;
  is_pinned: boolean;
  parent_id: string | null;
  love_count: number;
}

const LIKED_NOTES_KEY = "harbor_liked_notes";

function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  if (!url || !key || url.includes("your-project") || key === "your-anon-key-here") return false;
  return true;
}

function LeaveNoteButton() {
  return (
    <a
      href="/contact#leave-a-note"
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-colors duration-200 hover:bg-primary/90 hover:shadow-xl"
    >
      <Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
      Leave a Note of Kindness
    </a>
  );
}

function LoveButton({
  note,
  liked,
  onToggle,
  size = "md",
}: {
  note: KindnessNote;
  liked: boolean;
  onToggle: (note: KindnessNote) => void;
  size?: "sm" | "md";
}) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const count = note.love_count ?? 0;

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle(note); }}
      aria-label={liked ? "Remove love reaction" : "Love this note"}
      aria-pressed={liked}
      className={`group/love flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 ${liked
          ? "bg-rose-100 text-rose-500 dark:bg-rose-900/40 dark:text-rose-400"
          : "text-muted-foreground/50 hover:bg-rose-50 hover:text-rose-400 dark:hover:bg-rose-900/20"
        }`}
    >
      <Heart
        className={`${iconClass} transition-transform duration-200 group-hover/love:scale-110 ${liked ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" : ""
          }`}
      />
      {count > 0 && (
        <span className="text-xs font-semibold tabular-nums">{count}</span>
      )}
    </button>
  );
}

export function KindnessNotesSection() {
  const [notes, setNotes] = useState<KindnessNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_NOTES_KEY);
      if (stored) setLikedNotes(new Set(JSON.parse(stored) as string[]));
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("kindness_notes")
          .select("id, student_name, message, created_at, is_pinned, parent_id, love_count")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch kindness notes:", error.message);
          setNotes([]);
          return;
        }

        const allNotes = ((data as KindnessNote[]) ?? []).map((n) => ({
          ...n,
          love_count: n.love_count ?? 0,
        }));

        const sorted = allNotes.sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setNotes(sorted);
      } catch (err) {
        console.error("Failed to fetch kindness notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchNotes();

    const channel = supabase
      .channel("kindness_notes_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "kindness_notes" }, () => {
        void fetchNotes();
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, []);

  const handleLoveToggle = useCallback(async (note: KindnessNote) => {
    const isLiked = likedNotes.has(note.id);
    const delta = isLiked ? -1 : 1;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id ? { ...n, love_count: Math.max(0, n.love_count + delta) } : n,
      ),
    );
    setLikedNotes((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(note.id); else next.add(note.id);
      try { localStorage.setItem(LIKED_NOTES_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });

    try {
      const res = await fetch("/api/kindness-notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "love", id: note.id, delta }),
      });
      if (!res.ok) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === note.id ? { ...n, love_count: Math.max(0, n.love_count - delta) } : n,
          ),
        );
        setLikedNotes((prev) => {
          const next = new Set(prev);
          if (isLiked) next.add(note.id); else next.delete(note.id);
          try { localStorage.setItem(LIKED_NOTES_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
          return next;
        });
      }
    } catch {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id ? { ...n, love_count: Math.max(0, n.love_count - delta) } : n,
        ),
      );
      setLikedNotes((prev) => {
        const next = new Set(prev);
        if (isLiked) next.add(note.id); else next.delete(note.id);
        try { localStorage.setItem(LIKED_NOTES_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
        return next;
      });
    }
  }, [likedNotes]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handlePrevSlide = () => setCurrentSlide((p) => (p === 0 ? slideshowNotes.length - 1 : p - 1));
  const handleNextSlide = () => setCurrentSlide((p) => (p === slideshowNotes.length - 1 ? 0 : p + 1));

  const pinnedNote = notes.find((n) => n.is_pinned) ?? null;
  const otherNotes = notes.filter((n) => !n.is_pinned);
  // When there's a pinned note, slideshow shows only unpinned. Otherwise shows all.
  const slideshowNotes = pinnedNote ? otherNotes : notes;

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-linear-to-b from-background via-primary/5 to-background">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -mr-48 -mt-48 top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -mb-48 -ml-48 bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500 sm:h-6 sm:w-6" />
            <h2
              className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Messages of Appreciation
            </h2>
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500 sm:h-6 sm:w-6" />
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Read the kind words students have left for Sayarma Katrina and Sayar Floyd
          </p>
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            <p className="flex items-start justify-center gap-2 text-left sm:text-center">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Abusive or malicious messages will be taken down immediately. IP addresses are recorded to prevent abuse.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : notes.length > 0 ? (
          <>
            {/* ── Pinned (featured) note ── */}
            {pinnedNote && (
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                    Featured Message
                  </span>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 bg-linear-to-r from-primary/5 to-primary/10 shadow-lg transition-shadow duration-300 group-hover:shadow-xl" />

                  <div className="relative p-5 sm:p-8 md:p-10">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary shadow-md ring-2 ring-primary/20">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="grow">
                        <h3
                          className="text-lg font-bold text-foreground"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {pinnedNote.student_name}
                        </h3>
                        <time className="text-sm text-muted-foreground">
                          {formatDate(pinnedNote.created_at)}
                        </time>
                      </div>

                      <LoveButton
                        note={pinnedNote}
                        liked={likedNotes.has(pinnedNote.id)}
                        onToggle={handleLoveToggle}
                        size="md"
                      />
                    </div>

                    <p className="mb-4 text-base italic leading-relaxed text-foreground sm:text-lg">
                      &ldquo;{pinnedNote.message}&rdquo;
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-l-2xl bg-linear-to-b from-primary to-primary/50 transition-all duration-300 group-hover:w-2" />
                </div>
              </div>
            )}

            {/* ── Other messages ── */}
            {(pinnedNote ? otherNotes : notes).length > 0 && (
              <>
                {!isExpanded ? (
                  /* Slideshow (unpinned notes, or all notes when nothing is pinned) */
                  <div className="mb-8">
                    <div
                      key={slideshowNotes[currentSlide]?.id}
                      className="group relative"
                      style={{ animation: "fadeInScale 0.5s ease-out" }}
                    >
                      <div className="absolute inset-0 rounded-2xl border border-primary/20 bg-linear-to-r from-white/5 to-white/10 shadow-md transition-shadow duration-300 group-hover:shadow-lg" />

                      <div className="relative p-5 sm:p-8 md:p-10">
                        <div className="mb-6 flex items-start gap-4">
                          <div className="shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-md">
                              <MessageCircle className="h-6 w-6" />
                            </div>
                          </div>

                          <div className="grow">
                            <h3
                              className="text-lg font-bold text-foreground"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {slideshowNotes[currentSlide]?.student_name}
                            </h3>
                            <time className="text-sm text-muted-foreground">
                              {slideshowNotes[currentSlide] ? formatDate(slideshowNotes[currentSlide].created_at) : ""}
                            </time>
                          </div>

                          {slideshowNotes[currentSlide] && (
                            <LoveButton
                              note={slideshowNotes[currentSlide]}
                              liked={likedNotes.has(slideshowNotes[currentSlide].id)}
                              onToggle={handleLoveToggle}
                              size="md"
                            />
                          )}
                        </div>

                        <p className="mb-8 flex min-h-20 items-center text-base italic leading-relaxed text-foreground sm:min-h-25 sm:text-lg">
                          &ldquo;{slideshowNotes[currentSlide]?.message}&rdquo;
                        </p>

                        <div className="flex items-center justify-between border-t border-primary/20 pt-6">
                          <button
                            onClick={handlePrevSlide}
                            className="rounded-lg p-2 transition-colors duration-200 hover:bg-primary/10"
                            aria-label="Previous message"
                          >
                            <ChevronLeft className="h-6 w-6 text-primary" />
                          </button>

                          <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                              {currentSlide + 1} / {slideshowNotes.length}
                            </p>
                            <div className="mt-2 flex justify-center gap-1">
                              {slideshowNotes.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentSlide(index)}
                                  className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                      ? "w-6 bg-primary"
                                      : "w-2 bg-primary/20 hover:bg-primary/40"
                                    }`}
                                  aria-label={`Go to message ${index + 1}`}
                                />
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleNextSlide}
                            className="rounded-lg p-2 transition-colors duration-200 hover:bg-primary/10"
                            aria-label="Next message"
                          >
                            <ChevronRight className="h-6 w-6 text-primary" />
                          </button>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl bg-linear-to-b from-primary to-primary/50 transition-all duration-300 group-hover:w-1.5" />
                    </div>

                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 font-semibold text-primary transition-all duration-200 hover:bg-primary/20"
                      >
                        See All Messages
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Expanded — all other messages */
                  <div className="mb-8">
                    <div className="mb-6 flex justify-center">
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 font-semibold text-primary transition-all duration-200 hover:bg-primary/20"
                      >
                        Show Slideshow
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(pinnedNote ? otherNotes : notes).map((note, index) => (
                        <div
                          key={note.id}
                          className="group relative"
                          style={{ animation: `slideInUp 0.5s ease-out ${index * 0.1}s both` }}
                        >
                          <div className="absolute inset-0 rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 to-primary/10 shadow-sm transition-shadow duration-300 group-hover:shadow-md" />

                          <div className="relative p-6">
                            <div className="mb-3 flex items-start gap-4">
                              <div className="mt-1 shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-md">
                                  <MessageCircle className="h-5 w-5" />
                                </div>
                              </div>

                              <div className="grow">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                  <h3
                                    className="text-sm font-bold text-foreground"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                  >
                                    {note.student_name}
                                  </h3>
                                  <time className="text-xs text-muted-foreground">
                                    {formatDate(note.created_at)}
                                  </time>
                                </div>
                              </div>

                              <LoveButton
                                note={note}
                                liked={likedNotes.has(note.id)}
                                onToggle={handleLoveToggle}
                                size="sm"
                              />
                            </div>

                            <p className="py-1 pl-0 text-base leading-relaxed text-foreground sm:pl-14">
                              &ldquo;{note.message}&rdquo;
                            </p>
                          </div>

                          <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-linear-to-b from-primary to-primary/50 transition-all duration-300 group-hover:w-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-12 text-center">
              <p className="mb-4 text-muted-foreground">Want to leave a message of your own?</p>
              <LeaveNoteButton />
            </div>
          </>
        ) : (
          <div className="px-6 py-12 text-center">
            <MessageCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-6 text-lg text-muted-foreground">
              No messages yet. Be the first to share your appreciation!
            </p>
            <LeaveNoteButton />
          </div>
        )}
      </div>
    </section>
  );
}
