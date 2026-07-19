'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  footnote: string;
}

interface QuizModalProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export default function QuizModal({ questions, onComplete }: QuizModalProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[index];
  const isLast = index === questions.length - 1;

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
  }

  function next() {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex(index + 1);
    setSelected(null);
  }

  const isCorrect = selected === q.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-[600px] neo-brutal-card bg-white">
        <div className="mb-3">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Journal Recap
          </h2>
          <p className="text-sm font-bold text-gray-600">How much do you remember?</p>
          <Badge className="mt-2 bg-[#FFD60A] text-black border-2 border-black rounded-sm font-black uppercase text-xs">
            Question {index + 1} of {questions.length}
          </Badge>
        </div>

        <div className="space-y-3">
          <p className="text-base font-bold text-black">{q.question}</p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let buttonClass = 'w-full text-left justify-start border-2 border-black bg-[#FFF8E7] text-black font-bold hover:bg-[#FFD60A] shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none';

              if (selected !== null) {
                if (i === q.correctIndex) {
                  buttonClass = 'w-full text-left justify-start border-3 border-black bg-[#00C853] text-black font-bold shadow-[2px_2px_0_#000]';
                } else if (i === selected && i !== q.correctIndex) {
                  buttonClass = 'w-full text-left justify-start border-3 border-black bg-[#FF3D00] text-white font-bold shadow-[2px_2px_0_#000]';
                } else {
                  buttonClass = 'w-full text-left justify-start border-2 border-gray-300 bg-gray-100 text-gray-400 font-bold';
                }
              }

              return (
                <button
                  key={i}
                  className={buttonClass + ' rounded-lg px-4 py-2.5 text-sm transition-all'}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                >
                  <span className="flex items-center gap-2">
                    {selected !== null && i === q.correctIndex && (
                      <CheckCircle2 className="h-5 w-5 text-black shrink-0" />
                    )}
                    {selected !== null && i === selected && i !== q.correctIndex && (
                      <XCircle className="h-5 w-5 text-white shrink-0" />
                    )}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-3 rounded-lg bg-[#FFD60A] border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <p className="text-sm font-black text-black mb-1">
                {isCorrect ? 'CORRECT!' : 'Not quite.'} Here&apos;s what actually happened:
              </p>
              <p className="text-xs font-semibold text-black/80 leading-relaxed">{q.footnote}</p>
            </div>
          )}

          {selected !== null && (
            <Button
              onClick={next}
              className="w-full mt-2 bg-[#00C853] text-black font-black uppercase rounded-lg border-2 border-black shadow-[3px_3px_0_#000] hover:bg-[#00b848] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-sm"
            >
              {isLast ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
