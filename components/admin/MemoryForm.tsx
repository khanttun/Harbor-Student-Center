import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemoryForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let imageUrl = "";
    if (image) {
      const { data, error } = await supabase.storage.from("memory-images").upload(`memories/${Date.now()}-${image.name}`, image);
      if (error) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = data?.path ? supabase.storage.from("memory-images").getPublicUrl(data.path).data.publicUrl : "";
    }
    const { error } = await supabase.from("memories").insert([{ title, date, caption, image_url: imageUrl }]);
    if (error) setMessage("Memory creation failed");
    else setMessage("Memory created!");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" required />
      <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full p-2 border rounded" required />
      <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption" className="w-full p-2 border rounded" required />
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full" />
      <button type="submit" className="bg-secondary text-secondary-foreground px-4 py-2 rounded" disabled={loading}>{loading ? "Saving..." : "Save Memory"}</button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
