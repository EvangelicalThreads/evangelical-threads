// src/app/api/comments/add/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reflectionId, comment } = await req.json();

    if (!reflectionId || !comment?.trim()) {
      return NextResponse.json({ error: "Missing reflectionId or comment" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("reflection_comments")
      .insert({
        reflection_id: reflectionId,
        user_id: session.user.id,
        comment: comment.trim(),
      });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
