import React from 'react';
import { STAGES, MAX_ATTEMPTS } from '../hangmanData';
import { ShieldCheck, CheckCircle2, AlertTriangle, Trophy, Skull, HelpCircle, Sparkles } from 'lucide-react';

export const GameRules: React.FC = () => {
  const stageDescriptions = [
    { title: 'Stage 0: Empty Gallows', desc: '0 mistakes. The game begins with clean gallows. You have all 6 attempts.' },
    { title: 'Stage 1: Head', desc: '1 mistake. The head appears (O). 5 attempts remaining.' },
    { title: 'Stage 2: Torso', desc: '2 mistakes. The body/torso is drawn (|). 4 attempts remaining.' },
    { title: 'Stage 3: Left Arm', desc: '3 mistakes. The left arm is added (/|). 3 attempts remaining.' },
    { title: 'Stage 4: Right Arm', desc: '4 mistakes. Both arms are drawn (/|\\). 2 attempts remaining.' },
    { title: 'Stage 5: Left Leg', desc: '5 mistakes. The left leg is drawn. Critical danger! 1 attempt left.' },
    { title: 'Stage 6: Final Stage (Game Over)', desc: '6 mistakes. Both legs drawn (/ \\). Game Over — You are hanged!' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title & Core Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Official Game Manual & Rules</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
          Hangman Word Guessing Game
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 mt-2 leading-relaxed">
          An interactive, classic word puzzle game where your goal is to deduce a hidden secret word letter-by-letter before the gallows is completed.
        </p>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
            <div className="text-emerald-400 font-mono font-bold text-lg">6 Attempts</div>
            <div className="text-xs font-semibold text-white">Strict Mistake Limit</div>
            <div className="text-xs text-zinc-400">
              Only incorrect letter guesses reduce your remaining attempts.
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
            <div className="text-emerald-400 font-mono font-bold text-lg">0 Penalty</div>
            <div className="text-xs font-semibold text-white">Duplicate Protection</div>
            <div className="text-xs text-zinc-400">
              Guessing an already attempted letter never penalizes your score or attempts.
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
            <div className="text-emerald-400 font-mono font-bold text-lg">7 Stages</div>
            <div className="text-xs font-semibold text-white">Visual ASCII Art</div>
            <div className="text-xs text-zinc-400">
              Gallows art visually advances in real time from empty beam to defeat.
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
            <div className="text-emerald-400 font-mono font-bold text-lg">_ A _ H E O N</div>
            <div className="text-xs font-semibold text-white">Masked String</div>
            <div className="text-xs text-zinc-400">
              Correct letters reveal in their exact position with space separation.
            </div>
          </div>
        </div>
      </div>

      {/* Rules Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How to Play */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Gameplay Rules</span>
          </h3>

          <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>Word Selection:</strong> The game chooses a secret English word at random from a dictionary of over 9,400+ words.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>Letter Guessing:</strong> Guess one single letter (A through Z) per turn. Input is case-insensitive.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong>Correct Guess:</strong> If the letter is present, all occurrences are revealed in the masked word. No life is deducted!
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <span>
                <strong>Incorrect Guess:</strong> If the letter is absent, 1 life is lost and the hangman gallows advances by one visual body part.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                5
              </span>
              <span>
                <strong>No Duplicate Penalties:</strong> If you re-enter a letter you have already guessed, you receive a friendly alert without losing an attempt.
              </span>
            </li>
          </ul>
        </div>

        {/* Win / Loss Conditions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Outcomes & Win/Loss</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Victory Screen</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  You win if you uncover all letters of the secret word before accumulating 6 incorrect attempts. The victory screen displays your remaining lives and total guesses.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <Skull className="w-4 h-4 text-rose-400" />
                  <span>Defeat Screen</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  If you make 6 incorrect guesses, the final gallows stage is rendered and the secret word is revealed. You can immediately choose to play again.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs text-zinc-400">
            <span className="text-emerald-400 font-semibold">Pro Strategy:</span> Start by guessing high-frequency vowels (E, A, O, I, U) followed by frequent consonants (T, N, S, R, H, L, D, C).
          </div>
        </div>
      </div>

      {/* Visual Gallows Stages Exhibition */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Visual ASCII Gallows Evolution (7 Stages)</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Progressive gallows stages corresponding to mistakes (0 to 6).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAGES.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center ${
                idx === 6
                  ? 'bg-rose-950/30 border-rose-800/70'
                  : idx >= 4
                  ? 'bg-amber-950/30 border-amber-800/70'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-zinc-300 mb-1">
                Stage {idx}
              </div>
              <pre className="font-mono text-xs leading-none text-emerald-400 select-none py-1">
                {stage}
              </pre>
              <div className="text-[10px] text-zinc-400 mt-2 font-mono">
                {idx === 0
                  ? 'Start (0)'
                  : idx === 6
                  ? 'Game Over (6)'
                  : `${idx} ${idx === 1 ? 'mistake' : 'mistakes'}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
