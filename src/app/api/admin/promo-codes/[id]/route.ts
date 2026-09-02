import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Toggle active/inactive — the simplest way to "turn off" a code without
// losing its usage history, which straight deleting would.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { active } = await req.json();

    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Missing active (boolean)' }, { status: 400 });
    }

    const updated = await prisma.promo_codes.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json({ code: updated });
  } catch (err) {
    console.error('PATCH /api/admin/promo-codes/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.promo_codes.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/promo-codes/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
