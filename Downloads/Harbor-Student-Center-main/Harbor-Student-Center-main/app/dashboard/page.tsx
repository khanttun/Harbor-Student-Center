import Link from "next/link";
import Image from "next/image";
import { Bell, CalendarDays, Heart, Images, Pin, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

async function fetchKpis(supabase: Awaited<ReturnType<typeof createClient>>) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const adminClient = createServiceClient(url, key);

  const [events, memories, announcements, appreciation, pinned, adminsResult] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("memories").select("*", { count: "exact", head: true }),
    supabase.from("announcements").select("*", { count: "exact", head: true }),
    supabase.from("kindness_notes").select("*", { count: "exact", head: true }).is("parent_id", null),
    supabase.from("kindness_notes").select("*", { count: "exact", head: true }).eq("is_pinned", true),
    adminClient.auth.admin.listUsers({ perPage: 200 }),
  ]);

  return {
    events: events.count ?? 0,
    memories: memories.count ?? 0,
    announcements: announcements.count ?? 0,
    appreciation: appreciation.count ?? 0,
    pinned: pinned.count ?? 0,
    admins: adminsResult.data?.users?.length ?? 0,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Admin User";

  const kpis = await fetchKpis(supabase).catch(() => ({
    events: 0,
    memories: 0,
    announcements: 0,
    appreciation: 0,
    pinned: 0,
    admins: 0,
  }));

  const kpiCards = [
    {
      label: "Events",
      value: kpis.events,
      unit: kpis.events === 1 ? "event" : "events",
      icon: CalendarDays,
      href: "/dashboard/events",
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Memories",
      value: kpis.memories,
      unit: kpis.memories === 1 ? "memory" : "memories",
      icon: Images,
      href: "/dashboard/memories",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Announcements",
      value: kpis.announcements,
      unit: kpis.announcements === 1 ? "announcement" : "announcements",
      icon: Bell,
      href: "/dashboard/announcements",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Appreciation",
      value: kpis.appreciation,
      unit: kpis.appreciation === 1 ? "message" : "messages",
      icon: Heart,
      href: "/dashboard/appreciation",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Admins",
      value: kpis.admins,
      unit: kpis.admins === 1 ? "account" : "accounts",
      icon: ShieldCheck,
      href: "/dashboard/admins",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const adminSections = [
    {
      href: "/dashboard/events",
      title: "Manage Events",
      description: "Create schedules, update details, and keep student activities fresh.",
      icon: CalendarDays,
      stat: `${kpis.events} total`,
    },
    {
      href: "/dashboard/memories",
      title: "Manage Memories",
      description: "Curate photos and stories to preserve meaningful moments.",
      icon: Images,
      stat: `${kpis.memories} total`,
    },
    {
      href: "/dashboard/announcements",
      title: "Manage Announcements",
      description: "Publish important updates so students never miss key news.",
      icon: Bell,
      stat: `${kpis.announcements} total`,
    },
    {
      href: "/dashboard/appreciation",
      title: "Manage Appreciation",
      description: "Review messages, pin featured notes, and moderate the board.",
      icon: Heart,
      stat: `${kpis.appreciation} messages · ${kpis.pinned} pinned`,
    },
    {
      href: "/dashboard/admins",
      title: "Manage Admins",
      description: "Add or remove admin accounts and reset passwords.",
      icon: ShieldCheck,
      stat: `${kpis.admins} ${kpis.admins === 1 ? "account" : "accounts"}`,
    },
  ];

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 shadow-sm md:px-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Harbor Control Room
              </div>
              <div>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                  Welcome back, {displayName}
                </h1>
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

        {/* KPI cards */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Overview</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                    {card.value}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{card.unit} published</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Admin sections list */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Pin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Admin Sections</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {adminSections.map((section, i) => {
              const Icon = section.icon;
              const isLast = i === adminSections.length - 1;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary/5 ${!isLast ? "border-b border-border" : ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{section.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {section.stat}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
