"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Upload, X } from "lucide-react";

type EventRecord = {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string | null;
  created_at: string;
};

const EVENT_IMAGE_BUCKET = "event-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getUploadErrorMessage(errorMessage: string) {
  if (errorMessage.toLowerCase().includes("bucket not found")) {
    return 'Supabase bucket "event-images" was not found. Create it in Storage first.';
  }

  if (errorMessage.toLowerCase().includes("row-level security")) {
    return 'Image upload blocked by Supabase Storage policy. Add an insert policy for authenticated users on "event-images".';
  }

  return `Image upload failed: ${errorMessage}`;
}

function getDatabaseErrorMessage(action: "load" | "create" | "update" | "delete", errorMessage: string) {
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes("row-level security")) {
    return `Event ${action} blocked by Supabase table policy. Add a policy on the events table for authenticated users.`;
  }

  if (normalizedMessage.includes("relation") && normalizedMessage.includes("does not exist")) {
    return 'Supabase table "events" does not exist. Create the events table first.';
  }

  if (normalizedMessage.includes("column") && normalizedMessage.includes("does not exist")) {
    return `Event ${action} failed because the events table schema does not match the app fields: ${errorMessage}`;
  }

  return `Event ${action} failed: ${errorMessage}`;
}

export default function EventForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadEvents();
  }, []);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("id,title,date,description,image_url,created_at")
      .order("date", { ascending: true });

    if (error) {
      setMessage(getDatabaseErrorMessage("load", error.message));
    } else {
      setEvents((data as EventRecord[]) ?? []);
    }

    if (!isBootstrapped) {
      setIsBootstrapped(true);
    }
  }

  function resetForm() {
    setTitle("");
    setDate("");
    setDescription("");
    setImage(null);
    setPreviewUrl(null);
    setEditingEventId(null);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && !file.type.startsWith("image/")) {
      setMessage("Please upload a valid image file.");
      return;
    }

    if (file && file.size > MAX_IMAGE_SIZE_BYTES) {
      setMessage("Image must be 5MB or smaller.");
      return;
    }

    setImage(file);
    setMessage("");

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let imageUrl: string | null = null;
    const currentEvent = events.find((event) => event.id === editingEventId);

    if (editingEventId) {
      imageUrl = currentEvent?.image_url ?? null;
    }

    if (image) {
      const sanitizedFileName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const { data, error } = await supabase.storage
        .from(EVENT_IMAGE_BUCKET)
        .upload(`events/${Date.now()}-${crypto.randomUUID()}-${sanitizedFileName}`, image, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type,
        });

      if (error) {
        setMessage(getUploadErrorMessage(error.message));
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage.from(EVENT_IMAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
    }

    if (editingEventId) {
      const { error } = await supabase
        .from("events")
        .update({ title, date, description, image_url: imageUrl })
        .eq("id", editingEventId);

      if (error) {
        setMessage(getDatabaseErrorMessage("update", error.message));
      } else {
        setMessage("Event updated successfully!");
        resetForm();
        await loadEvents();
      }
    } else {
      const { error } = await supabase
        .from("events")
        .insert([{ title, date, description, image_url: imageUrl }]);

      if (error) {
        setMessage(getDatabaseErrorMessage("create", error.message));
      } else {
        setMessage("Event created successfully!");
        resetForm();
        await loadEvents();
      }
    }

    setLoading(false);
  }

  function handleEdit(event: EventRecord) {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setDescription(event.description);
    setImage(null);
    setPreviewUrl(event.image_url);
    setMessage("");
  }

  async function handleDelete(eventId: string) {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) {
      return;
    }

    setMessage("");
    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      setMessage(getDatabaseErrorMessage("delete", error.message));
      return;
    }

    if (editingEventId === eventId) {
      resetForm();
    }

    setMessage("Event deleted successfully!");
    await loadEvents();
  }

  const submitLabel = editingEventId
    ? loading
      ? "Updating Event..."
      : "Update Event"
    : loading
      ? "Creating Event..."
      : "Save Event";

  const imageLabel = editingEventId ? "Update Event Cover Image" : "Event Cover Image";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="p-6 space-y-6 border shadow-sm bg-card rounded-xl border-border">
        <div className="space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="w-full p-3 border rounded-lg outline-none bg-background focus:ring-2 focus:ring-primary" required />
          <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full p-3 border rounded-lg outline-none bg-background focus:ring-2 focus:ring-primary" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full h-32 p-3 border rounded-lg outline-none bg-background focus:ring-2 focus:ring-primary" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{imageLabel}</label>

          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center w-full h-40 transition-all border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 transition-colors text-muted-foreground group-hover:text-primary" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">PNG, JPG or WEBP (Max 5MB)</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          ) : (
            <div className="relative overflow-hidden border rounded-lg border-border bg-muted">
              <img src={previewUrl} alt="Preview" className="object-cover w-full h-48" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreviewUrl(null);
                }}
                className="absolute p-1 text-white bg-red-500 rounded-full shadow-lg top-2 right-2 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="w-full py-3 font-bold transition-all rounded-lg shadow-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {submitLabel}
          </button>

          {editingEventId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 font-semibold transition-colors border rounded-lg border-border bg-background hover:bg-muted"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p className={`text-center text-sm font-medium p-2 rounded ${message.includes("failed") ? "text-red-500 bg-red-50" : "text-green-600 bg-green-50"}`}>
            {message}
          </p>
        )}
      </form>

      <section className="border shadow-sm bg-card rounded-xl border-border">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold">Existing Events</h2>
          <p className="text-sm text-muted-foreground">Create, update, and remove events shown on the public events page.</p>
        </div>

        <div className="divide-y divide-border">
          {!isBootstrapped ? (
            <p className="p-5 text-sm text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No events yet. Create your first one above.</p>
          ) : (
            events.map((event) => (
              <article key={event.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="max-w-2xl text-sm leading-relaxed text-foreground/90">{event.description}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(event)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md border-border bg-background hover:bg-muted"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(event.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}