"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "@/components/dashboard/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background lg:flex-row">
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--sidebar-primary)" }}
        >
          Harbor Admin
        </span>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100vw-2rem,18rem)] p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden shrink-0 lg:block">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
