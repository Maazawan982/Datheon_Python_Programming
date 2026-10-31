#!/usr/bin/env python3
"""
=============================================================================
Task 4: Rule-Based Interactive Terminal Assistant / Chatbot
=============================================================================
Build a responsive conversational assistant with multi-intent recognition.

Detailed Problem Statement & Requirements:
- Implement a rule-based customer support or product assistant.
- Parse user input for keywords and regular expressions.
- Handle queries regarding business hours, product FAQs, and return contextual responses.
- Graceful fallback handling for unrecognized queries.
- Clean exit commands ('bye', 'exit', 'quit').
- Suggested Technical Approach:
  1. Create 'chatbot.py'.
  2. Define intent response dictionaries or load questions from a JSON dataset.
  3. Normalize user input (lowercase, strip whitespace, regex keyword extraction).
  4. Implement conversational state management (greeting -> intent identification -> resolution -> exit).
  5. Provide graceful fallbacks when query confidence is low.
=============================================================================
"""

import os
import sys
import json
import re
from typing import Dict, List, Tuple, Optional, Any

# Current directory paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATASET_PATH = os.path.join(SCRIPT_DIR, "sample_faq.json")

# Conversational State Constants
STATE_INIT = "INITIAL"
STATE_GREETING = "GREETING"
STATE_INTENT_IDENTIFICATION = "INTENT_IDENTIFICATION"
STATE_RESOLUTION = "RESOLUTION"
STATE_EXIT = "EXIT"

# ANSI Terminal Styling
COLOR_RESET = "\033[0m"
COLOR_BOLD = "\033[1m"
COLOR_DIM = "\033[2m"
COLOR_PURPLE = "\033[38;5;141m"
COLOR_MAGENTA = "\033[35m"
COLOR_CYAN = "\033[36m"
COLOR_GREEN = "\033[32m"
COLOR_YELLOW = "\033[33m"
COLOR_RED = "\033[31m"
COLOR_WHITE = "\033[97m"

def supports_color() -> bool:
    """Check if standard output supports ANSI color escapes."""
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty() and os.environ.get("NO_COLOR") is None

def colorize(text: str, color_code: str) -> str:
    """Wrap text in ANSI color if supported."""
    if supports_color():
        return f"{color_code}{text}{COLOR_RESET}"
    return text


