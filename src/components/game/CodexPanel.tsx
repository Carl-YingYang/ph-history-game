'use client';

import { X } from 'lucide-react';
import { codexEntries, CodexCategory } from '@/game/data/codex';
import { Card, CardContent } from '@/components/ui/card';
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

export default function CodexPanel({ unlockedIds, onClose }: CodexPanelProps) {
  const categories = Object.keys(CATEGORY_LABELS) as CodexCategory[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[640px] max-h-[70vh] rounded-xl border-2 border-amber-700/60 bg-[#1a1410] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Georgia',serif] text-xl text-amber-500">Rizal Codex</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[55vh] pr-3">
          {categories.map((cat) => {
            const entries = codexEntries.filter((e) => e.category === cat);
            if (entries.length === 0) return null;
            return (
              <div key={cat} className="mb-4">
                <h3 className="text-sm font-bold text-amber-600 mb-2">{CATEGORY_LABELS[cat]}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entries.map((entry) => {
                    const unlocked = unlockedIds.has(entry.id);
                    return (
                      <Card
                        key={entry.id}
                        className={`border border-amber-900/30 bg-[#241c14] transition-opacity ${
                          unlocked ? '' : 'opacity-35 grayscale'
                        }`}
                      >
                        <CardContent className="p-3 text-xs">
                          <Badge
                            variant="outline"
                            className={`text-[10px] mb-1 ${
                              entry.kind === 'historical'
                                ? 'border-sky-600 text-sky-400'
                                : 'border-amber-600 text-amber-400'
                            }`}
                          >
                            {entry.kind === 'historical' ? 'HISTORICAL' : 'FICTIONAL'}
                          </Badge>
                          <div className="font-bold text-[#f2e8d5] mt-1">
                            {unlocked ? entry.name : '???'}
                          </div>
                          <div className="text-gray-400 mt-1 leading-snug">
                            {unlocked ? entry.summary : 'Not yet discovered.'}
                          </div>
                        </CardContent>
                      </Card>
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
