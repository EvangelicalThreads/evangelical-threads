import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    console.log('🗑️ Received delete request for ID:', id); // ✅ Log request

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabase.from('reflections').delete().eq('id', id);

    if (error) {
      console.error('❌ Supabase delete error:', error.message); // ✅ Log any DB error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Successfully deleted reflection with ID:', id); // ✅ Confirm deletion
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('❌ Server error in delete:', err.message); // ✅ Log unknown server error
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
