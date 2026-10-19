import wordsTxtRaw from '../Hangman Word Guessing Game/words.txt?raw';

// Parse clean words list from words.txt
export const ALL_WORDS: string[] = wordsTxtRaw
  .split('\n')
  .map((w) => w.trim().toLowerCase())
  .filter((w) => w.length >= 3 && /^[a-z]+$/.test(w));

export const STAGES: string[] = [
  // Stage 0: 0 mistakes (Empty gallows)
  `   +---+
   |   |
       |
       |
       |
       |
=========`,

  // Stage 1: 1 mistake (Head)
  `   +---+
   |   |
   O   |
       |
       |
       |
=========`,

  // Stage 2: 2 mistakes (Head + Torso)
  `   +---+
   |   |
   O   |
   |   |
       |
       |
=========`,

  // Stage 3: 3 mistakes (Head + Torso + Left Arm)
  `   +---+
   |   |
   O   |
  /|   |
       |
       |
=========`,

  // Stage 4: 4 mistakes (Head + Torso + Both Arms)
  `   +---+
   |   |
   O   |
  /|\\  |
       |
       |
=========`,

  // Stage 5: 5 mistakes (Head + Torso + Both Arms + Left Leg)
  `   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
=========`,

  // Stage 6: 6 mistakes (Final - Both Legs, Game Over)
  `   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
=========`
];

export const MAX_ATTEMPTS = 6;
