# Hangman Word Guessing Game (Console)

A modular, interactive console game built in Python 3 implementing string manipulation, control flow, ASCII visual gallows art, and duplicate-safe guess tracking.

---

## 📋 Task Overview & Deliverables

- **Language:** Python 3 (standard library: `random`, `sys`, `os`)
- **Word Bank:** Over 9,400+ English words in `words.txt`
- **Attempt Limit:** Strict 6-attempt maximum (7 ASCII gallows art stages)
- **Duplicate Protection:** Prevents duplicate penalty deductions with helpful warnings
- **Visual Feedback:** Masked word string formatting (e.g., `_ A _ H E O N`), real-time incorrect letters display, dynamic ANSI color highlighting
- **Victory & Defeat Screens:** Clean celebratory banner upon victory or dramatic reveal on defeat
- **Session Stats & Replay:** Replay loop with win/loss tracker

---

## 🗂️ Project File Structure

```
Hangman Word Guessing Game/
├── hangman.py          # Main executable Python 3 console game
├── words.txt           # 9,400+ clean English words list
├── test_hangman.py     # Unit test suite verifying game logic & stages
├── requirements.txt    # Python dependencies & version specifications
└── README.md           # Documentation & instructions
```

---

## 🚀 How to Run

### 1. Run the Console Game
Open your terminal in this directory and execute:

```bash
python3 hangman.py
```

Or from the workspace root:

```bash
python3 "Hangman Word Guessing Game/hangman.py"
```

### 2. Run the Unit Test Suite

```bash
python3 -m unittest "Hangman Word Guessing Game/test_hangman.py"
```

---

## 🎮 Gameplay Rules

1. A random word is selected from `words.txt`.
2. The hidden word is displayed masked with underscores, for example: `_ _ _ _ _ _`.
3. Guess one letter at a time (case-insensitive).
4. If the letter is in the secret word, it reveals all positions of that letter.
5. If the letter is not in the word:
   - One attempt is deducted.
   - The ASCII gallows advances by 1 stage.
6. **No Duplicate Penalties:** If you repeat a previously guessed letter, the game notifies you without reducing your remaining attempts.
7. You win if you reveal all letters before reaching 6 incorrect attempts!

---

## 🎨 ASCII Gallows Stages (0 to 6 Mistakes)

```
  Stage 0        Stage 1        Stage 2        Stage 3        Stage 4        Stage 5        Stage 6
   +---+          +---+          +---+          +---+          +---+          +---+          +---+  
   |   |          |   |          |   |          |   |          |   |          |   |          |   |  
       |          O   |          O   |          O   |          O   |          O   |          O   |  
       |              |          |   |         /|   |         /|\  |         /|\  |         /|\  |  
       |              |              |              |              |         /    |         / \  |  
       |              |              |              |              |              |              |  
 =========      =========      =========      =========      =========      =========      =========
```
