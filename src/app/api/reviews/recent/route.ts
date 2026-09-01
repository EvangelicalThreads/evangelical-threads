import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Most recent approved reviews across every product — for the homepage
// "In Their Words" section. Separate from /api/reviews (which is scoped
// to one product's page) since this pulls across all of them.
export async function GET(req: NextRequest) {
  try {
    const limitParam = Number(req.nextUrl.searchParams.get("limit"));
    const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 12) : 6;

    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, rating, text, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Fetch recent reviews error:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json({ reviews: data ?? [] });
  } catch (err) {
    console.error("GET /api/reviews/recent error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
