import React, { useState } from 'react';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { GraphicalBoard } from './components/GraphicalBoard';
import { GameRules } from './components/GameRules';
import { GameStats } from './components/GameStats';
import { ALL_WORDS } from './hangmanData';
import {
  Terminal,
  Gamepad2,
  BookOpen,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Flame
} from 'lucide-react';

type Tab = 'terminal' | 'board' | 'rules' | 'stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('terminal');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white font-mono font-black text-xl">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Hangman Word Guessing Game
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Console & Board Edition
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Guess the secret word letter by letter within 6 attempts
              </p>
            </div>
          </div>

          {/* Quick Game Stats Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{ALL_WORDS.length.toLocaleString()} Words Active</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 border-t border-zinc-800/60 pt-2 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal Game</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'board'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Visual Game Board</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>How to Play & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Game Statistics & Word Bank</span>
          </button>
        </div>
      </header>

      {/* Game Rules / Highlights Banner Strip */}
      <section className="bg-zinc-900/50 border-b border-zinc-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict 6 Mistakes Limit</span>
            </span>
            <span className="hidden md:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>7-Stage ASCII Gallows Art</span>
            </span>
            <span className="hidden md:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Duplicate Guess Penalty Prevention</span>
            </span>
            <span className="hidden md:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Score & Replay Tracking</span>
            </span>
          </div>

          <div className="text-zinc-500 font-mono text-[11px] hidden sm:block">
            Input: Single Letter (A - Z)
          </div>
        </div>
      </section>

      {/* Main Game View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'terminal' && <ConsoleTerminal />}
        {activeTab === 'board' && <GraphicalBoard />}
        {activeTab === 'rules' && <GameRules />}
        {activeTab === 'stats' && <GameStats />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 px-6 text-center text-xs text-zinc-600 font-mono">
        Hangman Word Guessing Game • 6 Attempts • 7 Visual Stages • Duplicate-Safe Guessing
      </footer>
    </div>
  );
}
