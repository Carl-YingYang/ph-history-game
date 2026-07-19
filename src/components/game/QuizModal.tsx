'use client';

import { useState } from 'react';
import { X, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Card className="w-full max-w-[600px] border-2 border-amber-700/60 bg-[#1a1410] shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="font-['Georgia',serif] text-lg text-amber-500">
            Journal Recap — how much do you remember?
          </CardTitle>
          <Badge variant="outline" className="w-fit text-amber-400 border-amber-700">
            Question {index + 1} of {questions.length}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-[#f2e8d5] font-medium">{q.question}</p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let buttonClass = 'w-full text-left justify-start border border-amber-900/40 bg-[#241c14] text-[#f2e8d5] hover:border-amber-600 hover:bg-amber-900/20';

              if (selected !== null) {
                if (i === q.correctIndex) {
                  buttonClass = 'w-full text-left justify-start border border-green-600 bg-green-900/30 text-green-200';
                } else if (i === selected && i !== q.correctIndex) {
                  buttonClass = 'w-full text-left justify-start border border-red-600 bg-red-900/30 text-red-200';
                } else {
                  buttonClass = 'w-full text-left justify-start border border-amber-900/20 bg-[#241c14]/50 text-gray-500';
                }
              }

              return (
                <button
                  key={i}
                  className={buttonClass + ' rounded-md px-3 py-2 text-sm transition-colors'}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                >
                  <span className="flex items-center gap-2">
                    {selected !== null && i === q.correctIndex && (
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    )}
                    {selected !== null && i === selected && i !== q.correctIndex && (
                      <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-3 rounded-md bg-amber-900/20 border border-amber-800/40 p-3">
              <p className="text-sm text-amber-300 font-semibold mb-1">
                {isCorrect ? 'Correct!' : 'Not quite.'} Here&apos;s what actually happened:
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{q.footnote}</p>
            </div>
          )}

          {selected !== null && (
            <Button
              onClick={next}
              className="w-full mt-2 bg-amber-800 hover:bg-amber-700 text-amber-100"
            >
              {isLast ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
