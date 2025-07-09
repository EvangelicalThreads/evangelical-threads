// /app/api/likes/status/route.ts
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/getAuthSession";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const session = await getAuthSession();

  const url = new URL(req.url);
  const reflectionId = url.searchParams.get("id");

  if (!reflectionId) {
    return NextResponse.json({ error: "Missing reflection ID" }, { status: 400 });
  }

  if (!session?.user?.id) {
    // Not authenticated = user hasn't liked
    return NextResponse.json({ liked: false });
  }

  const { data: existingLike, error } = await supabase
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
