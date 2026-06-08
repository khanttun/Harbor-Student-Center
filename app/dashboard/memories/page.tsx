"use client";
export const dynamic = "force-dynamic";
import React from "react";
import MemoryForm from "@/components/admin/MemoryForm";

export default function DashboardMemoriesPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Memories</h1>
      <MemoryForm />
    </main>
  );
}
