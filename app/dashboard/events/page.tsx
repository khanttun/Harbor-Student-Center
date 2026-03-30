"use client";
import React from "react";
import EventForm from "@/components/admin/EventForm";

export default function DashboardEventsPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Events</h1>
      <EventForm />
    </main>
  );
}
