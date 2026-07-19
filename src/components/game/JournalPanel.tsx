'use client';

import { X, BookOpen } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[660px] max-h-[80vh] neo-brutal-card bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Journal
          </h2>
          <Button
            className="h-8 w-8 p-0 bg-[#FF6B9D] text-black font-black rounded-md border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#ff5289]"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[60vh] pr-3">
          {entries.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500 text-sm font-bold">
                Nothing written yet — explore to fill these pages.
              </p>
            </div>
          )}
          {entries
            .slice()
            .reverse()
            .map((entry, i) => (
              <div
                key={i}
                className="border-2 border-black rounded-lg p-3 mb-2 bg-[#FFF8E7] shadow-[2px_2px_0_#000]"
              >
                <div className="text-xs font-mono text-gray-500 mb-1">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm font-semibold text-black leading-relaxed">
                  {entry.text}
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>
    </div>
  );
}
