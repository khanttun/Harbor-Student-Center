"use client";
export const dynamic = "force-dynamic";
import React from "react";

export default function DashboardEventsPage() {
  const EventForm = require("@/components/admin/EventForm").default;
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Events</h1>
      <EventForm />
    </main>
  );
}
