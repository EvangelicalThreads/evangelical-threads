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

    // Check if user exists (maybeSingle avoids error if multiple or none)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.log('ℹ️ User query error (safe ignore):', userError.message);
      // Don't leak errors, respond with generic message
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent.',
      });
    }

    if (!user) {
      console.log('ℹ️ User not found for email:', email);
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent.',
      });
    }

    // Generate reset token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to database
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

    // Construct reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    // Send reset email via Resend
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
  } catch (error: any) {
    console.error('Reset password error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
