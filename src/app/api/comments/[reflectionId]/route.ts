// src/app/api/comments/[reflectionId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ reflectionId: string }> }
) {
  const params = await context.params;
  const { reflectionId } = params;

  const { data, error } = await supabaseAdmin
    .from("reflection_comments")
    .select("*")
    .eq("reflection_id", reflectionId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch comments" },
      { status: 500 }
    );
  }

  return NextResponse.json({ comments: data });
}
