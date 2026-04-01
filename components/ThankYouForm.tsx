"use client";

import React, { useState } from "react";
// Passcode answer (case-insensitive, can be changed as needed)
const PET_NAME = "mocha";
import { Heart, Send, CheckCircle2 } from "lucide-react";

// You can override this URL via environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function ThankYouForm() {
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Handles the actual note submission (after passcode is validated)
  const doSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setIsSuccess(false);
    try {
      const response = await fetch(`${API_URL}/api/thanks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, message }),
      });
      if (!response.ok) throw new Error("Failed to submit your note");
      setIsSuccess(true);
      setStudentName("");
      setMessage("");
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Intercept submit to show passcode modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscode("");
    setPasscodeError("");
    setShowPasscode(true);
  };

  // Passcode check and submit
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === PET_NAME) {
      setShowPasscode(false);
      setPasscode("");
      setPasscodeError("");
      doSubmit();
    } else {
      setPasscodeError("Incorrect. Please try again.");
    }
  };

  return (
    <section className="p-6 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-rose-50 dark:bg-rose-500/10 w-32 h-32 rounded-bl-full pointer-events-none -z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl dark:bg-rose-900/30 dark:text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Drop a Note of Thanks</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Student Name
            </label>
            <input
              id="studentName"
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your note of appreciation..."
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all dark:text-zinc-100 placeholder:text-zinc-400 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm pt-1">{error}</p>
          )}

          {isSuccess && (
            <div className="flex items-start sm:items-center gap-2 p-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
              <p>Thank you! Your note is now on the Anchor of Thanks board.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
          >
            {isSubmitting ? "Sending..." : "Submit Note"}
            {!isSubmitting && <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
          </button>
          {/* Passcode Modal */}
          {showPasscode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-full max-w-xs border border-zinc-200 dark:border-zinc-800 relative">
                <h3 className="text-lg font-bold mb-2">Community Passcode</h3>
                <p className="text-sm mb-4">What is the name of Sayarma Katrina and Sayar Floyd's pet?</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-rose-500 outline-none dark:bg-zinc-800"
                    placeholder="Pet's name"
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') { handlePasscodeSubmit(e); } }}
                  />
                  {passcodeError && <p className="text-red-500 text-xs">{passcodeError}</p>}
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowPasscode(false)} className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">Cancel</button>
                    <button type="button" onClick={handlePasscodeSubmit} className="px-3 py-1 rounded bg-primary text-primary-foreground font-semibold">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
