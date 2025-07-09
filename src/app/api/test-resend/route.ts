import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'FOUND' : 'MISSING');

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY env var' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const response = await resend.emails.send({
      from: 'no-reply@evangelicalthreads.com',
      to: 'katie.pg32@gmail.com',
      subject: 'Test Email from Resend',
      html: '<p>If you get this, Resend email sending works!</p>',
    });

    console.log('Email sent:', response);

    return NextResponse.json({ message: 'Test email sent', response });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
  }
}
