import React, { useState, useEffect, useRef } from 'react';
import { ALL_WORDS, STAGES, MAX_ATTEMPTS } from '../hangmanData';
import { sound } from '../sound';
import { Terminal, RefreshCw, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'banner' | 'system' | 'stage' | 'word' | 'status' | 'input' | 'success' | 'error' | 'warn' | 'victory' | 'defeat' | 'prompt';
  text: string;
}

type TerminalTheme = 'green' | 'amber' | 'cyan' | 'monokai';

export const ConsoleTerminal: React.FC = () => {
  const [theme, setTheme] = useState<TerminalTheme>('green');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  
  // Game state
  const [gameState, setGameState] = useState<'playing' | 'ask_replay' | 'ended'>('playing');
  const [secretWord, setSecretWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  sound.enabled = soundEnabled;

  const getThemeClasses = () => {
    switch (theme) {
      case 'amber':
        return {
          bg: 'bg-zinc-950',
          text: 'text-amber-400',
          border: 'border-amber-800/40',
          accent: 'text-amber-300',
          input: 'text-amber-300',
          cursor: 'bg-amber-400',
        };
      case 'cyan':
        return {
          bg: 'bg-slate-950',
          text: 'text-cyan-400',
          border: 'border-cyan-800/40',
          accent: 'text-cyan-300',
          input: 'text-cyan-300',
          cursor: 'bg-cyan-400',
        };
      case 'monokai':
        return {
          bg: 'bg-neutral-950',
          text: 'text-emerald-300',
          border: 'border-neutral-800',
          accent: 'text-yellow-400',
          input: 'text-sky-300',
          cursor: 'bg-emerald-400',
        };
      case 'green':
      default:
        return {
          bg: 'bg-black',
          text: 'text-emerald-500',
          border: 'border-emerald-900/50',
          accent: 'text-emerald-400',
          input: 'text-emerald-300',
          cursor: 'bg-emerald-500',
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Pick random word
  const pickNewWord = (): string => {
    const list = ALL_WORDS.length > 0 ? ALL_WORDS : ['developer', 'terminal', 'hangman', 'python'];
    const chosen = list[Math.floor(Math.random() * list.length)].toUpperCase();
    return chosen;
  };

  // Mask string representation
  const formatMasked = (word: string, guessed: Set<string>): string => {
    return word
      .split('')
      .map((ch) => (guessed.has(ch) ? ch : '_'))
      .join(' ');
  };

  // Add line to terminal
  const addLines = (newLines: Omit<TerminalLine, 'id'>[]) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((l, idx) => ({ ...l, id: `${Date.now()}-${Math.random()}-${idx}` })),
    ]);
  };

  // Start fresh game round
  const startNewGame = (isFirst = false) => {
    const chosen = pickNewWord();
    setSecretWord(chosen);
    setGuessedLetters(new Set());
    setIncorrectGuesses([]);
    setGameState('playing');
    setInputVal('');

    const initialLines: Omit<TerminalLine, 'id'>[] = [];

    if (isFirst) {
      initialLines.push(
        { type: 'banner', text: '=====================================================' },
        { type: 'banner', text: '          HANGMAN WORD GUESSING GAME (CONSOLE)' },
        { type: 'banner', text: '=====================================================' },
        { type: 'system', text: `Loaded ${ALL_WORDS.length.toLocaleString()} words in dictionary bank.` },
        { type: 'system', text: 'Rules: Guess one letter at a time within 6 attempts.' },
        { type: 'system', text: 'Duplicate guesses will NOT penalize your attempts.' },
        { type: 'banner', text: '-----------------------------------------------------' }
      );
    }

    initialLines.push(
      { type: 'system', text: `\n[NEW ROUND] A secret word with ${chosen.length} letters has been chosen!` },
      { type: 'stage', text: STAGES[0] },
      { type: 'word', text: `Word: ${'_ '.repeat(chosen.length).trim()}` },
      { type: 'status', text: 'Incorrect Guesses (0/6): [None]' },
      { type: 'status', text: 'Remaining Attempts: 6' },
      { type: 'banner', text: '-----------------------------------------------------' },
      { type: 'prompt', text: 'Enter your guess:' }
    );

    if (isFirst) {
      setLines(initialLines.map((l, idx) => ({ ...l, id: `init-${idx}` })));
    } else {
      addLines(initialLines);
    }
  };

  // Initialize on mount
  useEffect(() => {
    startNewGame(true);
  }, []);

  // Auto scroll terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Keep input focused
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Handle user input
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    setInputVal('');

    if (gameState === 'ask_replay') {
      sound.playKeypress();
      addLines([{ type: 'input', text: `> ${raw}` }]);
      const ans = raw.toLowerCase();
      if (ans === 'y' || ans === 'yes') {
        startNewGame(false);
      } else if (ans === 'n' || ans === 'no' || ans === 'q' || ans === 'quit') {
        setGameState('ended');
        addLines([
          { type: 'system', text: '\nThank you for playing Hangman! Have a great day!\n' },
          { type: 'system', text: 'Type "restart" or click "New Round" button above to play again.' },
        ]);
      } else {
        addLines([
          { type: 'warn', text: ">> Please enter 'y' to play again or 'n' to quit." },
          { type: 'prompt', text: 'Would you like to play again? (y/n):' },
        ]);
      }
      return;
    }

    if (gameState === 'ended') {
      if (raw.toLowerCase() === 'restart' || raw.toLowerCase() === 'new' || raw.toLowerCase() === 'play') {
        startNewGame(false);
      } else {
        addLines([
          { type: 'input', text: `> ${raw}` },
          { type: 'system', text: 'Game has ended. Click "New Round" or type "restart" to begin a new round.' },
        ]);
      }
      return;
    }

    // Normal game input
    addLines([{ type: 'input', text: `> ${raw}` }]);

    if (!raw) {
      sound.playWrong();
      addLines([
        { type: 'warn', text: '>> Please enter a letter. Input cannot be empty.' },
        { type: 'prompt', text: 'Enter your guess:' },
      ]);
      return;
    }

    if (raw.length !== 1 || !/^[a-zA-Z]$/.test(raw)) {
      sound.playWrong();
      addLines([
        { type: 'warn', text: `>> '${raw}' is invalid! Please enter a single alphabetic letter (A-Z).` },
        { type: 'prompt', text: 'Enter your guess:' },
      ]);
      return;
    }

    const letter = raw.toUpperCase();

    // Check duplicate guess - CRITICAL requirement: no penalty deduction
    if (guessedLetters.has(letter)) {
      sound.playDuplicate();
      addLines([
        {
          type: 'warn',
          text: `>> You already guessed '${letter}'! No penalty deduction. Try another letter.`,
        },
        { type: 'prompt', text: 'Enter your guess:' },
      ]);
      return;
    }

    // Valid new guess
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    const isInWord = secretWord.includes(letter);
    let updatedIncorrect = [...incorrectGuesses];

    if (isInWord) {
      sound.playCorrect();
      const count = secretWord.split(letter).length - 1;
      addLines([
        { type: 'success', text: ` Good guess! '${letter}' appears ${count} time(s).` },
      ]);
    } else {
      sound.playWrong();
      updatedIncorrect.push(letter);
      setIncorrectGuesses(updatedIncorrect);
      addLines([
        { type: 'error', text: ` Sorry, '${letter}' is not in the word.` },
      ]);
    }

    // Check win condition
    const isWin = secretWord.split('').every((ch) => newGuessed.has(ch));
    if (isWin) {
      sound.playWin();
      setWins((w) => w + 1);
      setGameState('ask_replay');
      const attemptsLeft = MAX_ATTEMPTS - updatedIncorrect.length;
      addLines([
        { type: 'victory', text: '\n=====================================================' },
        { type: 'victory', text: '          *** CONGRATULATIONS! YOU WON! ***' },
        { type: 'victory', text: '=====================================================' },
        { type: 'success', text: ` Secret Word      : ${secretWord}` },
        { type: 'status', text: ` Remaining Lives  : ${attemptsLeft} / ${MAX_ATTEMPTS}` },
        { type: 'status', text: ` Total Guesses    : ${newGuessed.size}` },
        { type: 'status', text: ` Session Score    : ${wins + 1} Win(s) | ${losses} Loss(es)` },
        { type: 'victory', text: '=====================================================\n' },
        { type: 'prompt', text: 'Would you like to play again? (y/n):' },
      ]);
      return;
    }

    // Check loss condition
    if (updatedIncorrect.length >= MAX_ATTEMPTS) {
      sound.playGameOver();
      setLosses((l) => l + 1);
      setGameState('ask_replay');
      addLines([
        { type: 'stage', text: STAGES[MAX_ATTEMPTS] },
        { type: 'defeat', text: '\n=====================================================' },
        { type: 'defeat', text: '              GAME OVER - YOU WERE HANGED!' },
        { type: 'defeat', text: '=====================================================' },
        { type: 'defeat', text: ` The secret word was : ${secretWord}` },
        { type: 'system', text: ' Better luck next time!' },
        { type: 'status', text: ` Session Score       : ${wins} Win(s) | ${losses + 1} Loss(es)` },
        { type: 'defeat', text: '=====================================================\n' },
        { type: 'prompt', text: 'Would you like to play again? (y/n):' },
      ]);
      return;
    }

    // Continue game - show updated state
    const remaining = MAX_ATTEMPTS - updatedIncorrect.length;
    addLines([
      { type: 'stage', text: STAGES[updatedIncorrect.length] },
      { type: 'word', text: `Word: ${formatMasked(secretWord, newGuessed)}` },
      {
        type: 'status',
        text: `Incorrect Guesses (${updatedIncorrect.length}/${MAX_ATTEMPTS}): [${
          updatedIncorrect.length > 0 ? updatedIncorrect.join(', ') : 'None'
        }]`,
      },
      { type: 'status', text: `Remaining Attempts: ${remaining}` },
      { type: 'banner', text: '-----------------------------------------------------' },
      { type: 'prompt', text: 'Enter your guess:' },
    ]);
  };

  const getLineClass = (type: TerminalLine['type']) => {
    switch (type) {
      case 'banner':
        return `${themeClasses.accent} font-semibold`;
      case 'stage':
        return 'text-white font-mono leading-none tracking-wider whitespace-pre py-1';
      case 'word':
        return 'text-white text-lg tracking-widest font-bold my-1';
      case 'status':
        return themeClasses.text;
      case 'input':
        return 'text-white font-semibold';
      case 'success':
        return 'text-emerald-400 font-medium';
      case 'error':
        return 'text-rose-400 font-medium';
      case 'warn':
        return 'text-amber-300 font-medium';
      case 'victory':
        return 'text-emerald-300 font-bold';
      case 'defeat':
        return 'text-rose-400 font-bold';
      case 'prompt':
        return `${themeClasses.accent} font-semibold mt-1`;
      case 'system':
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {/* Terminal Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-t-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          </div>
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-zinc-300 font-medium">
            Hangman Console Game • Interactive Mode
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Theme selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {(['green', 'amber', 'cyan', 'monokai'] as TerminalTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize font-mono transition-colors ${
                  theme === t ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
          </button>

          {/* Restart round */}
          <button
            onClick={() => startNewGame(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Round</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div
        onClick={handleTerminalClick}
        className={`${themeClasses.bg} border-x border-b ${themeClasses.border} rounded-b-xl flex-1 p-5 font-mono text-sm overflow-y-auto min-h-[460px] max-h-[620px] shadow-2xl relative cursor-text select-text`}
      >
        {/* Terminal CRT scanline subtle overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent opacity-40"></div>

        {lines.map((line) => (
          <div key={line.id} className={`${getLineClass(line.type)} leading-relaxed`}>
            {line.text}
          </div>
        ))}

        {/* Input prompt line */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
          <span className={`${themeClasses.accent} font-bold select-none`}>
            {gameState === 'ask_replay' ? 'Play again? (y/n) >' : '>'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            maxLength={gameState === 'ask_replay' ? 5 : 1}
            autoFocus
            className={`flex-1 bg-transparent border-none outline-none font-mono ${themeClasses.input} text-sm focus:ring-0 p-0`}
            placeholder={
              gameState === 'ask_replay'
                ? "Type 'y' or 'n'..."
                : "Type letter (A-Z) and press Enter..."
            }
          />
        </form>

        <div ref={bottomRef} />
      </div>

      {/* Quick Interactive Alphabet Buttons below terminal for fast mobile/touch play */}
      <div className="mt-3 p-3 bg-zinc-900/90 rounded-xl border border-zinc-800/80 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs text-zinc-400 font-mono mr-2">Quick Letter Input:</span>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && secretWord.includes(letter);
          const isWrong = isGuessed && !secretWord.includes(letter);

          let btnColor = 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border-zinc-700';
          if (isCorrect) {
            btnColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60 opacity-60 cursor-not-allowed';
          } else if (isWrong) {
            btnColor = 'bg-rose-950/80 text-rose-400 border-rose-700/60 opacity-60 cursor-not-allowed';
          }

          return (
            <button
              key={letter}
              onClick={() => {
                if (gameState === 'playing') {
                  setInputVal(letter);
                  inputRef.current?.focus();
                }
              }}
              disabled={gameState !== 'playing'}
              className={`w-7 h-7 rounded text-xs font-mono font-bold border transition-all ${btnColor}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};
