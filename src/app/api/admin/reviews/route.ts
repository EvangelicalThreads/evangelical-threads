import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Reviews auto-publish now, so this lists everything (not just pending) —
// it's a management view for deleting anything unwanted, not an approval
// queue.
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, product_id, name, email, rating, text, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews: data });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
