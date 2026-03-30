"use client";
export const dynamic = "force-dynamic";
import React from "react";

export default function DashboardAnnouncementsPage() {
  const AnnouncementForm = require("@/components/admin/AnnouncementForm").default;
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Announcements</h1>
      <AnnouncementForm />
    </main>
  );
}
