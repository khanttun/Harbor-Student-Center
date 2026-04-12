"use client";
export const dynamic = "force-dynamic";
import React from "react";
import MemoryForm from "@/components/admin/MemoryForm";

export default function DashboardMemoriesPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Memories</h1>
      <MemoryForm />
    </main>
  );
}
