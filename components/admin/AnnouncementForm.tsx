"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.from("announcements").insert([{ title, content }]);
    if (error) setMessage("Announcement creation failed");
    else setMessage("Announcement created!");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" required />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="w-full p-2 border rounded" required />
      <button type="submit" className="bg-accent text-accent-foreground px-4 py-2 rounded" disabled={loading}>{loading ? "Saving..." : "Save Announcement"}</button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
