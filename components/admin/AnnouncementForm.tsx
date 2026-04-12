"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Megaphone, Send, AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";

type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

function getDatabaseErrorMessage(action: "load" | "create" | "update" | "delete", errorMessage: string) {
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes("row-level security")) {
    return `Announcement ${action} blocked by Supabase table policy. Add a policy on the announcements table for authenticated users.`;
  }

  if (normalizedMessage.includes("relation") && normalizedMessage.includes("does not exist")) {
    return 'Supabase table "announcements" does not exist. Create it before using announcement CRUD.';
  }

  return `Announcement ${action} failed: ${errorMessage}`;
}

export default function AnnouncementForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("id,title,content,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(getDatabaseErrorMessage("load", error.message));
      return;
    }

    setAnnouncements((data as AnnouncementRecord[]) ?? []);
  }

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingAnnouncementId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (editingAnnouncementId) {
      const { error } = await supabase
        .from("announcements")
        .update({ title, content })
        .eq("id", editingAnnouncementId);

      if (error) {
        setMessage(getDatabaseErrorMessage("update", error.message));
      } else {
        setMessage("Announcement updated successfully!");
        resetForm();
        await loadAnnouncements();
      }
    } else {
      const { error } = await supabase.from("announcements").insert([{ title, content }]);

      if (error) {
        setMessage(getDatabaseErrorMessage("create", error.message));
      } else {
        setMessage("Announcement posted successfully!");
        resetForm();
        await loadAnnouncements();
      }
    }

    setLoading(false);
  }

  function handleEdit(announcement: AnnouncementRecord) {
    setEditingAnnouncementId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setMessage("");
  }

  async function handleDelete(announcementId: string) {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("announcements").delete().eq("id", announcementId);

    if (error) {
      setMessage(getDatabaseErrorMessage("delete", error.message));
      return;
    }

    if (editingAnnouncementId === announcementId) {
      resetForm();
    }

    setMessage("Announcement deleted successfully!");
    await loadAnnouncements();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden transition-all border shadow-xl bg-card rounded-2xl border-border"
      >
        {/* Header Section */}
        <div className="flex items-center gap-4 px-8 py-6 border-b bg-primary/5 border-border">
          <div className="p-3 shadow-lg bg-primary rounded-xl text-primary-foreground shadow-primary/20">
            <Megaphone size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {editingAnnouncementId ? "Edit Announcement" : "New Announcement"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editingAnnouncementId ? "Update this message for all students" : "Broadcast a message to all students"}
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-foreground">Heading</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Winter Break Schedule Update"
              className="w-full p-4 transition-all border outline-none bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/50"
              required
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-foreground">Message Details</label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                {content.length} characters
              </span>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your announcement here..."
              className="w-full p-4 leading-relaxed transition-all border outline-none resize-none bg-background border-border rounded-xl h-44 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="flex items-center justify-center w-full gap-2 py-4 font-bold transition-all shadow-lg cursor-pointer bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-primary/10 group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                <span>{editingAnnouncementId ? "Updating..." : "Publishing..."}</span>
              </div>
            ) : (
              <>
                <span>{editingAnnouncementId ? "Update Announcement" : "Post Announcement"}</span>
                <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </>
            )}
          </button>

          {editingAnnouncementId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-3 font-semibold transition-colors border cursor-pointer rounded-xl border-border text-foreground hover:bg-muted"
            >
              Cancel Editing
            </button>
          )}

          {/* Success/Error Feedback */}
          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('failed')
              ? 'bg-red-500/10 border-red-500/20 text-red-600'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              }`}>
              {message.includes('failed') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span className="text-sm font-bold">{message}</span>
            </div>
          )}
        </div>
      </form>

      <div className="overflow-hidden transition-all border shadow-xl bg-card rounded-2xl border-border">
        <div className="flex items-center justify-between px-8 py-6 border-b bg-muted/40 border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">Published Announcements</h3>
            <p className="text-sm text-muted-foreground">The newest announcement becomes the featured latest update.</p>
          </div>
          <span className="text-sm font-semibold text-muted-foreground">{announcements.length} total</span>
        </div>

        <div className="p-6 space-y-4 max-h-125 overflow-y-auto">
          {announcements.length === 0 ? (
            <p className="py-8 text-sm text-center text-muted-foreground">No announcements yet.</p>
          ) : (
            announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className="flex items-start justify-between gap-4 p-4 transition-colors border rounded-xl border-border bg-background hover:bg-muted/30"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-foreground">{announcement.title}</h4>
                    {index === 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-full bg-secondary text-secondary-foreground">
                        LATEST
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(announcement)}
                    className="p-2 transition-colors rounded-lg cursor-pointer text-primary hover:bg-primary/10"
                    aria-label={`Edit ${announcement.title}`}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(announcement.id)}
                    className="p-2 transition-colors rounded-lg cursor-pointer text-destructive hover:bg-destructive/10"
                    aria-label={`Delete ${announcement.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-center text-muted-foreground">
        Note: Announcements are visible to all students on the main dashboard.
      </p>
    </div>
  );
}