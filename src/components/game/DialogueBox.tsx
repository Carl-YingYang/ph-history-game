'use client';

import { Card } from '@/components/ui/card';

interface DialogueBoxProps {
  speaker: string;
  line: string;
}

export default function DialogueBox({ speaker, line }: DialogueBoxProps) {
  if (!line) return null;

  return (
    <Card className="w-full max-w-[760px] mx-auto min-h-[70px] border-2 border-amber-700/60 bg-[#1a1410ee] px-5 py-3 font-['Georgia',serif] text-[#f2e8d5] shadow-lg">
      <div className="text-amber-500 font-bold mb-1 text-sm">{speaker}</div>
      <div className="text-sm leading-relaxed">{line}</div>
    </Card>
  );
}
