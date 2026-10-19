import React, { useState, useEffect } from 'react';
import { ALL_WORDS, STAGES, MAX_ATTEMPTS } from '../hangmanData';
import { sound } from '../sound';
import { RotateCcw, Trophy, Flame, HelpCircle, Heart, AlertTriangle } from 'lucide-react';

export const GraphicalBoard: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [secretWord, setSecretWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lastMessage, setLastMessage] = useState<string>('Select a letter to begin guessing!');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error' | 'warn'>('info');

  // Stats
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  // Filter word list based on difficulty
  const getFilteredWords = () => {
    switch (difficulty) {
      case 'easy':
        return ALL_WORDS.filter((w) => w.length >= 3 && w.length <= 5);
      case 'medium':
        return ALL_WORDS.filter((w) => w.length >= 6 && w.length <= 8);
      case 'hard':
        return ALL_WORDS.filter((w) => w.length >= 9);
      case 'all':
      default:
        return ALL_WORDS;
    }
  };

  const startNewGame = () => {
    const list = getFilteredWords();
    const candidatePool = list.length > 0 ? list : ALL_WORDS;
    const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)].toUpperCase();
    
    setSecretWord(chosen);
    setGuessedLetters(new Set());
    setIncorrectGuesses([]);
    setGameStatus('playing');
    setLastMessage(`New round started! Word has ${chosen.length} letters.`);
    setMessageType('info');
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing') return;

    // Check duplicate
    if (guessedLetters.has(letter)) {
      sound.playDuplicate();
      setLastMessage(`You already guessed '${letter}'! No penalty deduction.`);
      setMessageType('warn');
      return;
    }

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    const isInWord = secretWord.includes(letter);
    const updatedIncorrect = [...incorrectGuesses];

    if (isInWord) {
      sound.playCorrect();
      const count = secretWord.split(letter).length - 1;
      setLastMessage(`Good call! '${letter}' is in the word (${count}x).`);
      setMessageType('success');
    } else {
      sound.playWrong();
      updatedIncorrect.push(letter);
      setIncorrectGuesses(updatedIncorrect);
      setLastMessage(`Sorry, '${letter}' is not in the secret word.`);
      setMessageType('error');
    }

    // Check win condition
    const isWin = secretWord.split('').every((char) => newGuessed.has(char));
    if (isWin) {
      sound.playWin();
      setGameStatus('won');
      setTotalWins((w) => w + 1);
      setTotalGames((g) => g + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setLastMessage(`VICTORY! You guessed "${secretWord}" successfully!`);
      setMessageType('success');
      return;
    }

    // Check defeat condition
    if (updatedIncorrect.length >= MAX_ATTEMPTS) {
      sound.playGameOver();
      setGameStatus('lost');
      setTotalGames((g) => g + 1);
      setStreak(0);
      setLastMessage(`GAME OVER! The word was "${secretWord}".`);
      setMessageType('error');
    }
  };

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        handleGuess(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guessedLetters, incorrectGuesses, gameStatus, secretWord]);

  const remainingAttempts = MAX_ATTEMPTS - incorrectGuesses.length;
  const currentStageIndex = Math.min(incorrectGuesses.length, STAGES.length - 1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Controls & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Difficulty Selector */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Word Length Filter
          </div>
          <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`py-1 text-xs rounded font-medium capitalize transition-colors ${
                  difficulty === diff
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'All' : diff}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-zinc-500 mt-2">
            {difficulty === 'easy' && 'Short words (3 - 5 letters)'}
            {difficulty === 'medium' && 'Medium words (6 - 8 letters)'}
            {difficulty === 'hard' && 'Long words (9+ letters)'}
            {difficulty === 'all' && `Full dictionary (${ALL_WORDS.length.toLocaleString()} words)`}
          </div>
        </div>

        {/* Lives & Status Indicator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Remaining Lives</span>
            <span className="font-mono text-zinc-300 font-bold">{remainingAttempts} / {MAX_ATTEMPTS}</span>
          </div>
          <div className="flex items-center gap-2 my-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  i < remainingAttempts
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                    : 'bg-zinc-800 border border-zinc-700/50'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Mistakes: {incorrectGuesses.length}</span>
            <span>Duplicates free from penalty</span>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold uppercase">
              <Flame className="w-4 h-4" />
              <span>Streak</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{streak}</div>
            <div className="text-[10px] text-zinc-500">Best: {bestStreak}</div>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold uppercase">
              <Trophy className="w-4 h-4" />
              <span>Win Rate</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalGames > 0 ? `${Math.round((totalWins / totalGames) * 100)}%` : '0%'}
            </div>
            <div className="text-[10px] text-zinc-500">{totalWins} of {totalGames}</div>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Gallows Art display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-zinc-950/90 rounded-xl p-6 border border-zinc-800">
          <div className="text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <span>ASCII Gallows Visual</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300">
              Stage {currentStageIndex} of 6
            </span>
          </div>

          <pre className="font-mono text-emerald-400 text-lg leading-tight p-3 bg-black/60 rounded-lg border border-zinc-800/80 shadow-inner select-none whitespace-pre">
            {STAGES[currentStageIndex]}
          </pre>

          {/* Incorrect guesses pill list */}
          <div className="mt-4 w-full text-center">
            <span className="text-xs text-zinc-500 font-mono">Incorrect Guesses:</span>
            <div className="flex flex-wrap justify-center gap-1.5 mt-1.5 min-h-[28px]">
              {incorrectGuesses.length === 0 ? (
                <span className="text-xs text-zinc-600 font-mono italic">None so far</span>
              ) : (
                incorrectGuesses.map((ch, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-6 h-6 rounded bg-rose-950/60 text-rose-400 font-mono font-bold text-xs border border-rose-800/50"
                  >
                    {ch}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Word Display & Outcome */}
        <div className="md:col-span-7 flex flex-col items-center justify-center text-center space-y-6">
          {/* Notification Banner */}
          <div
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
              messageType === 'success'
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                : messageType === 'error'
                ? 'bg-rose-950/50 text-rose-300 border-rose-800/60'
                : messageType === 'warn'
                ? 'bg-amber-950/50 text-amber-300 border-amber-800/60'
                : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60'
            }`}
          >
            {messageType === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            <span>{lastMessage}</span>
          </div>

          {/* Word Letter Tiles */}
          <div className="flex flex-wrap justify-center gap-2 max-w-full py-4">
            {secretWord.split('').map((char, index) => {
              const isRevealed = guessedLetters.has(char) || gameStatus === 'lost';
              const isMissingFromLoss = gameStatus === 'lost' && !guessedLetters.has(char);

              return (
                <div
                  key={index}
                  className={`w-11 h-14 sm:w-12 sm:h-16 rounded-xl flex items-center justify-center text-2xl font-black font-mono shadow-md border-b-4 transition-all duration-300 ${
                    isRevealed
                      ? isMissingFromLoss
                        ? 'bg-rose-950/80 text-rose-400 border-rose-600'
                        : 'bg-emerald-900/60 text-emerald-300 border-emerald-500 shadow-emerald-500/20'
                      : 'bg-zinc-800/90 text-transparent border-zinc-700'
                  }`}
                >
                  {isRevealed ? char : ''}
                </div>
              );
            })}
          </div>

          {/* End of Game Action Prompt */}
          {gameStatus !== 'playing' ? (
            <div className="space-y-3">
              <button
                onClick={startNewGame}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Next Round</span>
              </button>
              <p className="text-xs text-zinc-400">
                Word dictionary loaded with {ALL_WORDS.length.toLocaleString()} words
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 font-mono">
              Type on your keyboard or click the buttons below
            </p>
          )}
        </div>
      </div>

      {/* On-Screen Keyboard */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 text-center">
          Alphabet Letter Board
        </div>
        <div className="flex flex-col gap-2 max-w-2xl mx-auto">
          {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1.5 sm:gap-2">
              {row.split('').map((letter) => {
                const isGuessed = guessedLetters.has(letter);
                const isCorrect = isGuessed && secretWord.includes(letter);
                const isWrong = isGuessed && !secretWord.includes(letter);

                let btnStyles =
                  'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white border-zinc-700 active:scale-95';

                if (isCorrect) {
                  btnStyles =
                    'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20';
                } else if (isWrong) {
                  btnStyles =
                    'bg-rose-950/70 text-rose-400 border-rose-800/60 opacity-50 cursor-not-allowed';
                }

                return (
                  <button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={gameStatus !== 'playing' || (isGuessed && isWrong)}
                    className={`w-8 h-11 sm:w-11 sm:h-12 rounded-lg font-mono font-bold text-sm sm:text-base border shadow-sm transition-all flex items-center justify-center ${btnStyles}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
