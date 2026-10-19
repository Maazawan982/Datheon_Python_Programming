#!/usr/bin/env python3
"""
=============================================================================
Hangman Word Guessing Game (Console)
=============================================================================
A modular, interactive console game implementing string manipulation,
control flow, ASCII visual gallows art, and duplicate-safe guess tracking.

Requirements satisfied:
- Selects secret words via random.choice() from words.txt (or built-in bank)
- Letter-by-letter masked display (e.g., '_ A _ H E O N')
- Tracks guessed letters in sets (correct, incorrect, total)
- Prevents duplicate penalty deduction
- Strict 6-mistake attempt limit with 7-stage visual ASCII gallows art
- Clean victory and defeat screens with replay capability
=============================================================================
"""

import os
import random
import sys
from typing import List, Set, Tuple

# ---------------------------------------------------------------------------
# Visual ASCII Gallows Art (7 stages: 0 mistakes -> 6 mistakes = defeat)
# ---------------------------------------------------------------------------
STAGES = [
    # Stage 0: 0 mistakes (Empty gallows)
    """
       +---+
       |   |
           |
           |
           |
           |
    =========
    """,
    # Stage 1: 1 mistake (Head)
    """
       +---+
       |   |
       O   |
           |
           |
           |
    =========
    """,
    # Stage 2: 2 mistakes (Head + Torso)
    """
       +---+
       |   |
       O   |
       |   |
           |
           |
    =========
    """,
    # Stage 3: 3 mistakes (Head + Torso + Left Arm)
    """
       +---+
       |   |
       O   |
      /|   |
           |
           |
    =========
    """,
    # Stage 4: 4 mistakes (Head + Torso + Both Arms)
    """
       +---+
       |   |
       O   |
      /|\\  |
           |
           |
    =========
    """,
    # Stage 5: 5 mistakes (Head + Torso + Both Arms + Left Leg)
    """
       +---+
       |   |
       O   |
      /|\\  |
      /    |
           |
    =========
    """,
    # Stage 6: 6 mistakes (Final - Both Legs, Game Over)
    """
       +---+
       |   |
       O   |
      /|\\  |
      / \\  |
           |
    =========
    """
]

# Maximum allowed incorrect guesses
MAX_ATTEMPTS = 6

# Fallback word list if words.txt is not found
FALLBACK_WORDS = [
    "python", "variable", "function", "algorithm", "developer",
    "terminal", "programming", "hangman", "software", "computer",
    "engineer", "sequence", "condition", "iteration", "execution",
    "keyboard", "structure", "module", "database", "interface"
]

# ANSI color codes for enhanced terminal experience (graceful fallback)
class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    RESET = "\033[0m"

    @classmethod
    def supports_color(cls) -> bool:
        """Check if standard output supports ANSI color codes."""
        return hasattr(sys.stdout, "isatty") and sys.stdout.isatty() and os.name != "nt"


def colorize(text: str, color_code: str) -> str:
    """Safely colorize text if the terminal supports ANSI codes."""
    if Colors.supports_color():
        return f"{color_code}{text}{Colors.RESET}"
    return text


def load_words(filepath: str | None = None) -> List[str]:
    """
    Load clean English words from words.txt.
    Filters out non-alphabetic tokens and words shorter than 3 letters.
    Falls back to a curated default list if the file is not found.
    """
    if filepath is None:
        # Check current working directory, then script directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        potential_paths = [
            os.path.join(script_dir, "words.txt"),
            "words.txt",
            os.path.join("Hangman Word Guessing Game", "words.txt"),
            os.path.join(os.getcwd(), "words.txt")
        ]
        for path in potential_paths:
            if os.path.isfile(path):
                filepath = path
                break

    if filepath and os.path.isfile(filepath):
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                words = [
                    line.strip().lower()
                    for line in f
                    if line.strip().isalpha() and len(line.strip()) >= 3
                ]
            if words:
                return words
        except Exception as e:
            print(colorize(f"Notice: Could not read '{filepath}' ({e}). Using built-in word list.", Colors.YELLOW))

    return [w.lower() for w in FALLBACK_WORDS]


def choose_word(word_list: List[str]) -> str:
    """Randomly select a secret word using standard library random.choice()."""
    if not word_list:
        word_list = FALLBACK_WORDS
    return random.choice(word_list).upper()


def get_masked_word(secret_word: str, guessed_letters: Set[str]) -> str:
    """
    Generate masked string representation of the secret word.
    Correctly guessed letters are revealed with spaces between each letter.
    Unrevealed letters are represented by underscores.
    Example: '_ A _ H E O N'
    """
    display_chars = [
        char if char in guessed_letters else "_"
        for char in secret_word
    ]
    return " ".join(display_chars)


def is_word_guessed(secret_word: str, guessed_letters: Set[str]) -> bool:
    """Check if all unique letters in the secret word have been guessed."""
    return set(secret_word).issubset(guessed_letters)


def display_banner():
    """Print game welcome banner."""
    title = """
=====================================================
          HANGMAN WORD GUESSING GAME
=====================================================
 Guess the secret word one letter at a time!
 You have 6 attempts. Duplicate guesses are penalty-free.
=====================================================
    """
    print(colorize(title, Colors.CYAN))


