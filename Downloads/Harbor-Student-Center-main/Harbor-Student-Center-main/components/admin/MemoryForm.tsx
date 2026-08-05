"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Camera, Pencil, Trash2 } from "lucide-react";
import { getMemoryCoverImage, getMemoryImages, toMemoryImagePayload } from "@/lib/memory-images";

interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  image_url: string;
  image_urls?: string[] | string | null;
  created_at: string;
}

type ImageEntry =
  | { kind: "existing"; url: string }
  | { kind: "pending"; file: File; preview: string };

function getDatabaseErrorMessage(error: unknown): string {
  if (!error) {
    return "Unknown error occurred. Check that Supabase credentials are configured.";
  }
  const message =
    (error as { message?: string })?.message ||
    (typeof error === "string" ? error : JSON.stringify(error)) ||
    "";
  if (message.includes("policies") || message.includes("RLS")) {
    return "Image storage permission denied. Ensure RLS policies allow authenticated users.";
  }
  if (message.includes("no rows") || message.includes("not found")) {
    return "Memory not found. It may have been deleted.";
  }
  if (message.includes("relation") && message.includes("does not exist")) {
    return "Memories table not found. Create table 'memories' with fields: id, title, date, caption, image_url, image_urls, created_at.";
  }
  if (message.includes("image_urls")) {
    return "Multiple photos require the image_urls column. Run supabase/add-memory-image-urls.sql in your Supabase SQL editor.";
  }
  if (!message) {
    return "Failed to load memories. Check your Supabase configuration.";
  }
  return `Error: ${message}`;
}

