"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X, Image as ImageIcon } from "lucide-react"; // Icons for visibility

export default function EventForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For the preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle image selection and create a preview URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
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
    
    let imageUrl = "";
    if (image) {
      const { data, error } = await supabase.storage
        .from("event-images")
        .upload(`events/${Date.now()}-${image.name}`, image);
      
      if (error) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from("event-images").getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase
      .from("events")
      .insert([{ title, date, description, image_url: imageUrl }]);
    
    if (error) {
      setMessage("Event creation failed");
    } else {
      setMessage("Event created successfully!");
      // Reset form
      setTitle("");
      setDate("");
      setDescription("");
      setImage(null);
      setPreviewUrl(null);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
        <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-3 bg-background border rounded-lg h-32 focus:ring-2 focus:ring-primary outline-none" required />
      </div>

      {/* --- HIGH VISIBILITY UPLOAD SECTION --- */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Event Cover Image</label>
        
        {!previewUrl ? (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/5 hover:bg-muted/10 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
            <button 
              type="button" 
              onClick={() => { setImage(null); setPreviewUrl(null); }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        disabled={loading}
      >
        {loading ? "Creating Event..." : "Save Event"}
      </button>

      {message && (
        <p className={`text-center text-sm font-medium p-2 rounded ${message.includes('failed') ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>
          {message}
        </p>
      )}
    </form>
  );
}