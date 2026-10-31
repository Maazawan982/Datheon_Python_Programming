# Task 04: Rule-Based Interactive Terminal Assistant / Chatbot

A responsive, modular conversational assistant featuring multi-intent recognition, regular expression parsing, JSON knowledge base ingestion, and a formal 4-stage state machine.

Built for **Datheon_Python_Programming**.

---

## 📌 Problem Statement & Requirements

Implement a rule-based customer support or product assistant. The bot parses user input for keywords and regular expressions, handles queries regarding business hours, product FAQs, and returns contextual responses. It includes fallback handling for unrecognized queries and clean exit commands (`'bye'`, `'exit'`, `'quit'`).

### Core Features:
1. **Interactive Console Assistant (`chatbot.py`)**: Terminal conversational loop with styled prompts, state tracking tags, and intent confidence display.
2. **JSON Dataset Ingestion (`sample_faq.json`)**: Loads greetings, clean exit commands, and rich FAQ entries with regex patterns, keywords, and verified answers.
3. **Input Normalization Pipeline**: Lowercase standardization, whitespace trimming, and regex token extraction with stop-word filtration.
4. **4-Stage Conversational State Machine**:
   - `GREETING`: Welcome protocol and interaction initiation.
   - `INTENT_IDENTIFICATION`: Pattern scanning and confidence scoring.
   - `RESOLUTION`: Delivering verified answers and contextual follow-ups.
   - `EXIT`: Graceful session teardown upon receiving exit commands.
5. **Graceful Fallbacks**: Dynamic feedback and rephrasing suggestions when confidence drops below 35%.
6. **Zero External Dependencies**: Pure Python 3 standard library (`re`, `json`, `os`, `sys`, `unittest`).

---

## 🗂️ File Structure

```
Rule-Based Interactive Terminal Assistant/
├── chatbot.py            # Main conversational engine and CLI interactive runner
├── sample_faq.json       # Structured FAQ knowledge base dataset
├── test_chatbot.py       # Exhaustive unittest verification suite (10 test cases)
├── requirements.txt      # Python standard library documentation
└── README.md             # Architecture documentation and execution guide
```

---

## 🚀 How to Run

### Interactive Terminal Mode
Run the chatbot directly from your terminal:
```bash
python3 "Rule-Based Interactive Terminal Assistant/chatbot.py"
```

### Run Unit Tests
Execute the 10-point test suite:
```bash
python3 -m unittest "Rule-Based Interactive Terminal Assistant/test_chatbot.py"
```

---

## 🧠 Conversational State Machine

```
               [ User Input ]
                     │
            ┌────────┴────────┐
            ▼                 ▼
     [ Exit Command? ] ──► [ STATE: EXIT ] ──► (Terminates CLI)
            │
            ▼
     [ Greeting? ]    ──► [ STATE: GREETING ] ──► "Hello! How can I help you today?"
            │
            ▼
 [ STATE: INTENT_IDENTIFICATION ]
   ├── Match FAQ Regex & Keywords?
   │     ├─ Yes (Confidence ≥ 0.35) ──► [ STATE: RESOLUTION ] (Deliver Answer)
   │     └─ No  (Confidence < 0.35) ──► (Trigger Graceful Fallback)
```

---

## 📊 Sample Queries & Expected Responses

| User Query | Recognized Intent | State | Response Summary |
|------------|-------------------|-------|------------------|
| `"hello"` | `greeting` | `GREETING` | Welcomes user to Datheon Support |
| `"What are your hours of operation?"` | `hours_of_operation` | `RESOLUTION` | Mon–Fri 9:00 AM – 6:00 PM IST |
| `"How do I submit my internship project?"` | `project_submission` | `RESOLUTION` | Submit public GitHub repo link |
| `"When will I receive my certificate?"` | `certificate_issuance` | `RESOLUTION` | 3–5 business days post-review |
| `"Can I get a deadline extension?"` | `deadline_extension` | `RESOLUTION` | Up to 48 hours via portal |
| `"help"` | `help_menu` | `INTENT_IDENTIFICATION` | Displays list of supported topics |
| `"bye"` | `exit` | `EXIT` | Farewell and session end |
