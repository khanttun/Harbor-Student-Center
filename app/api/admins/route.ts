import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getAdminSupabaseClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!key || key === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured correctly. " +
      "Get the secret (service_role) key from Supabase Dashboard → Settings → API and add it to .env.local."
    );
  }

  return createServiceClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) return null;
  return data.session;
}

// GET /api/admins — list all admin users
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const admin = getAdminSupabaseClient();
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const users = data.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      display_name: (u.user_metadata?.display_name as string | undefined) ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }));

    return NextResponse.json({ users });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admins — create a new admin user
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const displayName = typeof body.display_name === "string" ? body.display_name.trim() : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const admin = getAdminSupabaseClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      user_metadata: { display_name: displayName || email.split("@")[0] },
      email_confirm: true,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// PUT /api/admins — update display name and/or password
export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const userId = typeof body.id === "string" ? body.id.trim() : "";
    const displayName = typeof body.display_name === "string" ? body.display_name.trim() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!userId) return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    if (password && password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const admin = getAdminSupabaseClient();
    const updates: Record<string, unknown> = {};
    if (displayName) updates.user_metadata = { display_name: displayName };
    if (password) updates.password = password;

    const { error } = await admin.auth.admin.updateUserById(userId, updates);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// DELETE /api/admins — delete an admin user
export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const userId = typeof body.id === "string" ? body.id.trim() : "";

    if (!userId) return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    if (userId === session.user.id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    const admin = getAdminSupabaseClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
