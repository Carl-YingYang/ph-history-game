'use client';

import { X } from 'lucide-react';
import { codexEntries, CodexCategory } from '@/game/data/codex';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodexPanelProps {
  unlockedIds: Set<string>;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<CodexCategory, string> = {
  characters: 'Characters',
  locations: 'Locations',
  terms: 'Historical Terms',
  booksAndLetters: 'Books & Letters',
  events: 'Events',
  timeline: 'Timeline',
  artifacts: 'Artifacts',
  vocabulary: 'Vocabulary',
};

const CATEGORY_COLORS: Record<CodexCategory, string> = {
  characters: '#FFD60A',
  locations: '#00C853',
  terms: '#2979FF',
  booksAndLetters: '#FF9100',
  events: '#FF6B9D',
  timeline: '#AA00FF',
  artifacts: '#8B4513',
  vocabulary: '#FF3D00',
};

export default function CodexPanel({ unlockedIds, onClose }: CodexPanelProps) {
  const categories = Object.keys(CATEGORY_LABELS) as CodexCategory[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[660px] max-h-[80vh] neo-brutal-card bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black uppercase tracking-wider text-black">
            Rizal Codex
          </h2>
          <Button
            className="h-8 w-8 p-0 bg-[#FF6B9D] text-black font-black rounded-md border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#ff5289]"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[60vh] pr-3">
          {categories.map((cat) => {
            const entries = codexEntries.filter((e) => e.category === cat);
            if (entries.length === 0) return null;
            return (
              <div key={cat} className="mb-5">
                <h3
                  className="text-sm font-black uppercase tracking-wider mb-2 px-2 py-1 rounded-sm border-2 border-black inline-block text-black"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                >
                  {CATEGORY_LABELS[cat]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entries.map((entry) => {
                    const unlocked = unlockedIds.has(entry.id);
                    return (
                      <div
                        key={entry.id}
                        className={`border-2 border-black rounded-lg p-3 transition-all ${
                          unlocked
                            ? 'bg-white shadow-[3px_3px_0_#000]'
                            : 'bg-gray-200 opacity-50 grayscale'
                        }`}
                      >
                        <Badge
                          className={`text-[10px] font-black uppercase border-2 border-black rounded-sm px-1.5 ${
                            entry.kind === 'historical'
                              ? 'bg-[#2979FF] text-black'
                              : 'bg-[#FF9100] text-black'
                          }`}
                        >
                          {entry.kind === 'historical' ? 'HISTORICAL' : 'FICTIONAL'}
                        </Badge>
                        <div className="font-black text-black mt-1 text-sm">
                          {unlocked ? entry.name : '???'}
                        </div>
                        <div className="text-gray-600 mt-1 leading-snug text-xs font-semibold">
                          {unlocked ? entry.summary : 'Not yet discovered.'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    </div>
  );
}
