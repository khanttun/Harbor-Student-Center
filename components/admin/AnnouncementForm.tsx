"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Megaphone, Send, AlertCircle, CheckCircle2 } from "lucide-react";

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
    
    if (error) {
      setMessage("Announcement creation failed");
    } else {
      setMessage("Announcement posted successfully!");
      setTitle("");
      setContent("");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden transition-all"
      >
        {/* Header Section */}
        <div className="bg-primary/5 px-8 py-6 border-b border-border flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
            <Megaphone size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">New Announcement</h2>
            <p className="text-sm text-muted-foreground">Broadcast a message to all students</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground ml-1">Heading</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Winter Break Schedule Update" 
              className="w-full p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50" 
              required 
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-foreground">Message Details</label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                {content.length} characters
              </span>
            </div>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Write your announcement here..." 
              className="w-full p-4 bg-background border border-border rounded-xl h-44 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none leading-relaxed" 
              required 
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing...</span>
              </div>
            ) : (
              <>
                <span>Post Announcement</span>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>

          {/* Success/Error Feedback */}
          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.includes('failed') 
                ? 'bg-red-500/10 border-red-500/20 text-red-600' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
            }`}>
              {message.includes('failed') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span className="text-sm font-bold">{message}</span>
            </div>
          )}
        </div>
      </form>
      
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Note: Announcements are visible to all students on the main dashboard.
      </p>
    </div>
  );
}