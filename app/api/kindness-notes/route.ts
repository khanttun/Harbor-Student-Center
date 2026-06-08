import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentName = typeof body.studentName === "string" ? body.studentName.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!studentName || !message) {
      return NextResponse.json({ error: "Student name and message are required." }, { status: 400 });
    }

    if (studentName.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const supabase = await createClient();
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
