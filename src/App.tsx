import React, { useState } from 'react';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { GraphicalBoard } from './components/GraphicalBoard';
import { GameRules } from './components/GameRules';
import { GameStats } from './components/GameStats';
import { Task2Portfolio } from './components/Task2Portfolio';
import { Task3Organizer } from './components/Task3Organizer';
import { PythonDocsViewer } from './components/PythonDocsViewer';
import { Task4Chatbot } from './components/Task4Chatbot';
import { ALL_WORDS } from './hangmanData';
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Terminal,
  Gamepad2,
  BookOpen,
  BarChart3,
  TrendingUp,
  FolderTree,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  Bot,
  MessageSquareCode,
  Sparkles
} from 'lucide-react';

export type ActiveView =
  | 'task1_terminal'
  | 'task1_board'
  | 'task1_rules'
  | 'task1_stats'
  | 'task2_portfolio'
  | 'task3_organizer'
  | 'task3_docs'
  | 'task4_assistant';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('task4_assistant');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [task1Expanded, setTask1Expanded] = useState(true);
  const [task2Expanded, setTask2Expanded] = useState(true);
  const [task3Expanded, setTask3Expanded] = useState(true);
  const [task4Expanded, setTask4Expanded] = useState(true);

  const getActiveTaskLabel = () => {
    if (activeView.startsWith('task1')) return 'Task 01 (Hangman)';
    if (activeView.startsWith('task2')) return 'Task 02 (Portfolio)';
    if (activeView.startsWith('task3')) return 'Task 03 (File Organizer)';
    return 'Task 04 (Rule-Based Chatbot)';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar (Gmail style) */}
      <header className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Hamburger Drawer Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Permanent Workspace Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-mono font-black text-sm shadow-md shadow-indigo-600/20">
              DP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base font-mono tracking-tight text-white">
                  Datheon_Python_Programming
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Workspace
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active: {getActiveTaskLabel()}</span>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar Drawer + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Gmail-Style Sidebar Drawer */}
        <aside
          className={`border-r border-zinc-800/80 bg-zinc-900/50 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-72' : 'w-16'
          }`}
        >
          {/* Sidebar Navigation Items in Ascending Order: Task 01 -> Task 02 -> Task 03 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 select-none">
            {/* SHELF 1: Task 01 - Hangman Word Guessing Game */}
            <div className="space-y-1">
              <div
                onClick={() => setTask1Expanded(!task1Expanded)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeView.startsWith('task1')
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-6 h-6 rounded-md bg-amber-600/25 text-amber-400 flex items-center justify-center font-mono font-black text-xs shrink-0">
                    01
                  </div>
                  {sidebarOpen && <span className="truncate">Task 01: Hangman Game</span>}
                </div>

                {sidebarOpen && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/40 font-mono">
                      Game
                    </span>
                    {task1Expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>

              {/* Task 1 Sub-shelf */}
              {task1Expanded && (
                <div className="space-y-1 pt-1 pl-1">
                  <button
                    onClick={() => setActiveView('task1_terminal')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task1_terminal'
                        ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                    }`}
                    title="Interactive Console Terminal"
                  >
                    <Terminal className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">Terminal Console</span>}
                  </button>

                  <button
                    onClick={() => setActiveView('task1_board')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task1_board'
                        ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                    }`}
                    title="Visual Game Board Mode"
                  >
                    <Gamepad2 className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">Visual Game Board</span>}
                  </button>

                  <button
                    onClick={() => setActiveView('task1_rules')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task1_rules'
                        ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                    }`}
                    title="How to Play & 7-Stage Gallows"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">Game Rules & Stages</span>}
                  </button>

                  <button
                    onClick={() => setActiveView('task1_stats')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task1_stats'
                        ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                    }`}
                    title="Word Bank & Statistics"
                  >
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">Word Bank ({ALL_WORDS.length.toLocaleString()})</span>}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800/60 my-2" />

            {/* SHELF 2: Task 02 - Stock Portfolio Performance Tracker (Stock Market Emerald) */}
            <div className="space-y-1">
              <div
                onClick={() => setTask2Expanded(!task2Expanded)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeView.startsWith('task2')
                    ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-600/60 shadow-sm shadow-emerald-950/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/25 text-emerald-400 flex items-center justify-center font-mono font-black text-xs shrink-0 border border-emerald-500/30">
                    02
                  </div>
                  {sidebarOpen && <span className="truncate text-emerald-300">Task 02: Stock Portfolio</span>}
                </div>

                {sidebarOpen && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-mono font-semibold border border-emerald-700/60">
                      Stocks
                    </span>
                    {task2Expanded ? <ChevronDown className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                )}
              </div>

              {/* Task 2 Sub-shelf */}
              {task2Expanded && (
                <div className="space-y-1 pt-1 pl-1">
                  <button
                    onClick={() => setActiveView('task2_portfolio')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task2_portfolio'
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                        : 'text-zinc-350 hover:text-emerald-300 hover:bg-emerald-950/30'
                    }`}
                    title="Portfolio Valuation & S&P 500 Performance Tracker"
                  >
                    <TrendingUp className="w-4 h-4 shrink-0 text-emerald-300" />
                    {sidebarOpen && <span className="truncate">Portfolio Tracker & CSV</span>}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800/60 my-2" />

            {/* SHELF 3: Task 03 - Automated File Organizer */}
            <div className="space-y-1">
              <div
                onClick={() => setTask3Expanded(!task3Expanded)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeView.startsWith('task3')
                    ? 'bg-sky-950/60 text-sky-400 border border-sky-800/60'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-6 h-6 rounded-md bg-sky-600/25 text-sky-400 flex items-center justify-center font-mono font-black text-xs shrink-0">
                    03
                  </div>
                  {sidebarOpen && <span className="truncate">Task 03: File Organizer</span>}
                </div>

                {sidebarOpen && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200 border border-sky-700/40 font-mono">
                      Utility
                    </span>
                    {task3Expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>

              {/* Task 3 Sub-shelf */}
              {task3Expanded && (
                <div className="space-y-1 pt-1 pl-1">
                  <button
                    onClick={() => setActiveView('task3_organizer')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task3_organizer'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                    }`}
                    title="Automated File Organizer & Cleanup Utility"
                  >
                    <FolderTree className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">Directory Cleanup Utility</span>}
                  </button>

                  <button
                    onClick={() => setActiveView('task3_docs')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task3_docs'
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                    }`}
                    title="Python File Handling Docs (shutil / os.scandir)"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">Python File Handling Docs</span>}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800/60 my-2" />

            {/* SHELF 4: Task 04 - Rule-Based Interactive Terminal Assistant / Chatbot (Violet / Purple) */}
            <div className="space-y-1">
              <div
                onClick={() => setTask4Expanded(!task4Expanded)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeView.startsWith('task4')
                    ? 'bg-purple-950/70 text-purple-400 border border-purple-600/60 shadow-sm shadow-purple-950/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-6 h-6 rounded-md bg-purple-600/25 text-purple-400 flex items-center justify-center font-mono font-black text-xs shrink-0 border border-purple-500/30">
                    04
                  </div>
                  {sidebarOpen && <span className="truncate text-purple-300">Task 04: Terminal Assistant</span>}
                </div>

                {sidebarOpen && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 font-mono font-semibold border border-purple-700/60">
                      Chatbot
                    </span>
                    {task4Expanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Task 4 Sub-shelf */}
              {task4Expanded && (
                <div className="space-y-1 pt-1 pl-1">
                  <button
                    onClick={() => setActiveView('task4_assistant')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeView === 'task4_assistant'
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                        : 'text-zinc-350 hover:text-purple-300 hover:bg-purple-950/30'
                    }`}
                    title="Interactive Rule-Based Terminal Assistant & FAQ Dataset"
                  >
                    <Bot className="w-4 h-4 shrink-0 text-purple-300" />
                    {sidebarOpen && <span className="truncate">Rule-Based Chatbot &amp; FAQs</span>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Drawer Footer */}
          {sidebarOpen && (
            <div className="p-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
              <div className="text-zinc-300 font-semibold truncate">Datheon_Python_Programming</div>
              <div className="text-zinc-600 text-[10px] mt-0.5">Tasks 01, 02, 03 &amp; 04 Active</div>
            </div>
          )}
        </aside>

        {/* Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeView === 'task1_terminal' && <ConsoleTerminal />}
          {activeView === 'task1_board' && <GraphicalBoard />}
          {activeView === 'task1_rules' && <GameRules />}
          {activeView === 'task1_stats' && <GameStats />}

          {activeView === 'task2_portfolio' && <Task2Portfolio />}

          {activeView === 'task3_organizer' && (
            <Task3Organizer onOpenDocs={() => setActiveView('task3_docs')} />
          )}
          {activeView === 'task3_docs' && <PythonDocsViewer />}

          {activeView === 'task4_assistant' && <Task4Chatbot />}
        </main>
      </div>

      {/* Global Minimal Footer */}
      <footer className="border-t border-zinc-900 py-3 px-6 text-center text-xs text-zinc-600 font-mono">
        Datheon_Python_Programming • Task 01: Hangman Game • Task 02: Stock Portfolio Tracker • Task 03: File Organizer • Task 04: Terminal Assistant
      </footer>
    </div>
  );
}

