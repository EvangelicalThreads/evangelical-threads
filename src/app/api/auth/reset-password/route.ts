import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      console.log('No email provided in request');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log(`🔐 Reset password requested for: ${email}`);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.log('ℹ️ User query error (safe to ignore):', userError.message);
      // Intentionally not revealing existence of user for security
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent.',
      });
    }

    if (!user) {
      console.log('ℹ️ User not found for email:', email);
      // Same message regardless of user existence
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    const { error: insertError } = await supabase.from('password_reset_tokens').insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
      used: false,
    });

    if (insertError) {
      console.error('Error saving token:', insertError.message);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      await resend.emails.send({
        from: 'no-reply@evangelicalthreads.com',
        to: email,
        subject: 'Reset your password',
        html: `
          <p>Hi,</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
      console.log('✅ Reset email sent to:', email);
    } catch (sendError) {
      console.error('Error sending reset email:', sendError);
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Reset password error:', error.message);
    } else {
      console.error('Reset password unknown error:', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
