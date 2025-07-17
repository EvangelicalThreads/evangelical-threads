import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseServer";
import type { Session } from "next-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reflectionId = url.searchParams.get("id");

  if (!reflectionId) {
    return NextResponse.json({ liked: false });
  }

  // Explicitly type session as possibly undefined Session
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // User not logged in, so definitely hasn't liked
    return NextResponse.json({ liked: false });
  }

  const { data: existingLike, error } = await supabaseAdmin
    .from("reflection_likes")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("reflection_id", reflectionId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ liked: false });
  }

  return NextResponse.json({ liked: !!existingLike });
}
