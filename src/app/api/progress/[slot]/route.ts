import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/progress/[slot] — Save progress
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  try {
    const { slot } = await params;
    const slotNumber = parseInt(slot, 10);
    const body = await request.json();

    const { currentChapterId, knowledgeXp, medalCount, playtimeSeconds, userId = 'demo-user' } = body;

    // Ensure user exists
    let user = await db.user.findUnique({ where: { username: userId } });
    if (!user) {
      user = await db.user.create({
        data: { username: userId, passwordHash: 'demo' },
      });
    }

    // Upsert save slot
    const saveSlot = await db.saveSlot.upsert({
      where: {
        userId_slotNumber: { userId: user.id, slotNumber },
      },
      update: {
        currentChapterId: currentChapterId ?? undefined,
        knowledgeXp: knowledgeXp ?? undefined,
        medalCount: medalCount ?? undefined,
        playtimeSeconds: playtimeSeconds ?? undefined,
      },
      create: {
        userId: user.id,
        slotNumber,
        currentChapterId: currentChapterId ?? 'prologue',
        knowledgeXp: knowledgeXp ?? 0,
        medalCount: medalCount ?? 0,
        playtimeSeconds: playtimeSeconds ?? 0,
      },
    });

    return NextResponse.json({ save: saveSlot });
  } catch (error) {
    console.error('[save] Error:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

// GET /api/progress/[slot] — Load progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  try {
    const { slot } = await params;
    const slotNumber = parseInt(slot, 10);
    const userId = 'demo-user';

    const user = await db.user.findUnique({ where: { username: userId } });
    if (!user) {
      return NextResponse.json({ save: null });
    }

    const saveSlot = await db.saveSlot.findUnique({
      where: {
        userId_slotNumber: { userId: user.id, slotNumber },
      },
    });

    return NextResponse.json({ save: saveSlot });
  } catch (error) {
    console.error('[load] Error:', error);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}
