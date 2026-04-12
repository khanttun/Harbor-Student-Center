import Link from "next/link";
import Image from "next/image";
import { Bell, CalendarDays, Images, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Admin User";

  const dashboardCards = [
    {
      href: "/dashboard/events",
      title: "Manage Events",
      description: "Create schedules, update details, and keep student activities fresh.",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/memories",
      title: "Manage Memories",
      description: "Curate photos and stories to preserve meaningful moments.",
      icon: Images,
    },
    {
      href: "/dashboard/announcements",
      title: "Manage Announcements",
      description: "Publish important updates so students never miss key news.",
      icon: Bell,
    },
  ];

  return (
    <main className="min-h-full bg-background p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 shadow-sm md:px-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Harbor Control Room
              </div>
              <div>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">Welcome back, {displayName}</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Oversee events, memories, and announcements from one place. Keep this week vibrant for everyone at Harbor.
                </p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-xs rounded-2xl border border-border/80 bg-background/80 p-5 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/40">
                  <Image
                    src="/images/katrina-floyd.jpg"
                    alt={displayName}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">Admin Coordinator</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Events</p>
            <p className="mt-2 text-2xl font-bold">Organize</p>
            <p className="mt-1 text-sm text-muted-foreground">Create and update weekly activities.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Memories</p>
            <p className="mt-2 text-2xl font-bold">Preserve</p>
            <p className="mt-1 text-sm text-muted-foreground">Showcase moments that matter most.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Announcements</p>
            <p className="mt-2 text-2xl font-bold">Inform</p>
            <p className="mt-1 text-sm text-muted-foreground">Share updates and urgent notices fast.</p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold md:text-xl">Management Shortcuts</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-semibold">{card.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
