import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  // Local/dev without a secret: allow. Always set CRON_SECRET in production.
  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

async function publishDueContent() {
  const supabase = createAdminSupabaseClient();
  const nowIso = new Date().toISOString();

  const [announcementsResult, eventsResult] = await Promise.all([
    supabase
      .from("announcements")
      .update({ status: "published" })
      .eq("status", "scheduled")
      .lte("scheduled_for", nowIso)
      .select("id"),
    supabase
      .from("events")
      .update({ status: "published" })
      .eq("status", "scheduled")
      .lte("scheduled_for", nowIso)
      .select("id"),
  ]);

  if (announcementsResult.error) {
    throw new Error(`Announcements publish failed: ${announcementsResult.error.message}`);
  }

  if (eventsResult.error) {
    throw new Error(`Events publish failed: ${eventsResult.error.message}`);
  }

  return {
    announcements: announcementsResult.data?.length ?? 0,
    events: eventsResult.data?.length ?? 0,
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const published = await publishDueContent();
    return NextResponse.json({
      ok: true,
      publishedAt: new Date().toISOString(),
      ...published,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("publish-scheduled cron failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
