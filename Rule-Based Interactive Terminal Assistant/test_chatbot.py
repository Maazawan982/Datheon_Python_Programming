#!/usr/bin/env python3
"""
=============================================================================
Unit Test Suite for Task 4: Rule-Based Interactive Terminal Assistant / Chatbot
=============================================================================
Tests:
1. JSON Knowledge Base loading and default integrity.
2. Normalization pipeline (lowercase, whitespace trimming, punctuation).
3. Keyword and regex token extraction.
4. Core FAQ Intent recognition (Hours, Project Submission, Certificates).
5. State transitions: GREETING -> INTENT_IDENTIFICATION -> RESOLUTION -> EXIT.
6. Fallback trigger on low-confidence/unrecognized queries.
7. Exit commands ('bye', 'exit', 'quit', 'goodbye').
8. Help and topic discovery menu.
=============================================================================
"""

import unittest
import os
import sys

# Ensure import of chatbot from current directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from chatbot import (
    RuleBasedChatbot,
    STATE_INIT,
    STATE_GREETING,
    STATE_INTENT_IDENTIFICATION,
    STATE_RESOLUTION,
    STATE_EXIT
)


class TestRuleBasedChatbot(unittest.TestCase):
    """Exhaustive test suite for the rule-based terminal assistant."""

    def setUp(self):
        """Initialize fresh chatbot instance before each test."""
        self.bot = RuleBasedChatbot()

    def test_01_knowledge_base_loaded(self):
        """Verify that sample_faq.json was loaded with greetings, exit commands, and FAQs."""
        self.assertIn("greetings", self.bot.data)
        self.assertIn("faqs", self.bot.data)
        self.assertGreaterEqual(len(self.bot.data["faqs"]), 3)
        
        # Verify the 3 required sample questions from the user's dataset
        questions = [f["question"] for f in self.bot.data["faqs"]]
        self.assertTrue(any("hours of operation" in q.lower() for q in questions))
        self.assertTrue(any("submit my internship project" in q.lower() for q in questions))
        self.assertTrue(any("receive my certificate" in q.lower() for q in questions))

    def test_02_normalization(self):
        """Verify user input normalization pipeline."""
        raw = "   WHAT   are   YOUR Hours of   Operation??  "
        normalized = self.bot.normalize_input(raw)
        self.assertEqual(normalized, "what are your hours of operation??")

        empty_normalized = self.bot.normalize_input("    \t  \n ")
        self.assertEqual(empty_normalized, "")

    def test_03_keyword_extraction(self):
        """Verify keyword token extraction and stop-word filtering."""
        text = "How do I submit my internship project on GitHub?"
        keywords = self.bot.extract_keywords(text)
        # 'how', 'do', 'i', 'my', 'on' are stop words; 'submit', 'internship', 'project', 'github' should remain
        self.assertIn("submit", keywords)
        self.assertIn("internship", keywords)
        self.assertIn("project", keywords)
        self.assertIn("github", keywords)
        self.assertNotIn("i", keywords)
        self.assertNotIn("do", keywords)

    def test_04_greetings_state_transition(self):
        """Verify greeting input triggers STATE_GREETING with appropriate welcome message."""
        res = self.bot.process_message("Hello there!")
        self.assertEqual(res["intent"], "greeting")
        self.assertEqual(res["current_state"], STATE_GREETING)
        self.assertIn("welcome", res["response"].lower())

        res2 = self.bot.process_message("good morning")
        self.assertEqual(res2["intent"], "greeting")
        self.assertEqual(res2["current_state"], STATE_GREETING)

    def test_05_hours_of_operation_faq(self):
        """Verify exact and regex-varied queries for operational hours."""
        # Exact match
        res1 = self.bot.process_message("What are your hours of operation?")
        self.assertEqual(res1["intent"], "hours_of_operation")
        self.assertEqual(res1["current_state"], STATE_RESOLUTION)
        self.assertIn("9:00 AM to 6:00 PM IST", res1["response"])
        self.assertGreaterEqual(res1["confidence"], 0.7)

        # Variation
        res2 = self.bot.process_message("When are you guys open? What are your working hours?")
        self.assertEqual(res2["intent"], "hours_of_operation")
        self.assertIn("Monday through Friday", res2["response"])

    def test_06_project_submission_faq(self):
        """Verify project submission intent matching."""
        # Exact match
        res1 = self.bot.process_message("How do I submit my internship project?")
        self.assertEqual(res1["intent"], "project_submission")
        self.assertEqual(res1["current_state"], STATE_RESOLUTION)
        self.assertIn("GitHub", res1["response"])
        self.assertIn("Student Workspace", res1["response"])

        # Variation
        res2 = self.bot.process_message("Where should I upload my assignment repository?")
        self.assertEqual(res2["intent"], "project_submission")
        self.assertIn("Student Workspace", res2["response"])

    def test_07_certificate_issuance_faq(self):
        """Verify certificate issuance intent matching."""
        # Exact match
        res1 = self.bot.process_message("When will I receive my certificate?")
        self.assertEqual(res1["intent"], "certificate_issuance")
        self.assertEqual(res1["current_state"], STATE_RESOLUTION)
        self.assertIn("3-5 business days", res1["response"])

        # Variation
        res2 = self.bot.process_message("How long after the code review do I get my cert?")
        self.assertEqual(res2["intent"], "certificate_issuance")
        self.assertIn("Certificates are reviewed", res2["response"])

    def test_08_fallback_handling(self):
        """Verify low-confidence or arbitrary input triggers graceful fallback."""
        gibberish = "xyzzy blorp quantum flux banana spaceship"
        res = self.bot.process_message(gibberish)
        self.assertEqual(res["intent"], "fallback_unknown")
        self.assertLess(res["confidence"], 0.35)
        self.assertTrue(
            "sorry" in res["response"].lower() or 
            "rephrase" in res["response"].lower() or 
            "specialize" in res["response"].lower()
        )

    def test_09_exit_commands(self):
        """Verify clean termination on exit commands ('bye', 'exit', 'quit', 'goodbye')."""
        for exit_cmd in ["bye", "exit", "quit", "goodbye"]:
            bot = RuleBasedChatbot()
            res = bot.process_message(exit_cmd)
            self.assertTrue(res["is_exit"])
            self.assertEqual(res["current_state"], STATE_EXIT)
            self.assertEqual(res["intent"], "exit")
            self.assertIn("Goodbye", res["response"])

    def test_10_help_command(self):
        """Verify help menu lists available topics."""
        res = self.bot.process_message("help")
        self.assertEqual(res["intent"], "help_menu")
        self.assertIn("Hours of Operation", res["response"])
        self.assertIn("Project Submission", res["response"])
        self.assertIn("Certificates", res["response"])


if __name__ == "__main__":
    unittest.main()
