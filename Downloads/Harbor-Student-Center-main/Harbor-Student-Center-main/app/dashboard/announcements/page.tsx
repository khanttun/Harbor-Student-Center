"use client";
export const dynamic = "force-dynamic";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default function DashboardAnnouncementsPage() {
  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Announcements</h1>
      <AnnouncementForm />
    </main>
  );
}
