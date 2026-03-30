import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EventForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let imageUrl = "";
    if (image) {
      const { data, error } = await supabase.storage.from("event-images").upload(`events/${Date.now()}-${image.name}`, image);
      if (error) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = data?.path ? supabase.storage.from("event-images").getPublicUrl(data.path).data.publicUrl : "";
    }
    const { error } = await supabase.from("events").insert([{ title, date, description, image_url: imageUrl }]);
    if (error) setMessage("Event creation failed");
    else setMessage("Event created!");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" required />
      <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full p-2 border rounded" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" required />
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full" />
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded" disabled={loading}>{loading ? "Saving..." : "Save Event"}</button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
