import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      console.log('Missing values:', { token, email, newPassword });
      return NextResponse.json(
        { error: 'Missing token, email or newPassword' },
        { status: 400 }
      );
    }

    // Verify the token exists and is valid
    const { data: tokenRow, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !tokenRow) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('email', email)
      .eq('token', token);

    return NextResponse.json({ message: 'Password updated successfully!' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
