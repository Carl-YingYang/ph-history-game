import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/progress/codex — Unlock a codex entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codexEntryId, slot = 1, userId = 'demo-user' } = body;

    const user = await db.user.findUnique({ where: { username: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const saveSlot = await db.saveSlot.findUnique({
      where: { userId_slotNumber: { userId: user.id, slotNumber: slot } },
    });
    if (!saveSlot) {
      return NextResponse.json({ error: 'Save slot not found' }, { status: 404 });
    }

    const entry = await db.codexProgress.upsert({
      where: {
        saveSlotId_codexEntryId: { saveSlotId: saveSlot.id, codexEntryId },
      },
      update: {},
      create: {
        saveSlotId: saveSlot.id,
        codexEntryId,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('[codex] Error:', error);
    return NextResponse.json({ error: 'Failed to unlock codex entry' }, { status: 500 });
  }
}
