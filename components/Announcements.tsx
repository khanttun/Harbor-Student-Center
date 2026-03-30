"use client";

import React from "react";
import { Megaphone, CalendarHeart, ChefHat } from "lucide-react";

const announcement = {
  id: "1",
  title: "The Harbor Opens This Tuesday",
  content: "Come by anytime between 3PM and 7PM. Everyone is welcome!",
};

export function Announcements() {
  // No backend, just static data
  const loading = false;
  const error = null;

  return (
    <section className="p-6 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-900/30 dark:text-blue-400">
          <Megaphone className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Latest Announcements</h2>
      </div>

      <div className="space-y-4">
        {error && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{error}</p>
        )}

        {announcement && (
          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 mb-4">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 mb-2">
              {announcement.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {announcement.content}
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-5 bg-orange-50 border border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-400">
              <ChefHat className="w-5 h-5" />
              <h3 className="font-bold">Saturday Feast</h3>
            </div>
            <p className="text-orange-800 dark:text-orange-200 text-sm">
              Join us this Saturday for a delicious feast featuring Pizza and Fried Rice!
              Make sure you check your schedule and don&apos;t miss out on the incredible food.
            </p>
          </div>

          <div className="p-5 bg-amber-50 border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
              <CalendarHeart className="w-5 h-5" />
              <h3 className="font-bold">Post-Exam Treat</h3>
            </div>
            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium mb-1 relative z-10">
              🎉 Special Highlight: 150 Fried Chickens!
            </p>
            <p className="text-amber-700/80 dark:text-amber-300/80 text-sm relative z-10">
              Celebrate the end of exams with an ultimate treat! Brought to you by the Harbor Student Center.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
