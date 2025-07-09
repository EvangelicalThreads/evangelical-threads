import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    // Upsert user by email, always set emailOptIn: true
    await prisma.user.upsert({
      where: { email },
      update: { emailOptIn: true },
      create: {
        email,
        password: 'placeholder', // Required field workaround — won’t be used
        name: '',
        emailOptIn: true,
      },
    });

    await sendWelcomeEmail(email, '');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
