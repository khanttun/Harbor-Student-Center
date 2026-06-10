"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart, AlertCircle, CheckCircle2, Trash2, ShieldAlert, Pin } from "lucide-react";

type KindnessNoteRecord = {
  id: string;
  student_name: string;
  message: string;
  created_at: string;
  ip_address: string | null;
  is_pinned: boolean;
};

function getDatabaseErrorMessage(action: "load" | "delete" | "pin" | "reply", errorMessage: string) {
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes("row-level security")) {
    return `Message ${action} blocked by Supabase table policy. Add a delete policy on kindness_notes for authenticated users.`;
  }

  if (normalizedMessage.includes("relation") && normalizedMessage.includes("does not exist")) {
    return 'Supabase table "kindness_notes" does not exist. Run supabase/kindness-notes-setup.sql first.';
  }

  return `Message ${action} failed: ${errorMessage}`;
}

export default function KindnessNotesForm() {
  const supabase = createClient();
  const [notes, setNotes] = useState<KindnessNoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadNotes();

    const channel = supabase
      .channel("admin_kindness_notes_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "kindness_notes" },
        () => {
          void loadNotes();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotes() {
    const { data, error } = await supabase
      .from("kindness_notes")
      .select("id, student_name, message, created_at, ip_address, is_pinned")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(getDatabaseErrorMessage("load", error.message));
    } else {
      setNotes((data as KindnessNoteRecord[]) ?? []);
    }

    setLoading(false);
  }

  async function handleDelete(noteId: string, studentName: string) {
    const confirmed = window.confirm(
      `Take down this message from ${studentName}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(noteId);
    setMessage("");

    const { error } = await supabase.from("kindness_notes").delete().eq("id", noteId);

    if (error) {
      setMessage(getDatabaseErrorMessage("delete", error.message));
    } else {
      setMessage("Message taken down successfully.");
      await loadNotes();
    }

    setDeletingId(null);
  }

  async function handleTogglePin(noteId: string) {
    setPinningId(noteId);
    setMessage("");

    const response = await fetch("/api/kindness-notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    });

    const result = await response.json();
    setPinningId(null);

    if (!response.ok) {
      setMessage(getDatabaseErrorMessage("pin", result.error ?? "Failed to update pin status."));
      return;
    }

    setMessage(result.is_pinned ? "Message pinned." : "the message is unpinned");
    await loadNotes();
  }

  async function handleReply(noteId: string) {
    const reply = replyText[noteId]?.trim() ?? "";
    if (!reply) {
      setMessage("Reply content is required.");
      return;
    }

    setReplyingId(noteId);
    setMessage("");

    const response = await fetch("/api/kindness-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent_id: noteId, message: reply }),
    });

    const result = await response.json();
    setReplyingId(null);

    if (!response.ok) {
      setMessage(getDatabaseErrorMessage("reply", result.error ?? "Failed to post reply."));
      return;
    }

    setReplyText((current) => ({ ...current, [noteId]: "" }));
    setMessage("Reply posted successfully.");
    await loadNotes();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="overflow-hidden border border-border bg-card shadow-xl transition-all rounded-2xl">
        <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-4 sm:gap-4 sm:px-8 sm:py-6">
          <div className="rounded-xl bg-primary p-3 text-primary-foreground shadow-lg shadow-primary/20">
            <Heart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Messages of Appreciation</h2>
            <p className="text-sm text-muted-foreground">
              Review and remove abusive or malicious messages from the Memories page
            </p>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-8">
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">
              IP addresses are recorded for each submission. Use them to identify repeat abuse before
              taking down a message.
            </p>
          </div>

          {message && (
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 duration-300 animate-in fade-in slide-in-from-top-2 ${
                message.includes("failed") || message.includes("blocked")
                  ? "border-red-500/20 bg-red-500/10 text-red-600"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              }`}
            >
              {message.includes("failed") || message.includes("blocked") ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span className="text-sm font-bold">{message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-card shadow-xl transition-all rounded-2xl">
        <div className="flex flex-col gap-2 border-b border-border bg-muted/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Published Messages</h3>
            <p className="text-sm text-muted-foreground">
              These appear on the Memories page. Remove any message that violates community guidelines.
            </p>
          </div>
          <span className="text-sm font-semibold text-muted-foreground">{notes.length} total</span>
        </div>

        <div className="max-h-125 space-y-4 overflow-y-auto p-6">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading messages...</p>
          ) : notes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="space-y-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold text-foreground">{note.student_name}</h4>
                      {note.is_pinned ? (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          Pinned
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{note.message}&rdquo;</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <p>Posted {new Date(note.created_at).toLocaleString()}</p>
                      {note.ip_address && <p>IP: {note.ip_address}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {note.is_pinned ? (
                      <button
                        type="button"
                        onClick={() => void handleTogglePin(note.id)}
                        disabled={pinningId === note.id}
                        className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pin size={16} />
                        <span className="group-hover:hidden">
                          {pinningId === note.id ? "Updating..." : "Pinned"}
                        </span>
                        <span className="hidden group-hover:inline">Unpin</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleTogglePin(note.id)}
                        disabled={pinningId === note.id}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pin size={16} />
                        {pinningId === note.id ? "Updating..." : "Pin"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleDelete(note.id, note.student_name)}
                      disabled={deletingId === note.id}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Take down message from ${note.student_name}`}
                    >
                      <Trash2 size={16} />
                      {deletingId === note.id ? "Removing..." : "Take Down"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="sr-only" htmlFor={`reply-${note.id}`}>
                    Reply to note
                  </label>
                  <input
                    id={`reply-${note.id}`}
                    value={replyText[note.id] ?? ""}
                    onChange={(event) =>
                      setReplyText((current) => ({ ...current, [note.id]: event.target.value }))
                    }
                    placeholder="Write an official reply..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => void handleReply(note.id)}
                    disabled={replyingId === note.id}
                    className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {replyingId === note.id ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Note: Removed messages disappear from the Memories page immediately.
      </p>
    </div>
  );
}
