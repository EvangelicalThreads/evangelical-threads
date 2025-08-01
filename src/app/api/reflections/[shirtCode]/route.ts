import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Filter } from "bad-words";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const filter = new Filter();

interface ContextWithParams {
  params: {
    shirtCode: string;
  };
}

// Async type guard to check if context has awaited params with shirtCode string
async function isContextWithParams(obj: unknown): Promise<boolean> {
  if (
    typeof obj === "object" &&
    obj !== null &&
    "params" in obj
  ) {
    // Await params because in Next.js 13+ params may be a Promise
    const params = await (obj as any).params;
    return (
      typeof params === "object" &&
      params !== null &&
      typeof (params as any).shirtCode === "string"
    );
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { shirtCode, text } = await req.json();

    if (!shirtCode || !text) {
      return NextResponse.json(
        { error: "Missing shirtCode or text" },
        { status: 400 }
      );
    }

    if (text.length > 150) {
      return NextResponse.json(
        { error: "Reflection text too long (max 150 characters)" },
        { status: 400 }
      );
    }

    const cleanText = filter.clean(text);

    const { error } = await supabase.from("reflections").insert([
      {
        shirt_code: shirtCode,
        text: cleanText,
        is_approved: false,
      },
    ]);

    if (error) {
      console.error("Insert reflection error:", error);
      return NextResponse.json(
        { error: "Failed to submit reflection" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Reflection submitted for approval" });
  } catch (err) {
    console.error("POST /api/reflections error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: unknown) {
  try {
    if (!(await isContextWithParams(context))) {
      return NextResponse.json(
        { error: "Missing or invalid shirtCode parameter" },
        { status: 400 }
      );
    }

    // Await context.params here because it may be a Promise
    const params = await (context as any).params;
    const shirtCode = params.shirtCode;

    const { data, error } = await supabase
      .from("reflections")
      .select("id, text, created_at")
      .eq("shirt_code", shirtCode)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch reflections error:", error);
      return NextResponse.json(
        { error: "Failed to fetch reflections" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reflections: data });
  } catch (err) {
    console.error("GET /api/reflections error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
