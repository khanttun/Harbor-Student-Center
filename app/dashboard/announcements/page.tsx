"use client";
import React from "react";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default function DashboardAnnouncementsPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Announcements</h1>
      <AnnouncementForm />
    </main>
  );
}
