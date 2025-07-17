import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { getAuthSession } from "@/lib/getAuthSession";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { reflectionId } = await request.json();
  const userId = session.user.id;

  const { data: existingLike, error: fetchError } = await supabaseAdmin
    .from("reflection_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("reflection_id", reflectionId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: "Could not fetch like" }, { status: 500 });
  }

  if (existingLike) {
    const { error: deleteError } = await supabaseAdmin
      .from("reflection_likes")
      .delete()
      .eq("id", existingLike.id);

    if (deleteError) {
      return NextResponse.json({ error: "Could not remove like" }, { status: 500 });
    }

    return NextResponse.json({ liked: false });
  } else {
    const { error: insertError } = await supabaseAdmin
      .from("reflection_likes")
      .insert({ user_id: userId, reflection_id: reflectionId });

    if (insertError) {
      return NextResponse.json({ error: "Could not add like" }, { status: 500 });
    }

    return NextResponse.json({ liked: true });
  }
}
