'use client';

import { Medal, BookOpen, ScrollText } from 'lucide-react';
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
    <div className="w-full max-w-[800px] mx-auto flex items-center justify-between gap-3 neo-brutal-yellow px-4 py-2.5 text-sm font-bold">
      <div className="flex items-center gap-2">
        <Medal className="h-5 w-5" />
        <span className="text-black">{medalCount} Medals</span>
      </div>

      <div className="text-xs font-mono uppercase tracking-wider">
        {currentChapter ? `Ch. ${currentChapter}` : ''}
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-[220px]">
        <span className="bg-black text-[#FFD60A] px-2 py-0.5 rounded text-xs font-black uppercase">
          {rank}
        </span>
        <span className="text-xs font-mono">{knowledgeXp} XP</span>
        <div className="flex-1 h-4 border-2 border-black rounded-sm bg-[#FFF8E7] overflow-hidden">
          <div
            className="h-full bg-[#00C853] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 bg-black text-[#FFD60A] font-bold rounded-md border-2 border-black hover:bg-[#333] hover:text-[#FFD60A] shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          onClick={onOpenJournal}
        >
          <ScrollText className="h-4 w-4 mr-1" />
          Journal
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 bg-[#FF6B9D] text-black font-bold rounded-md border-2 border-black hover:bg-[#ff5289] hover:text-black shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          onClick={onOpenCodex}
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Codex
        </Button>
      </div>
    </div>
  );
}
