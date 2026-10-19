#!/usr/bin/env python3
"""
Unit tests for Hangman Word Guessing Game.
Validates logic, masked word generation, stages, duplicate detection, and word list loading.
"""

import unittest
import os
import sys

# Ensure parent directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from hangman import (
    STAGES,
    MAX_ATTEMPTS,
    get_masked_word,
    is_word_guessed,
    load_words,
    choose_word
)


class TestHangmanGame(unittest.TestCase):

    def test_stages_count(self):
        """Verify there are 7 visual stages for 0 through 6 mistakes."""
        self.assertEqual(len(STAGES), 7)
        self.assertEqual(MAX_ATTEMPTS, 6)

    def test_masked_word_initial(self):
        """Verify masked word starts with underscores and spaces."""
        secret = "PYTHON"
        guessed = set()
        masked = get_masked_word(secret, guessed)
        self.assertEqual(masked, "_ _ _ _ _ _")

    def test_masked_word_partial(self):
        """Verify partial guesses reveal letters and preserve underscores."""
        secret = "DEVELOPER"
        guessed = {"E", "D"}
        masked = get_masked_word(secret, guessed)
        self.assertEqual(masked, "D E _ E _ _ _ E _")

    def test_masked_word_complete(self):
        """Verify all letters revealed once guessed."""
        secret = "CAT"
        guessed = {"C", "A", "T"}
        masked = get_masked_word(secret, guessed)
        self.assertEqual(masked, "C A T")

    def test_is_word_guessed(self):
        """Verify win condition logic."""
        secret = "HANGMAN"
        self.assertFalse(is_word_guessed(secret, {"H", "A", "N"}))
        self.assertFalse(is_word_guessed(secret, {"H", "A", "N", "G"}))
        # Now add 'M'
        self.assertTrue(is_word_guessed(secret, {"H", "A", "N", "G", "M"}))

    def test_load_words(self):
        """Verify words.txt loads successfully and filters correctly."""
        words = load_words()
        self.assertGreater(len(words), 0)
        # All words should be alpha and length >= 3
        for w in words[:50]:
            self.assertTrue(w.isalpha())
            self.assertGreaterEqual(len(w), 3)

    def test_choose_word(self):
        """Verify chosen word is uppercase and in word list."""
        words = ["apple", "banana", "cherry"]
        chosen = choose_word(words)
        self.assertIn(chosen.lower(), words)
        self.assertTrue(chosen.isupper())


if __name__ == "__main__":
    unittest.main()
