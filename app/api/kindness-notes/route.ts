import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

async function requireAdminSession(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data?.session) {
    return null;
  }

  return data.session;
}

function getAdminSupabaseClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!serviceRoleKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY not configured. Admin operations may fail.");
  }

  return createServiceClient(supabaseUrl, serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
}

async function handleTogglePinned(request: Request) {
  try {
    const body = await request.json();
    const noteId = typeof body.id === "string" ? body.id.trim() : "";

    if (!noteId) {
      return NextResponse.json({ error: "Missing note ID" }, { status: 400 });
    }

    // Verify admin session
    const supabase = await createClient();
    const session = await requireAdminSession(supabase);

    if (!session) {
      return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
    }

    // Use admin client for database operations to bypass RLS
    const adminSupabase = getAdminSupabaseClient();

    // 1. Fetch current note status
    const { data: note, error: fetchError } = await adminSupabase
      .from("kindness_notes")
      .select("is_pinned")
      .eq("id", noteId)
      .single();

    if (fetchError || !note) {
      console.error("Failed to fetch note:", fetchError?.message || "Note not found");
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    // 2. Toggle the pinned state
    const nextPinnedState = !note.is_pinned;

    // 3. Update the database row
    const { error: updateError } = await adminSupabase
      .from("kindness_notes")
      .update({ is_pinned: nextPinnedState })
      .eq("id", noteId);

    if (updateError) {
      console.error("Failed to update pinned status:", updateError.message);
      return NextResponse.json({ error: "Failed to update pinned status." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: noteId, is_pinned: nextPinnedState });
  } catch (err: any) {
    console.error("Error in handleTogglePinned:", err.message);
    return NextResponse.json({ error: err.message || "Invalid request." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentName = typeof body.studentName === "string" ? body.studentName.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const parentId = typeof body.parent_id === "string" ? body.parent_id.trim() : null;

    const supabase = await createClient();

    if (parentId) {
      const session = await requireAdminSession(supabase);

      if (!session) {
        return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
      }

      if (!message) {
        return NextResponse.json({ error: "Message is required for replies." }, { status: 400 });
      }

      const { data: parentNote, error: parentError } = await supabase
        .from("kindness_notes")
        .select("id")
        .eq("id", parentId)
        .single();

      if (parentError || !parentNote) {
        return NextResponse.json({ error: "Parent note not found." }, { status: 404 });
      }

      const { error } = await supabase.from("kindness_notes").insert([
        {
          student_name: "Admin",
          message,
          parent_id: parentId,
          ip_address: null,
        },
      ]);

      if (error) {
        console.error("Failed to submit admin reply:", error.message);
        return NextResponse.json({ error: "Failed to submit admin reply." }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (!studentName || !message) {
      return NextResponse.json({ error: "Student name and message are required." }, { status: 400 });
    }

    if (studentName.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const ipAddress = getClientIp(request);

    let { error } = await supabase.from("kindness_notes").insert([
      {
        student_name: studentName,
        message,
        ip_address: ipAddress,
      },
    ]);

    // Fallback when the table exists but ip_address column hasn't been added yet.
    if (error?.message.includes("ip_address")) {
      ({ error } = await supabase.from("kindness_notes").insert([
        { student_name: studentName, message },
      ]));
    }

    if (error) {
      console.error("Failed to submit kindness note:", error.message);

      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json(
          { error: "The messages database is not set up yet. Please contact an administrator." },
          { status: 500 },
        );
      }

      if (error.message.toLowerCase().includes("row-level security")) {
        return NextResponse.json(
          { error: "Unable to save your note right now. Please try again later." },
          { status: 500 },
        );
      }

      return NextResponse.json({ error: "Failed to submit note." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  return handleTogglePinned(request);
}

export async function PATCH(request: Request) {
  return handleTogglePinned(request);
}