class RuleBasedChatbot:
    """
    A rule-based conversational assistant featuring regex pattern matching,
    keyword extraction, JSON FAQ dataset ingestion, and a formal 4-stage state machine.
    """

    def __init__(self, dataset_path: Optional[str] = None):
        self.dataset_path = dataset_path or DEFAULT_DATASET_PATH
        self.state: str = STATE_INIT
        self.turn_count: int = 0
        self.last_matched_intent: Optional[str] = None
        self.conversation_history: List[Dict[str, Any]] = []
        
        # Load knowledge base from JSON
        self.data: Dict[str, Any] = self._load_dataset(self.dataset_path)
        
        # Compile core regex pattern rules
        self._compile_patterns()

    def _load_dataset(self, path: str) -> Dict[str, Any]:
        """Load knowledge base and FAQs from JSON file with fallback defaults."""
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[Warning] Failed to load JSON dataset from {path}: {e}. Using embedded defaults.", file=sys.stderr)
        
        # Embedded default dataset in case JSON file is missing
        return {
            "greetings": [
                "hello", "hi", "hey", "good morning", "good afternoon", "greetings"
            ],
            "exit_commands": [
                "bye", "exit", "quit", "goodbye", "cya", "see you"
            ],
            "faqs": [
                {
                    "id": "faq_hours",
                    "intent": "hours_of_operation",
                    "keywords": ["hours", "operation", "opening", "open", "timing", "schedule"],
                    "regex_pattern": r"\b(hour|hours|timing|timings|open|opening|schedule|work\s*hours)\b",
                    "question": "What are your hours of operation?",
                    "answer": "We operate Monday through Friday from 9:00 AM to 6:00 PM IST."
                },
                {
                    "id": "faq_submission",
                    "intent": "project_submission",
                    "keywords": ["submit", "submission", "internship", "project", "assignment", "github", "workspace"],
                    "regex_pattern": r"\b(submit|submission|submitting|project|assignment|github|repository|workspace)\b",
                    "question": "How do I submit my internship project?",
                    "answer": "You can submit your public GitHub repository link through your Student Workspace."
                },
                {
                    "id": "faq_certificate",
                    "intent": "certificate_issuance",
                    "keywords": ["certificate", "receive", "issued", "completion", "code review"],
                    "regex_pattern": r"\b(cert|certificate|certificates|certified|receive|issued|review)\b",
                    "question": "When will I receive my certificate?",
                    "answer": "Certificates are reviewed and issued within 3-5 business days after your code review."
                }
            ],
            "fallbacks": [
                "I'm sorry, I didn't quite catch that. You can ask about our hours of operation, project submission, or certificates.",
                "I couldn't identify a matching topic. Could you please rephrase your question? (Type 'help' to view topics)",
                "I specialize in answering questions about operational hours, project submissions, and certificate processing."
            ]
        }

    def _compile_patterns(self) -> None:
        """Compile regular expression rules for greetings, exits, and FAQ intents."""
        # Exit pattern
        exit_terms = self.data.get("exit_commands", ["bye", "exit", "quit", "goodbye"])
        escaped_exits = [re.escape(w) for w in exit_terms]
        self.exit_regex = re.compile(rf"\b({'|'.join(escaped_exits)})\b", re.IGNORECASE)

        # Greeting pattern
        greetings = self.data.get("greetings", ["hello", "hi", "hey"])
        escaped_greetings = [re.escape(w) for w in greetings]
        self.greeting_regex = re.compile(rf"\b({'|'.join(escaped_greetings)})\b", re.IGNORECASE)

        # Help pattern
        self.help_regex = re.compile(r"\b(help|topics|commands|options|faq|faqs|menu)\b", re.IGNORECASE)

        # Gratitude pattern
        self.thanks_regex = re.compile(r"\b(thanks|thank\s*you|thx|appreciated|great|awesome|perfect)\b", re.IGNORECASE)

        # Compile FAQ intent regexes
        self.faq_rules: List[Dict[str, Any]] = []
        for faq in self.data.get("faqs", []):
            pattern_str = faq.get("regex_pattern")
            if not pattern_str:
                # Build regex pattern from keywords and question tokens
                keywords = faq.get("keywords", [])
                escaped_kws = [re.escape(k) for k in keywords]
                pattern_str = rf"\b({'|'.join(escaped_kws)})\b" if escaped_kws else r".*"
            
            compiled_re = re.compile(pattern_str, re.IGNORECASE)
            self.faq_rules.append({
                "id": faq.get("id"),
                "intent": faq.get("intent"),
                "question": faq.get("question"),
                "answer": faq.get("answer"),
                "keywords": faq.get("keywords", []),
                "regex": compiled_re,
                "regex_source": pattern_str
            })

    def normalize_input(self, text: str) -> str:
        """
        Normalize user input:
        1. Strip leading and trailing whitespace.
        2. Convert to lowercase.
        3. Standardize internal whitespace to single spaces.
        """
        if not text:
            return ""
        cleaned = text.strip().lower()
        cleaned = re.sub(r"\s+", " ", cleaned)
        return cleaned

    def extract_keywords(self, text: str) -> List[str]:
        """
        Extract meaningful word tokens from normalized user input using regex word boundary extraction.
        Filters out common grammatical stop words.
        """
        stop_words = {
            "a", "an", "the", "is", "are", "was", "were", "in", "on", "at",
            "to", "for", "of", "with", "my", "your", "our", "do", "does",
            "can", "will", "i", "you", "we", "they", "me", "it", "this", "that"
        }
        tokens = re.findall(r"\b[a-zA-Z0-9_\-\']+\b", text.lower())
        return [t for t in tokens if t not in stop_words]

    def calculate_confidence(self, user_input: str, rule: Dict[str, Any]) -> Tuple[float, List[str]]:
        """
        Calculate intent confidence score (0.0 to 1.0) and extracted matching keywords.
        Uses a hybrid strategy:
        - Exact regex match bonus
        - Keyword overlap ratio
        - Question token intersection
        """
        matched_keywords: List[str] = []
        confidence = 0.0

        # Check regex pattern match
        regex_matches = rule["regex"].findall(user_input)
        if regex_matches:
            confidence += 0.55
            for m in regex_matches:
                if isinstance(m, tuple):
                    matched_keywords.extend([item for item in m if item])
                elif m:
                    matched_keywords.append(m)

        # Keyword overlap check
        user_tokens = set(self.extract_keywords(user_input))
        rule_keywords = set(k.lower() for k in rule.get("keywords", []))
        common_kws = user_tokens.intersection(rule_keywords)
        if common_kws:
            confidence += 0.35 * (len(common_kws) / max(len(rule_keywords), 1))
            matched_keywords.extend(list(common_kws))

        # Question title token intersection (for direct question similarity)
        q_tokens = set(self.extract_keywords(rule["question"]))
        common_q = user_tokens.intersection(q_tokens)
        if common_q:
            confidence += 0.30 * (len(common_q) / max(len(q_tokens), 1))
            matched_keywords.extend(list(common_q))

        # Deduplicate matched keywords
        unique_matches = list(dict.fromkeys([k.lower() for k in matched_keywords if k]))
        
        # Clamp confidence between 0.0 and 1.0
        final_confidence = min(round(confidence, 2), 1.0)
        return final_confidence, unique_matches

    def identify_intent(self, user_input: str) -> Tuple[Optional[Dict[str, Any]], float, List[str]]:
        """
        Scan all FAQ rules to find the highest-confidence matching intent.
        Returns (matched_rule, confidence_score, matched_keywords).
        """
        best_rule: Optional[Dict[str, Any]] = None
        best_confidence: float = 0.0
        best_matches: List[str] = []

        for rule in self.faq_rules:
            conf, matches = self.calculate_confidence(user_input, rule)
            if conf > best_confidence:
                best_confidence = conf
                best_rule = rule
                best_matches = matches

        return best_rule, best_confidence, best_matches

    def get_fallback_response(self) -> str:
        """Return a helpful, cycled fallback response with suggested topics."""
        fallbacks = self.data.get("fallbacks", [])
        if fallbacks:
            idx = self.turn_count % len(fallbacks)
            return fallbacks[idx]
        return "I'm sorry, I didn't understand that. You can ask about our hours, project submissions, or certificates."

    def get_help_response(self) -> str:
        """Return a formatted list of all available topics and example queries."""
        lines = [
            "Here are the topics I can help you with:",
            "  1. Hours of Operation  -> 'What are your hours of operation?'",
            "  2. Project Submission  -> 'How do I submit my internship project?'",
            "  3. Certificates        -> 'When will I receive my certificate?'",
            "  4. Mentor & Support    -> 'How do I contact student support?'",
            "  5. Requirements        -> 'What are the technical requirements?'",
            "  6. Deadlines           -> 'Can I get an extension on my deadline?'",
            "  7. Grading Criteria    -> 'How is my assignment evaluated?'",
            "",
            "Tip: You can type 'exit', 'quit', or 'bye' at any time to leave."
        ]
        return "\n".join(lines)

    def process_message(self, raw_input: str) -> Dict[str, Any]:
        """
        Core conversational pipeline:
        1. Normalization (strip, lowercase)
        2. State Transition Management (GREETING -> INTENT_IDENTIFICATION -> RESOLUTION -> EXIT)
        3. Regex parsing & Intent recognition
        4. Structured response payload creation
        """
        self.turn_count += 1
        normalized = self.normalize_input(raw_input)

        response_payload: Dict[str, Any] = {
            "turn": self.turn_count,
            "raw_input": raw_input,
            "normalized_input": normalized,
            "previous_state": self.state,
            "current_state": self.state,
            "intent": None,
            "confidence": 0.0,
            "matched_keywords": [],
            "regex_rule": None,
            "response": "",
            "is_exit": False
        }

        # Handle empty input
        if not normalized:
            response_payload["response"] = "Please type a message or ask a question. (Type 'help' for options)"
            return response_payload

        # 1. Check for EXIT command
        if self.exit_regex.search(normalized):
            self.state = STATE_EXIT
            response_payload["current_state"] = STATE_EXIT
            response_payload["intent"] = "exit"
            response_payload["confidence"] = 1.0
            response_payload["is_exit"] = True
            response_payload["response"] = "Thank you for reaching out! Best of luck with your Python projects. Goodbye!"
            self.conversation_history.append(response_payload)
            return response_payload

        # 2. Check for HELP / MENU request
        if self.help_regex.search(normalized):
            self.state = STATE_INTENT_IDENTIFICATION
            response_payload["current_state"] = STATE_INTENT_IDENTIFICATION
            response_payload["intent"] = "help_menu"
            response_payload["confidence"] = 1.0
            response_payload["response"] = self.get_help_response()
            self.conversation_history.append(response_payload)
            return response_payload

        # 3. Check for GREETING command
        if self.greeting_regex.search(normalized) and len(normalized.split()) <= 4:
            self.state = STATE_GREETING
            response_payload["current_state"] = STATE_GREETING
            response_payload["intent"] = "greeting"
            response_payload["confidence"] = 1.0
            response_payload["response"] = (
                "Hello! Welcome to the Datheon Student Support Assistant. "
                "How can I help you today? You can ask about our hours of operation, "
                "internship project submissions, or certificate issuance."
            )
            self.conversation_history.append(response_payload)
            return response_payload

        # 4. Check for GRATITUDE / CLOSING THANKS
        if self.thanks_regex.search(normalized) and self.state == STATE_RESOLUTION:
            response_payload["current_state"] = STATE_RESOLUTION
            response_payload["intent"] = "gratitude"
            response_payload["confidence"] = 0.95
            response_payload["response"] = "You're very welcome! Let me know if there's anything else I can clarify."
            self.conversation_history.append(response_payload)
            return response_payload

        # 5. Intent Identification via Regex & Keywords
        self.state = STATE_INTENT_IDENTIFICATION
        rule, confidence, matches = self.identify_intent(normalized)

        # Confidence Threshold: 0.35
        if rule and confidence >= 0.35:
            self.state = STATE_RESOLUTION
            self.last_matched_intent = rule["intent"]
            response_payload["current_state"] = STATE_RESOLUTION
            response_payload["intent"] = rule["intent"]
            response_payload["confidence"] = confidence
            response_payload["matched_keywords"] = matches
            response_payload["regex_rule"] = rule.get("regex_source")
            
            # Contextual resolution response
            response_payload["response"] = rule["answer"]
        else:
            # Low confidence -> Fallback
            response_payload["current_state"] = STATE_INTENT_IDENTIFICATION
            response_payload["intent"] = "fallback_unknown"
            response_payload["confidence"] = confidence
            response_payload["matched_keywords"] = matches
            response_payload["response"] = self.get_fallback_response()

        self.conversation_history.append(response_payload)
        return response_payload

    def reset_conversation(self) -> None:
        """Reset conversation state and turn history."""
        self.state = STATE_INIT
        self.turn_count = 0
        self.last_matched_intent = None
        self.conversation_history.clear()


