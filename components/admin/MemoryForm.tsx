"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Camera, Pencil, Trash2 } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  image_url: string;
  created_at: string;
}

function getDatabaseErrorMessage(error: any): string {
  const message = error?.message || "";
  if (message.includes("policies") || message.includes("RLS")) {
    return "Image storage permission denied. Ensure RLS policies allow authenticated users.";
  }
  if (message.includes("no rows") || message.includes("not found")) {
    return "Memory not found. It may have been deleted.";
  }
  if (message.includes("relation") && message.includes("does not exist")) {
    return "Memories table not found. Create table 'memories' with fields: id (UUID), title, date, caption, image_url, created_at.";
  }
  return `Error: ${message}`;
}

export default function MemoryForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Failed to load memories:", getDatabaseErrorMessage(error));
    } else {
      setMemories(data || []);
    }
  }

  function resetForm() {
    setTitle("");
    setDate("");
    setCaption("");
    setImage(null);
    setPreviewUrl(null);
    setEditingMemoryId(null);
    setMessage("");
  }

  async function handleEdit(memory: Memory) {
    setEditingMemoryId(memory.id);
    setTitle(memory.title);
    setDate(memory.date);
    setCaption(memory.caption);
    setPreviewUrl(memory.image_url);
    setMessage("");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type && !file.type.startsWith("image/")) {
        setMessage("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image must be smaller than 5MB");
        return;
      }
    }
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (!editingMemoryId) {
      setPreviewUrl(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let imageUrl = previewUrl;

    if (image) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setMessage("Image upload requires an authenticated dashboard session. Sign in again and retry.");
          setLoading(false);
          return;
        }

        const fileName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const { data, error } = await supabase.storage
          .from("memory-images")
          .upload(`memories/${Date.now()}-${crypto.randomUUID()}-${fileName}`, image, {
            cacheControl: "3600",
            upsert: false,
            contentType: image.type,
          });

        if (error) throw error;

        imageUrl = supabase.storage
          .from("memory-images")
          .getPublicUrl(data.path).data.publicUrl;
      } catch (error) {
        setMessage(`Image upload failed: ${getDatabaseErrorMessage(error)}`);
        setLoading(false);
        return;
      }
    }

    try {
      if (editingMemoryId) {
        const { error } = await supabase
          .from("memories")
          .update({
            title,
            date,
            caption,
            image_url: imageUrl,
          })
          .eq("id", editingMemoryId);

        if (error) throw error;
        setMessage("Memory updated successfully!");
      } else {
        const { error } = await supabase.from("memories").insert([
          {
            title,
            date,
            caption,
            image_url: imageUrl,
          },
        ]);

        if (error) throw error;
        setMessage("Memory saved to the timeline!");
      }

      resetForm();
      await loadMemories();
    } catch (error) {
      setMessage(getDatabaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this memory?")) return;

    try {
      const { error } = await supabase.from("memories").delete().eq("id", id);

      if (error) throw error;
      setMessage("Memory deleted successfully!");
      await loadMemories();
    } catch (error) {
      setMessage(getDatabaseErrorMessage(error));
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6 border shadow-xl bg-card rounded-2xl border-border">
        <div className="pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {editingMemoryId ? "Edit Memory" : "Add New Memory"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {editingMemoryId ? "Update this memory in the timeline." : "This will appear on the Timeline Tree."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Memory Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Pizza Night"
                className="w-full p-3 transition-all border rounded-lg outline-none bg-background focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Date</label>
              <input
                value={date}
                onChange={e => setDate(e.target.value)}
                type="date"
                className="w-full p-3 border rounded-lg outline-none bg-background focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Upload Photo</label>
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-39 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all group">
                <Camera className="w-8 h-8 mb-2 transition-colors text-primary/40 group-hover:text-primary" />
                <span className="text-xs font-medium text-primary/60">Select Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            ) : (
              <div className="relative h-39 rounded-lg overflow-hidden border border-border shadow-inner">
                <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    if (!editingMemoryId) setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Caption / Story</label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="What made this moment special?"
            className="w-full h-24 p-3 border rounded-lg outline-none resize-none bg-background focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 cursor-pointer bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 animate-bounce" />
                {editingMemoryId ? "Updating..." : "Saving..."}
              </span>
            ) : editingMemoryId ? "Update Memory" : "Save to Timeline"}
          </button>
          {editingMemoryId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-4 font-bold transition-all border border-border rounded-xl hover:bg-muted"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-center text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${message.includes("Error") || message.includes("failed")
            ? "bg-red-500/10 text-red-500"
            : "bg-green-500/10 text-green-600"
            }`}>
            {message}
          </div>
        )}
      </form>

      {/* --- MEMORIES LIST SECTION --- */}
      <div className="p-8 space-y-6 border shadow-xl bg-card rounded-2xl border-border">
        <div className="pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Memories Timeline</h2>
          <p className="text-sm text-muted-foreground">{memories.length} memories on the timeline</p>
        </div>

        {memories.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No memories yet. Create your first one!</p>
        ) : (
          <div className="space-y-3 max-h-125 overflow-y-auto">
            {memories.map(memory => (
              <div key={memory.id} className="p-4 transition-all border rounded-lg border-border hover:shadow-md">
                <div className="flex gap-4">
                  {memory.image_url && (
                    <img
                      src={memory.image_url}
                      alt={memory.title}
                      className="object-cover w-20 h-20 rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-foreground">{memory.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(memory.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">{memory.caption}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="p-2 text-blue-500 transition-colors rounded-lg hover:bg-blue-500/10"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}