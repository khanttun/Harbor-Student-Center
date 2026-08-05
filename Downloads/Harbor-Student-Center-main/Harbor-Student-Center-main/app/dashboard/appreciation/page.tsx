"use client";
export const dynamic = "force-dynamic";
import KindnessNotesForm from "@/components/admin/KindnessNotesForm";

export default function DashboardAppreciationPage() {
  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Appreciation Messages</h1>
      <KindnessNotesForm />
    </main>
  );
}