def print_banner() -> None:
    """Render startup banner for the console assistant."""
    banner = f"""
{colorize("╔═══════════════════════════════════════════════════════════════════════════╗", COLOR_PURPLE)}
{colorize("║", COLOR_PURPLE)}  {colorize("DATHEON PYTHON PROGRAMMING - TASK 04", COLOR_BOLD + COLOR_WHITE)}                                  {colorize("║", COLOR_PURPLE)}
{colorize("║", COLOR_PURPLE)}  {colorize("Rule-Based Interactive Terminal Assistant / Chatbot", COLOR_MAGENTA)}                  {colorize("║", COLOR_PURPLE)}
{colorize("╚═══════════════════════════════════════════════════════════════════════════╝", COLOR_PURPLE)}
  {colorize("• Powered by:", COLOR_DIM)} Python 3.8+ | Standard Library (re, json, sys)
  {colorize("• Architecture:", COLOR_DIM)} Multi-Intent Recognition & 4-Stage State Machine
  {colorize("• Supported Queries:", COLOR_DIM)} Hours of Operation, Project Submission, Certificates
  {colorize("• Commands:", COLOR_DIM)} Type {colorize("'help'", COLOR_CYAN)} for topics or {colorize("'exit'", COLOR_YELLOW)} to quit
"""
    print(banner)


