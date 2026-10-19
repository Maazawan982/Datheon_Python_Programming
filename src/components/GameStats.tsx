import React from 'react';
import { ALL_WORDS } from '../hangmanData';
import { BookOpen, BarChart3, Layers, Sparkles, Hash } from 'lucide-react';

export const GameStats: React.FC = () => {
  // Analyze words by length
  const lengthsMap: Record<number, number> = {};
  ALL_WORDS.forEach((w) => {
    const len = w.length;
    lengthsMap[len] = (lengthsMap[len] || 0) + 1;
  });

  const sortedLengths = Object.keys(lengthsMap)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(0, 12);

  const maxCount = Math.max(...Object.values(lengthsMap));

  const easyWords = ALL_WORDS.filter((w) => w.length >= 3 && w.length <= 5);
  const medWords = ALL_WORDS.filter((w) => w.length >= 6 && w.length <= 8);
  const hardWords = ALL_WORDS.filter((w) => w.length >= 9);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Word Bank & Dictionary Metrics</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            {ALL_WORDS.length.toLocaleString()} English Words Bank
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Complete active vocabulary pool for the Hangman guessing engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400 uppercase font-mono">Shortest</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">3 letters</div>
          </div>
          <div className="text-center px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400 uppercase font-mono">Longest</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">18 letters</div>
          </div>
        </div>
      </div>

      {/* Difficulty Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Easy Tier
            </span>
            <span className="text-xs text-zinc-400 font-mono">3 - 5 letters</span>
          </div>
          <div className="text-3xl font-black text-white">{easyWords.length.toLocaleString()}</div>
          <p className="text-xs text-zinc-400">
            Great for fast rounds. Examples: <span className="text-zinc-300 font-mono">game, word, code, book, cloud</span>
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Medium Tier
            </span>
            <span className="text-xs text-zinc-400 font-mono">6 - 8 letters</span>
          </div>
          <div className="text-3xl font-black text-white">{medWords.length.toLocaleString()}</div>
          <p className="text-xs text-zinc-400">
            Balanced challenge. Examples: <span className="text-zinc-300 font-mono">system, player, network, terminal</span>
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              Hard Tier
            </span>
            <span className="text-xs text-zinc-400 font-mono">9+ letters</span>
          </div>
          <div className="text-3xl font-black text-white">{hardWords.length.toLocaleString()}</div>
          <p className="text-xs text-zinc-400">
            Expert vocabulary. Examples: <span className="text-zinc-300 font-mono">developer, programming, structure</span>
          </p>
        </div>
      </div>

      {/* Word Length Histogram */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Word Length Distribution</span>
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Word count per length</span>
        </div>

        <div className="space-y-2 pt-2">
          {sortedLengths.map((len) => {
            const count = lengthsMap[len] || 0;
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={len} className="flex items-center gap-3 text-xs font-mono">
                <span className="w-16 text-zinc-400 text-right shrink-0">{len} letters</span>
                <div className="flex-1 bg-zinc-950 rounded-full h-4 overflow-hidden border border-zinc-800 flex items-center">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 text-zinc-300 font-bold text-right shrink-0">
                  {count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