def display_stage(incorrect_count: int):
    """Display the current ASCII gallows stage."""
    stage_idx = min(incorrect_count, len(STAGES) - 1)
    gallows = STAGES[stage_idx]
    
    # Highlight gallows depending on severity
    if incorrect_count >= 5:
        print(colorize(gallows, Colors.RED))
    elif incorrect_count >= 3:
        print(colorize(gallows, Colors.YELLOW))
    else:
        print(colorize(gallows, Colors.CYAN))


def get_valid_guess(already_guessed: Set[str]) -> str:
    """
    Prompt user for a letter guess and validate:
    1. Exactly one character
    2. Must be an alphabetic letter [A-Z]
    3. Prevents duplicate penalty deduction: alerts the user if letter was
       already guessed, without consuming an attempt.
    """
    while True:
        try:
            raw_input = input(colorize("Enter your guess: ", Colors.BOLD)).strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGame aborted by user. Goodbye!")
            sys.exit(0)

        if not raw_input:
            print(colorize(">> Please enter a letter. Input cannot be empty.", Colors.YELLOW))
            continue

        if len(raw_input) != 1 or not raw_input.isalpha():
            print(colorize(f">> '{raw_input}' is invalid! Please enter a single alphabetic letter (A-Z).", Colors.YELLOW))
            continue

        letter = raw_input.upper()

        # Duplicate check - prevent penalty
        if letter in already_guessed:
            print(colorize(f">> You already guessed '{letter}'! No penalty deduction. Try another letter.", Colors.YELLOW))
            continue

        return letter


def display_victory_screen(secret_word: str, attempts_left: int, total_guesses: int):
    """Display celebratory victory screen."""
    print("\n" + "=" * 54)
    print(colorize("          *** CONGRATULATIONS! YOU WON! ***", Colors.GREEN + Colors.BOLD))
    print("=" * 54)
    print(f" Secret Word      : {colorize(secret_word, Colors.GREEN + Colors.BOLD)}")
    print(f" Remaining Lives  : {attempts_left} / {MAX_ATTEMPTS}")
    print(f" Total Guesses    : {total_guesses}")
    print("=" * 54 + "\n")


def display_defeat_screen(secret_word: str):
    """Display dramatic defeat screen."""
    display_stage(MAX_ATTEMPTS)
    print("\n" + "=" * 54)
    print(colorize("              GAME OVER - YOU WERE HANGED!", Colors.RED + Colors.BOLD))
    print("=" * 54)
    print(f" The secret word was : {colorize(secret_word, Colors.CYAN + Colors.BOLD)}")
    print(" Better luck next time!")
    print("=" * 54 + "\n")


def play_game(word_list: List[str] | None = None) -> bool:
    """
    Execute a single round of Hangman.
    Returns True if the player won, False otherwise.
    """
    if word_list is None:
        word_list = load_words()

    secret_word = choose_word(word_list)
    guessed_letters: Set[str] = set()
    incorrect_guesses: List[str] = []
    
    print("\n" + "-" * 54)
    print(f"A secret word with {len(secret_word)} letters has been chosen!")
    print("-" * 54)

    while len(incorrect_guesses) < MAX_ATTEMPTS:
        remaining = MAX_ATTEMPTS - len(incorrect_guesses)
        
        # 1. Display gallows stage
        display_stage(len(incorrect_guesses))
        
        # 2. Display masked word
        masked = get_masked_word(secret_word, guessed_letters)
        print(f" Word:  {colorize(masked, Colors.BOLD)}")
        
        # 3. Display status: remaining attempts and guessed letters
        incorrect_str = ", ".join(incorrect_guesses) if incorrect_guesses else "None"
        print(f" Incorrect Guesses ({len(incorrect_guesses)}/{MAX_ATTEMPTS}): [{incorrect_str}]")
        print(f" Remaining Attempts: {colorize(str(remaining), Colors.BOLD)}")
        print("-" * 54)

        # 4. Prompt for guess
        guess = get_valid_guess(guessed_letters)
        guessed_letters.add(guess)

        # 5. Evaluate guess
        if guess in secret_word:
            occurrences = secret_word.count(guess)
            print(colorize(f" Good guess! '{guess}' appears {occurrences} time(s).", Colors.GREEN))
        else:
            incorrect_guesses.append(guess)
            print(colorize(f" Sorry, '{guess}' is not in the word.", Colors.RED))

        # 6. Check win condition
        if is_word_guessed(secret_word, guessed_letters):
            display_victory_screen(secret_word, MAX_ATTEMPTS - len(incorrect_guesses), len(guessed_letters))
            return True

    # Defeat condition reached
    display_defeat_screen(secret_word)
    return False


def main():
    """Main execution loop supporting replay and session statistics."""
    display_banner()
    words = load_words()
    print(f"Loaded {len(words):,} words into the dictionary bank.\n")

    wins = 0
    losses = 0

    while True:
        won = play_game(words)
        if won:
            wins += 1
        else:
            losses += 1

        print(f"Session Score: {colorize(str(wins), Colors.GREEN)} Win(s) | {colorize(str(losses), Colors.RED)} Loss(es)")
        
        # Replay prompt
        while True:
            try:
                again = input("\nWould you like to play again? (y/n): ").strip().lower()
            except (EOFError, KeyboardInterrupt):
                again = "n"

            if again in ("y", "yes"):
                break
            elif again in ("n", "no", "q", "quit"):
                print(colorize("\nThank you for playing Hangman! Have a great day!\n", Colors.CYAN))
                return
            else:
                print("Please enter 'y' to play again or 'n' to quit.")


if __name__ == "__main__":
    main()