export default function MemoryForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);

  useEffect(() => {
    void loadMemories();
  }, []);

  async function loadMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Failed to load memories:", getDatabaseErrorMessage(error));
    } else {
      setMemories((data as Memory[]) || []);
    }
  }

  function resetForm() {
    setTitle("");
    setDate("");
    setCaption("");
    imageEntries.forEach((entry) => {
      if (entry.kind === "pending") {
        URL.revokeObjectURL(entry.preview);
      }
    });
    setImageEntries([]);
    setEditingMemoryId(null);
    setMessage("");
  }

  async function handleEdit(memory: Memory) {
    setEditingMemoryId(memory.id);
    setTitle(memory.title);
    setDate(memory.date);
    setCaption(memory.caption);
    setImageEntries(
      getMemoryImages(memory).map((url) => ({ kind: "existing" as const, url })),
    );
    setMessage("");
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const validEntries: ImageEntry[] = [];

    for (const file of files) {
      if (file.type && !file.type.startsWith("image/")) {
        setMessage("Please select image files only");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Each image must be smaller than 5MB");
        return;
      }
      validEntries.push({
        kind: "pending",
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setImageEntries((current) => [...current, ...validEntries]);
    setMessage("");
  };

  function removeImageAt(index: number) {
    setImageEntries((current) => {
      const entry = current[index];
      if (entry?.kind === "pending") {
        URL.revokeObjectURL(entry.preview);
      }
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  async function uploadPendingImages(entries: ImageEntry[]): Promise<string[] | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setMessage("Image upload requires an authenticated dashboard session. Sign in again and retry.");
      return null;
    }

    const uploadedUrls: string[] = [];

    for (const entry of entries) {
      if (entry.kind === "existing") {
        uploadedUrls.push(entry.url);
        continue;
      }

      try {
        const fileName = entry.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const { data, error } = await supabase.storage
          .from("memory-images")
          .upload(`memories/${Date.now()}-${crypto.randomUUID()}-${fileName}`, entry.file, {
            cacheControl: "3600",
            upsert: false,
            contentType: entry.file.type,
          });

        if (error) {
          throw error;
        }

        uploadedUrls.push(
          supabase.storage.from("memory-images").getPublicUrl(data.path).data.publicUrl,
        );
      } catch (error) {
        setMessage(`Image upload failed: ${getDatabaseErrorMessage(error)}`);
        return null;
      }
    }

    return uploadedUrls;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (imageEntries.length === 0) {
      setMessage("Please add at least one photo for this memory.");
      setLoading(false);
      return;
    }

    const imageUrls = await uploadPendingImages(imageEntries);
    if (!imageUrls) {
      setLoading(false);
      return;
    }

    const imagePayload = toMemoryImagePayload(imageUrls);

    try {
      if (editingMemoryId) {
        const { error } = await supabase
          .from("memories")
          .update({
            title,
            date,
            caption,
            ...imagePayload,
          })
          .eq("id", editingMemoryId);

        if (error) {
          throw error;
        }
        setMessage("Memory updated successfully!");
      } else {
        const { error } = await supabase.from("memories").insert([
          {
            title,
            date,
            caption,
            ...imagePayload,
          },
        ]);

        if (error) {
          throw error;
        }
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
    if (!confirm("Are you sure you want to delete this memory?")) {
      return;
    }

    try {
      const { error } = await supabase.from("memories").delete().eq("id", id);

      if (error) {
        throw error;
      }
      setMessage("Memory deleted successfully!");
      await loadMemories();
    } catch (error) {
      setMessage(getDatabaseErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-8"
      >
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground">
            {editingMemoryId ? "Edit Memory" : "Add New Memory"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {editingMemoryId
              ? "Update this memory in the timeline."
              : "Upload one or more photos. They will appear as a gallery when visitors click the memory card."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Memory Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Pizza Night"
                className="w-full rounded-lg border bg-background p-3 outline-none transition-all focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Date</label>
              <input
                value={date}
                onChange={(event) => setDate(event.target.value)}
                type="date"
                className="w-full rounded-lg border bg-background p-3 outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Upload Photos</label>
            <label className="group flex h-39 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 transition-all hover:bg-primary/10">
              <Camera className="mb-2 h-8 w-8 text-primary/40 transition-colors group-hover:text-primary" />
              <span className="text-xs font-medium text-primary/60">Select one or more images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              {imageEntries.length} photo{imageEntries.length === 1 ? "" : "s"} selected
            </p>
          </div>
        </div>

        {imageEntries.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {imageEntries.map((entry, index) => (
              <div
                key={entry.kind === "pending" ? entry.preview : entry.url}
                className="relative aspect-square overflow-hidden rounded-lg border border-border shadow-inner"
              >
                <img
                  src={entry.kind === "pending" ? entry.preview : entry.url}
                  alt={`Memory photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImageAt(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-semibold">Caption / Story</label>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="What made this moment special?"
            className="h-24 w-full resize-none rounded-lg border bg-background p-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Upload className="h-5 w-5 animate-bounce" />
                {editingMemoryId ? "Updating..." : "Saving..."}
              </span>
            ) : editingMemoryId ? (
              "Update Memory"
            ) : (
              "Save to Timeline"
            )}
          </button>
          {editingMemoryId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-border px-6 py-4 font-bold transition-all hover:bg-muted"
            >
              Cancel
            </button>
          ) : null}
        </div>

        {message ? (
          <div
            className={`animate-in fade-in slide-in-from-bottom-2 rounded-lg p-4 text-center text-sm font-bold ${
              message.includes("Error") || message.includes("failed") || message.includes("Please")
                ? "bg-red-500/10 text-red-500"
                : "bg-green-500/10 text-green-600"
            }`}
          >
            {message}
          </div>
        ) : null}
      </form>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-8">
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground">Memories Timeline</h2>
          <p className="text-sm text-muted-foreground">{memories.length} memories on the timeline</p>
        </div>

        {memories.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No memories yet. Create your first one!</p>
        ) : (
          <div className="max-h-125 space-y-3 overflow-y-auto">
            {memories.map((memory) => {
              const images = getMemoryImages(memory);
              const cover = getMemoryCoverImage(memory);

              return (
                <div
                  key={memory.id}
                  className="rounded-lg border border-border p-4 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    {cover ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <img src={cover} alt={memory.title} className="h-full w-full object-cover" />
                        {images.length > 1 ? (
                          <span className="absolute bottom-1 right-1 rounded-full bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {images.length}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-foreground">{memory.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(memory.date).toLocaleDateString()}
                      </p>
                      <p className="line-clamp-2 text-sm text-foreground">{memory.caption}</p>
                    </div>
                    <div className="flex shrink-0 gap-2 self-end sm:self-start">
                      <button
                        onClick={() => void handleEdit(memory)}
                        className="rounded-lg p-2 text-blue-500 transition-colors hover:bg-blue-500/10"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => void handleDelete(memory.id)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
