import React from "react";

import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <main className="p-8 min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Link href="/admin/events" className="block bg-card rounded-xl p-6 shadow hover:shadow-lg border border-border transition-all">
          <h2 className="text-xl font-semibold mb-2">Manage Events</h2>
          <p className="text-muted-foreground">Create, edit, and delete events.</p>
        </Link>
        <Link href="/admin/memories" className="block bg-card rounded-xl p-6 shadow hover:shadow-lg border border-border transition-all">
          <h2 className="text-xl font-semibold mb-2">Manage Memories</h2>
          <p className="text-muted-foreground">Upload and organize memory photos.</p>
        </Link>
        <Link href="/admin/announcements" className="block bg-card rounded-xl p-6 shadow hover:shadow-lg border border-border transition-all">
          <h2 className="text-xl font-semibold mb-2">Manage Announcements</h2>
          <p className="text-muted-foreground">Post news and updates for students.</p>
        </Link>
      </div>

      <div className="max-w-xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary">
          <Image
            src="/images/katrina-floyd.jpg"
            alt="Katrina Floyd"
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <h3 className="text-2xl font-bold mb-1">Katrina Floyd</h3>
        <p className="text-muted-foreground mb-2">Admin & Coordinator</p>
        <p className="text-center text-base">Welcome to the admin dashboard! Use the cards above to manage events, memories, and announcements. If you need help, contact the website administrators directly.</p>
      </div>
    </main>
  );
}
