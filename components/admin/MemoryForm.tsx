"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X, Camera } from "lucide-react"; // Camera icon fits "Memories" better

export default function MemoryForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        .from("memory-images")
        .upload(`memories/${Date.now()}-${image.name}`, image);

      if (error) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from("memory-images").getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase
      .from("memories")
      .insert([{ title, date, caption, image_url: imageUrl }]);

    if (error) {
      setMessage("Memory creation failed");
    } else {
      setMessage("Memory saved to the timeline!");
      // Reset form
      setTitle("");
      setDate("");
      setCaption("");
      setImage(null);
      setPreviewUrl(null);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-card p-8 rounded-2xl border border-border shadow-xl">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">Add New Memory</h2>
        <p className="text-sm text-muted-foreground">This will appear on the Timeline Tree.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Memory Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Pizza Night" 
              className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Date</label>
            <input 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              type="date" 
              className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
              required 
            />
          </div>
        </div>

        {/* --- IMAGE UPLOAD AREA --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Upload Photo</label>
          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center w-full h-[156px] border-2 border-dashed border-primary/20 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all group">
              <Camera className="w-8 h-8 text-primary/40 group-hover:text-primary mb-2 transition-colors" />
              <span className="text-xs font-medium text-primary/60">Select Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          ) : (
            <div className="relative h-[156px] rounded-lg overflow-hidden border border-border shadow-inner">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => { setImage(null); setPreviewUrl(null); }}
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
          className="w-full p-3 bg-background border rounded-lg h-24 focus:ring-2 focus:ring-primary outline-none resize-none" 
          required 
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Upload className="animate-bounce w-5 h-5" /> Saving Memory...
          </span>
        ) : "Save to Timeline"}
      </button>

      {message && (
        <div className={`p-4 rounded-lg text-center text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
          message.includes('failed') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-600'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}