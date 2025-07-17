import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabase.from('reflections').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Server error in delete:', err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error('Unknown server error in delete:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
}
