"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      const trimmedDisplayName = displayName.trim();

      if (trimmedDisplayName) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { display_name: trimmedDisplayName },
        });

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative p-4">

      {/* --- TOP LEFT BACK BUTTON --- */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group font-medium"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Back to Home</span>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-2xl shadow-lg border border-border w-full max-w-md flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Harbor Admin</p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Display Name (optional)"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            required
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-center py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center text-muted-foreground text-sm pt-2">
          Contact support if you've forgotten your access.
        </div>
      </form>
    </main>
  );
}