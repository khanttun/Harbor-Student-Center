"use client";
export const dynamic = "force-dynamic";
import EventForm from "@/components/admin/EventForm";

export default function DashboardEventsPage() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8">
      <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">Manage Events</h1>
      <EventForm />
    </main>
  );
}
