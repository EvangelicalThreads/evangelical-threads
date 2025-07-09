// /app/api/likes/toggle/route.ts (or your Next.js API file)
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/getAuthSession";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { reflectionId } = await req.json();

  if (!reflectionId) {
    return NextResponse.json({ error: "Missing reflectionId" }, { status: 400 });
  }

  // Check if user already liked this reflection
  const { data: existingLike } = await supabase
    .from("reflection_likes")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("reflection_id", reflectionId)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    await supabase.from("reflection_likes").delete().eq("id", existingLike.id);
  } else {
    // Like
    await supabase.from("reflection_likes").insert({
      user_id: session.user.id,
      reflection_id: reflectionId,
    });
  }

  return NextResponse.json({ liked: !existingLike });
}
