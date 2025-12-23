import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Filter } from "bad-words";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const filter = new Filter();
const whitelist = [
  "god","God","GOD","jesus","Jesus","JESUS","christ","Christ","CHRIST",
  "holy","Holy","HOLY","spirit","Spirit","SPIRIT","faith","Faith","FAITH",
  "lord","Lord","LORD","bible","Bible","BIBLE","pray","Pray","PRAY",
  "amen","Amen","AMEN","angel","Angel","ANGEL","church","Church","CHURCH",
  "peace","Peace","PEACE","love","Love","LOVE",
];
whitelist.forEach(word => filter.removeWords(word));

export async function POST(req: NextRequest) {
  try {
    const { shirtCode, text } = await req.json();
    if (!shirtCode || !text) return NextResponse.json({ error: "Missing shirtCode or text" }, { status: 400 });
    if (text.length > 150) return NextResponse.json({ error: "Reflection text too long (max 150 characters)" }, { status: 400 });

    const cleanText = filter.clean(text);

    const { error } = await supabase.from("reflections").insert([
      { shirt_code: shirtCode, text: cleanText, is_approved: false }
    ]);

    if (error) return NextResponse.json({ error: "Failed to submit reflection" }, { status: 500 });

    return NextResponse.json({ message: "Reflection submitted for approval" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Minimal GET handler that satisfies App Router types
export async function GET() {
  return NextResponse.json({ reflections: [] });
}
