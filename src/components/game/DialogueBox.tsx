'use client';

interface DialogueBoxProps {
  speaker: string;
  line: string;
}

// Map speaker names to portrait image paths
const SPEAKER_PORTRAITS: Record<string, string> = {
  'Mang Tenyo': '/assets/portraits/mang-tenyo.png',
  'Lt. Guevara': '/assets/portraits/civil-guard.png',
  'Pilosopo Tasyo': '/assets/portraits/friar.png',
  'Padre Dámaso': '/assets/portraits/damaso.png',
  'Elias': '/assets/portraits/elias.png',
  'Maria Clara': '/assets/portraits/clara.png',
  'Sisa': '/assets/portraits/sisa.png',
  'Padre Salví': '/assets/portraits/salvi.png',
  'Simoun': '/assets/portraits/simoun.png',
  'The Letter': '/assets/portraits/ibarra.png',
  'Narrator': '/assets/portraits/rizal.png',
  'Estate Ledger': '/assets/items/book.png',
  'Tax Records': '/assets/items/scroll.png',
  'Witness Statement': '/assets/items/letter.png',
  'Burial Order': '/assets/items/scroll.png',
};

// Speaker-specific color schemes
const SPEAKER_COLORS: Record<string, { bg: string; border: string; accent: string }> = {
  'Mang Tenyo': { bg: '#FFF8E7', border: '#000', accent: '#FFD60A' },
  'Lt. Guevara': { bg: '#FFF8E7', border: '#000', accent: '#2979FF' },
  'Pilosopo Tasyo': { bg: '#FFF8E7', border: '#000', accent: '#00C853' },
  'Padre Dámaso': { bg: '#FFF8E7', border: '#000', accent: '#8B4513' },
  'Elias': { bg: '#FFF8E7', border: '#000', accent: '#00C853' },
  'Maria Clara': { bg: '#FFF8E7', border: '#000', accent: '#FF6B9D' },
  'Sisa': { bg: '#FFF8E7', border: '#000', accent: '#AA00FF' },
  'Padre Salví': { bg: '#FFF8E7', border: '#000', accent: '#8B4513' },
  'Simoun': { bg: '#FFF8E7', border: '#000', accent: '#7B1FA2' },
  'The Letter': { bg: '#FFF8E7', border: '#000', accent: '#FF9100' },
  'Narrator': { bg: '#FFF8E7', border: '#000', accent: '#FFD60A' },
};

export default function DialogueBox({ speaker, line }: DialogueBoxProps) {
  if (!line) return null;

  const portraitSrc = SPEAKER_PORTRAITS[speaker];
  const colors = SPEAKER_COLORS[speaker] || { bg: '#FFF8E7', border: '#000', accent: '#FFD60A' };

  return (
    <div
      className="w-full max-w-[760px] mx-auto border-[3px] border-black rounded-lg shadow-[4px_4px_0_#000] bg-white px-4 py-3"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex gap-3 items-start">
        {portraitSrc && (
          <div
            className="shrink-0 w-14 h-14 rounded-md overflow-hidden border-[3px] border-black shadow-[2px_2px_0_#000]"
            style={{ backgroundColor: colors.accent }}
          >
            <img
              src={portraitSrc}
              alt={speaker}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div
            className="inline-block px-2 py-0.5 rounded-sm text-xs font-black uppercase tracking-wider border-2 border-black text-black mb-1"
            style={{ backgroundColor: colors.accent }}
          >
            {speaker}
          </div>
          <div className="text-sm leading-relaxed font-semibold text-black">
            {line}
          </div>
        </div>
      </div>
    </div>
  );
}