def run_interactive_cli() -> None:
    """Launch the interactive terminal session."""
    bot = RuleBasedChatbot()
    print_banner()

    # Initial Welcome Message
    print(f"{colorize('Assistant:', COLOR_BOLD + COLOR_PURPLE)} Hello! I'm your Datheon Student Support Assistant.")
    print(f"           How can I help you today with your internship or projects?")
    print(f"           {colorize('(State: GREETING | Type your question below)', COLOR_DIM)}\n")

    while True:
        try:
            user_input = input(f"{colorize('You: ', COLOR_BOLD + COLOR_CYAN)}").strip()
            if not user_input:
                continue

            result = bot.process_message(user_input)

            # Display intent metadata tag
            state_tag = colorize(f"[{result['current_state']}]", COLOR_DIM)
            if result.get("intent") and result["intent"] not in ["greeting", "exit", "help_menu", "fallback_unknown"]:
                intent_info = colorize(f"(Intent: {result['intent']} | Conf: {int(result['confidence']*100)}%)", COLOR_GREEN)
            elif result.get("intent") == "fallback_unknown":
                intent_info = colorize(f"(Low Confidence: {int(result['confidence']*100)}% -> Fallback)", COLOR_YELLOW)
            else:
                intent_info = ""

            print(f"\n{colorize('Assistant:', COLOR_BOLD + COLOR_PURPLE)} {state_tag} {intent_info}")
            print(f"{result['response']}\n")

            if result["is_exit"]:
                break

        except (KeyboardInterrupt, EOFError):
            print(f"\n\n{colorize('Session closed. Goodbye!', COLOR_PURPLE)}")
            break


if __name__ == "__main__":
    run_interactive_cli()
