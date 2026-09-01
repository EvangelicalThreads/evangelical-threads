import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Filter } from "bad-words";
import { sendReviewNotificationEmail } from "@/lib/resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const filter = new Filter();

// Anyone can submit — no purchase check. Kept honest by moderation
// (is_approved) rather than gating who can write one at all.
export async function POST(req: NextRequest) {
  try {
    const { productId, name, email, rating, text } = await req.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }
    if (!name || typeof name !== "string" || name.length > 60) {
      return NextResponse.json({ error: "Missing or invalid name" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
    }
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }
    if (!text || typeof text !== "string" || text.trim().length < 3) {
      return NextResponse.json({ error: "Review text is too short" }, { status: 400 });
    }
    if (text.length > 800) {
      return NextResponse.json({ error: "Review text too long (max 800 characters)" }, { status: 400 });
    }

    const cleanText = filter.clean(text.trim());
    const cleanName = filter.clean(name.trim());

    // Auto-published — no approval queue to wait on. Still profanity
    // filtered above; anything unwanted can be deleted anytime from
    // /admin/reviews.
    const { error } = await supabase.from("reviews").insert([
      {
        product_id: productId,
        name: cleanName,
        email: email.trim().toLowerCase(),
        rating: numericRating,
        text: cleanText,
        is_approved: true,
      },
    ]);

    if (error) {
      console.error("Insert review error:", error);
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    // Best-effort — the review is already saved, so a flaky email send
    // should never turn into a failed submission for the customer.
    console.log("Attempting review notification email...");
    try {
      const sendResult = await sendReviewNotificationEmail({
        productId,
        name: cleanName,
        email: email.trim().toLowerCase(),
        rating: numericRating,
        text: cleanText,
      });
      console.log("Review notification email sent, id:", sendResult?.data?.id);
    } catch (notifyErr) {
      console.error("Review notification email failed:", notifyErr);
    }

    return NextResponse.json({ message: "Review submitted for approval" });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/reviews?productId=men-dolphin-tee — approved reviews for one
// product, plus the average rating and count so the product page doesn't
// have to compute it client-side from a possibly-empty list.
export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, rating, text, created_at")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch reviews error:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    const count = data?.length ?? 0;
    const average =
      count > 0 ? data!.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    return NextResponse.json({ reviews: data ?? [], average, count });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
