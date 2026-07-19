import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/progress/journal — Append a journal entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapterId, text, slot = 1, userId = 'demo-user' } = body;

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

    const entry = await db.journalEntry.create({
      data: {
        saveSlotId: saveSlot.id,
        chapterId,
        text,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('[journal] Error:', error);
    return NextResponse.json({ error: 'Failed to append journal entry' }, { status: 500 });
  }
}
