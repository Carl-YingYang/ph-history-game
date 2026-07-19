'use client';

import { Medal, BookOpen, ScrollText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface HUDProps {
  knowledgeXp: number;
  rank: string;
  medalCount: number;
  currentChapter: string;
  onOpenJournal: () => void;
  onOpenCodex: () => void;
}

export default function HUD({
  knowledgeXp,
  rank,
  medalCount,
  currentChapter,
  onOpenJournal,
  onOpenCodex,
}: HUDProps) {
  const xpForNextRank = 500;
  const pct = Math.min(100, ((knowledgeXp % xpForNextRank) / xpForNextRank) * 100);

  return (
    <div className="w-full max-w-[800px] mx-auto flex items-center justify-between gap-3 rounded-lg border border-amber-700/50 bg-[#1a1410ee] px-4 py-2 font-['Georgia',serif] text-sm text-[#f2e8d5]">
      <div className="flex items-center gap-2">
        <Medal className="h-4 w-4 text-amber-500" />
        <span>{medalCount} Medals</span>
      </div>

      <div className="text-xs text-gray-500">
        {currentChapter ? `Ch. ${currentChapter}` : ''}
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-[220px]">
        <span className="text-amber-400 font-semibold">{rank}</span>
        <span className="text-xs text-gray-400">{knowledgeXp} XP</span>
        <Progress value={pct} className="h-2 flex-1 bg-[#3a3222] [&>[data-slot=indicator]]:bg-amber-600" />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
          onClick={onOpenJournal}
        >
          <ScrollText className="h-4 w-4 mr-1" />
          Journal
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
          onClick={onOpenCodex}
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Codex
        </Button>
      </div>
    </div>
  );
}
