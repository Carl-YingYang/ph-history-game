'use client';

import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JournalEntry {
  text: string;
  timestamp: number;
}

interface JournalPanelProps {
  entries: JournalEntry[];
  onClose: () => void;
}

export default function JournalPanel({ entries, onClose }: JournalPanelProps) {
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
          <h2 className="font-['Georgia',serif] text-xl text-amber-500">Journal</h2>
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
          {entries.length === 0 && (
            <p className="text-gray-500 text-sm">Nothing written yet — explore to fill these pages.</p>
          )}
          {entries
            .slice()
            .reverse()
            .map((entry, i) => (
              <Card key={i} className="border-b border-amber-900/20 bg-transparent rounded-none shadow-none">
                <CardContent className="p-3 text-sm text-[#f2e8d5]/80 leading-relaxed">
                  {entry.text}
                </CardContent>
              </Card>
            ))}
        </ScrollArea>
      </div>
    </div>
  );
}
