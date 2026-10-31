# Datheon_Python_Programming 🚀

A production-grade Python 3 programming workspace developed for **Datheon**, featuring four standalone, fully tested terminal applications and an integrated dual-mode web dashboard with Gmail-style sidebar navigation.

Every task in this repository is built using **100% Python standard library modules** (`random`, `csv`, `os`, `shutil`, `pathlib`, `re`, `json`, `sys`, `unittest`), requiring **zero external pip dependencies** to run. Each task can be executed directly as a standalone CLI script or explored interactively inside the web application.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Repository Structure](#-repository-structure)
- [Task 01: Hangman Word Guessing Game](#-task-01-hangman-word-guessing-game)
- [Task 02: Stock Portfolio Performance Tracker](#-task-02-stock-portfolio-performance-tracker)
- [Task 03: Automated File Organizer & Cleanup Utility](#-task-03-automated-file-organizer--cleanup-utility)
- [Task 04: Rule-Based Interactive Terminal Assistant / Chatbot](#-task-04-rule-based-interactive-terminal-assistant--chatbot)
- [Test Suite & Verification (28/28 Passing)](#-test-suite--verification-2828-passing)
- [Interactive Web Dashboard (React + TypeScript)](#-interactive-web-dashboard-react--typescript)
- [Vercel Deployment Compatibility](#-vercel-deployment-compatibility)
- [Author & License](#-author--license)

---

## 🏗 Overview & Architecture

`Datheon_Python_Programming` demonstrates fundamental and advanced Python programming principles across four distinct domains:

| Task # | Project Name | Domain / Focus | Key Standard Modules | UI Shelf Color |
| :--- | :--- | :--- | :--- | :--- |
| **Task 01** | **Hangman Word Guessing Game** | Game Loops, Strings, Sets, ASCII Art | `random`, `sys` | 🟠 Amber / Warm Orange |
| **Task 02** | **Stock Portfolio Performance Tracker** | Finance, Data Structures, CSV I/O, Valuation | `csv`, `json`, `urllib` | 🟢 Emerald Green |
| **Task 03** | **Automated File Organizer** | OS Automation, Filesystem, Relocation, Collision Avoidance | `os`, `shutil`, `pathlib` | 🔵 Sky Blue |
| **Task 04** | **Rule-Based Interactive Assistant** | Conversational State Machines, Regex NLP, JSON FAQs | `re`, `json`, `sys` | 🟣 Indigo / Violet |

### Design Principles:
1. **Zero External Dependencies**: All core logic runs out-of-the-box on standard Python 3.8+ installations.
2. **Defensive Programming**: Comprehensive input normalization, type validation, collision resolution, and exception guards (`PermissionError`, `FileNotFoundError`, `ValueError`).
3. **Automated Unit Testing**: Complete unit test coverage for every module with 28 passing test cases.
4. **Dual Execution Paradigm**: Every task includes both a standalone terminal executable (`.py`) and a mirrored web-based interactive runner.

---

## 📂 Repository Structure

```text
Datheon_Python_Programming/
│
├── README.md                                  # Complete repository documentation (this file)
│
├── Hangman Word Guessing Game/                # [TASK 01]
│   ├── hangman.py                             # Core game engine with ASCII gallows & loop
│   ├── words.txt                              # Curated dictionary of 60+ English words
│   ├── test_hangman.py                        # 7 unit tests covering game mechanics
│   ├── requirements.txt                       # Python standard library specification
│   └── README.md                              # Dedicated documentation for Task 01
│
├── Stock Portfolio Performance Tracker/       # [TASK 02]
│   ├── portfolio.py                           # Valuation engine, live/fallback pricing & CSV exporter
│   ├── constituents.csv                       # Official S&P 500 company ticker dataset
│   ├── portfolio_summary.csv                  # Generated transaction log and valuation report
│   ├── test_portfolio.py                      # 7 unit tests covering financial formulas
│   ├── requirements.txt                       # Python standard library specification
│   └── README.md                              # Dedicated documentation for Task 02
│
├── Automated File Organizer/                  # [TASK 03]
│   ├── organizer.py                           # Filesystem scanner, sorter & collision resolver
│   ├── test_organizer.py                      # 4 unit tests verifying file relocation
│   ├── requirements.txt                       # Python standard library specification
│   └── README.md                              # Dedicated documentation for Task 03
│
├── Rule-Based Interactive Terminal Assistant/ # [TASK 04]
│   ├── chatbot.py                             # 4-stage conversational state machine & regex parser
│   ├── sample_faq.json                        # Structured FAQ dataset with intents & regex patterns
│   ├── test_chatbot.py                        # 10 unit tests covering state machine & intents
│   ├── requirements.txt                       # Python standard library specification
│   └── README.md                              # Dedicated documentation for Task 04
│
├── src/                                       # Modern React + TypeScript Web Dashboard
│   ├── App.tsx                                # Main workspace view with Gmail-style sidebar
│   ├── components/                            # Interactive simulators for Tasks 1-4
│   │   ├── HangmanGame.tsx                    # Interactive Hangman with canvas/ASCII visualizer
│   │   ├── StockPortfolio.tsx                 # Real-time portfolio manager with S&P 500 search
│   │   ├── FileOrganizer.tsx                  # Drag-and-drop virtual filesystem organizer
│   │   └── ChatbotAssistant.tsx               # Terminal chatbot emulator with intent inspector
│   ├── main.tsx                               # React root entry
│   └── index.css                              # Tailwind CSS styling
│
├── api/                                       # Serverless API routes for Vercel deployment
├── app.py / index.py / main.py                # Python entrypoint bridges
├── vercel.json                                # Vercel deployment configuration
└── package.json                               # Web dashboard build configuration
```

---

## 🎯 Task 01: Hangman Word Guessing Game

### Objective
Build an interactive, modular console game implementing string manipulation, sets, state tracking, and procedural ASCII art visualization.

### Key Capabilities
- **Word Selection**: Selects random words from `words.txt` or a curated default collection using `random.choice()`.
- **Masked Word Display**: Displays unguessed characters as underscores with letter spacing (e.g. `_ A _ H E O N`).
- **Gallows Progression**: Displays 7 progressive ASCII gallows stages corresponding to remaining attempts (from stage 0 with an empty gallows to stage 6 with the full hangman figure).
- **Duplicate Prevention**: Tracks all previous guesses (`guessed_letters` set). Guesses already made are flagged without deducting penalty attempts.
- **Input Validation**: Rejects numbers, special symbols, whitespace, and multi-character inputs with helpful user feedback.
- **Replay Loop**: Prompts the player to start a new game upon victory or defeat without terminating the script.

### Running Task 01 (CLI)
```bash
python3 "Hangman Word Guessing Game/hangman.py"
```

### Running Tests
```bash
python3 -m unittest "Hangman Word Guessing Game/test_hangman.py"
```

---

## 📈 Task 02: Stock Portfolio Performance Tracker

### Objective
Construct an investment portfolio tracking utility that manages stock positions, computes real-time portfolio valuation and P&L metrics, and exports transaction summaries to a structured CSV file.

### Key Capabilities
- **S&P 500 Dataset Integration**: Bundles official S&P 500 ticker symbols, company names, and sectors (`constituents.csv`) for rapid lookup and validation.
- **Position Tracking**: Stores holdings in an in-memory dictionary keyed by ticker symbol, tracking total shares and weighted average purchase price.
- **Financial Metric Engine**:
  $$\text{Current Value} = \text{Quantity} \times \text{Current Price}$$
  $$\text{Gain / Loss (\$)} = \text{Current Value} - \text{Total Invested}$$
  $$\text{Gain / Loss (\%)} = \left(\frac{\text{Current Value} - \text{Total Invested}}{\text{Total Invested}}\right) \times 100$$
- **Live Pricing with Offline Fallback**: Fetches live quotes from Yahoo Finance API via standard library `urllib.request`. If offline or rate-limited, safely falls back to standard baseline benchmark prices.
- **CSV Logging & Export**: Automatically logs all calculations into `portfolio_summary.csv` using Python's built-in `csv.writer` with proper column headers (`Ticker, Shares, Avg Buy Price, Current Price, Invested Capital, Current Value, Profit/Loss ($), Profit/Loss (%)`).
- **Interactive CLI & Batch Mode**: Supports interactive addition/removal of stocks, portfolio viewing, and direct command-line arguments.

### Running Task 02 (CLI)
```bash
python3 "Stock Portfolio Performance Tracker/portfolio.py"
```

### Running Tests
```bash
python3 -m unittest "Stock Portfolio Performance Tracker/test_portfolio.py"
```

---

## 🗂 Task 03: Automated File Organizer & Cleanup Utility

### Objective
Develop an autonomous desktop automation utility that organizes cluttered directories (such as Downloads or Desktop folders) by sorting files into category subdirectories based on extension mappings, safely handling permission exceptions and naming collisions.

### Key Capabilities
- **Extension Taxonomy**: Maps 40+ common file extensions to organized folders:
  - `Documents/`: `.pdf`, `.docx`, `.doc`, `.txt`, `.rtf`, `.odt`, `.md`
  - `Images/`: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.tiff`
  - `Videos/`: `.mp4`, `.mkv`, `.avi`, `.mov`, `.wmv`, `.flv`
  - `Archives/`: `.zip`, `.tar`, `.gz`, `.rar`, `.7z`, `.bz2`
  - `Code/`: `.py`, `.js`, `.ts`, `.html`, `.css`, `.json`, `.java`, `.cpp`, `.c`
  - `Audio/`: `.mp3`, `.wav`, `.aac`, `.flac`, `.ogg`
  - `Spreadsheets/`: `.xlsx`, `.xls`, `.csv`
  - `Presentations/`: `.pptx`, `.ppt`
  - `Other/`: Fallback for unknown extensions
- **High-Performance Scanning**: Uses `os.scandir()` for fast iterator-based directory traversal without buffering entire file trees in memory.
- **Collision Resolution**: If a file with the same name already exists in the destination folder, automatically resolves collisions by appending an increment counter (`report.pdf` $\rightarrow$ `report_1.pdf` $\rightarrow$ `report_2.pdf`).
- **Exception Guards**: Wraps operations in `try-except` blocks catching `PermissionError`, `FileNotFoundError`, and `OSError`, ensuring the script never crashes on locked files.
- **Dry-Run Simulation**: Includes a `--dry-run` flag allowing users to preview all proposed relocation actions before modifying the disk.
- **Detailed Audit Log**: Outputs a structured summary table showing files scanned, moved, skipped, and errors encountered.

### Running Task 03 (CLI)
```bash
# Organize a target directory
python3 "Automated File Organizer/organizer.py" --path "/path/to/cluttered/folder"

# Dry-run preview without modifying files
python3 "Automated File Organizer/organizer.py" --path "/path/to/cluttered/folder" --dry-run
```

### Running Tests
```bash
python3 -m unittest "Automated File Organizer/test_organizer.py"
```

---

## 🤖 Task 04: Rule-Based Interactive Terminal Assistant / Chatbot

### Objective
Implement a rule-based customer support and product assistant that parses user input using regex and keyword extraction, navigates a 4-stage conversational state machine, queries an external JSON knowledge base, and handles low-confidence fallbacks.

### Key Capabilities
- **4-Stage Conversational State Machine**:
  ```text
  [1. GREETING] ──> [2. INTENT IDENTIFICATION] ──> [3. RESOLUTION] ──> [4. EXIT]
          ^                                                 │
          └───────────────── (Follow-up Queries) ───────────┘
  ```
- **Text Normalization**: Strips punctuation, trims excess whitespace, and converts user input to lowercase for robust pattern matching.
- **Regex & Keyword Engine**: Matches user inquiries against compiled regular expression patterns (`r"\b(hour|hours|open|close|schedule|time)\b"`, `r"\b(shipping|delivery|ship|track)\b"`, etc.).
- **External JSON Knowledge Base**: Dynamically loads questions, intent tags, keywords, and responses from `sample_faq.json` (covering business hours, shipping, returns, order tracking, payment methods, accounts, and security).
- **Graceful Fallback Handling**: If an inquiry cannot be matched with confidence, provides a polite fallback message with suggested topics and keywords.
- **Clean Exit Commands**: Recognizes termination keywords (`'bye'`, `'exit'`, `'quit'`, `'goodbye'`) to gracefully conclude the conversation.

### Running Task 04 (CLI)
```bash
python3 "Rule-Based Interactive Terminal Assistant/chatbot.py"
```

### Running Tests
```bash
python3 -m unittest "Rule-Based Interactive Terminal Assistant/test_chatbot.py"
```

---

## 🧪 Test Suite & Verification (28/28 Passing)

Every task includes automated unit tests written with Python's built-in `unittest` framework. You can run all 28 unit tests across all four projects simultaneously with a single command:

```bash
python3 -m unittest \
  "Hangman Word Guessing Game/test_hangman.py" \
  "Stock Portfolio Performance Tracker/test_portfolio.py" \
  "Automated File Organizer/test_organizer.py" \
  "Rule-Based Interactive Terminal Assistant/test_chatbot.py"
```

### Test Suite Breakdown:

| Test File | Target Module | Test Count | Key Scenarios Tested |
| :--- | :--- | :---: | :--- |
| `test_hangman.py` | `hangman.py` | **7** | Masking logic, correct guess tracking, incorrect guess deductions, duplicate guess prevention, victory detection, defeat detection, random word selection. |
| `test_portfolio.py` | `portfolio.py` | **7** | Position addition, weighted average price calculation, portfolio valuation, profit/loss calculations ($ and %), position removal, CSV export integrity. |
| `test_organizer.py` | `organizer.py` | **4** | Extension classification, destination path routing, safe directory creation, file naming collision handling (`file_1.txt`). |
| `test_chatbot.py` | `chatbot.py` | **10** | Input normalization, greeting intent, business hours intent, shipping intent, return policy intent, pricing intent, contact intent, unknown fallback, exit command detection, JSON dataset loading. |
| **Total** | | **28** | **100% Pass Rate (0 failures, 0 errors)** |

---

## 💻 Interactive Web Dashboard (React + TypeScript)

In addition to terminal execution, this workspace includes an interactive, browser-based single-page application built with **React**, **TypeScript**, and **Tailwind CSS**.

### Key Interface Features:
- **Permanent Workspace Branding**: Uniformly branded as `Datheon_Python_Programming` across the header, navigation drawer, and application cards.
- **Ascending Sidebar Shelves**: Gmail-style collapsible sidebar ordered sequentially:
  - **Task 01**: Hangman Word Guessing Game (Amber badge & theme)
  - **Task 02**: Stock Portfolio Performance Tracker (Emerald Green badge & theme)
  - **Task 03**: Automated File Organizer & Cleanup Utility (Sky Blue badge & theme)
  - **Task 04**: Rule-Based Interactive Terminal Assistant (Violet badge & theme)
- **Live Interactive Simulators**:
  - Play Hangman directly in the browser with an interactive on-screen keyboard and live ASCII gallows renderer.
  - Search S&P 500 stocks, simulate portfolio performance, inspect gain/loss metrics, and download generated CSVs.
  - Test the file organizer utility in an interactive virtual filesystem simulator with drag-and-drop and category breakdown charts.
  - Chat in real-time with the rule-based assistant in a simulated terminal environment with intent inspector and FAQ reference tabs.

### Starting the Web Dashboard Locally:
```bash
npm install
npm run dev
```
The application will launch on `http://localhost:3000`.

---

## 🌐 Vercel Deployment Compatibility

To prevent deployment failures when hosting on platforms like Vercel, this repository includes:
1. **`vercel.json`**: Explicit routing and build configuration for both the static React frontend and Python runtime endpoints.
2. **Standard Entry Points**: `app.py`, `index.py`, and `main.py` entrypoint bridges defined at the root to ensure zero build errors across diverse serverless hosting providers.
3. **`pyproject.toml`**: Configured project metadata defining the runtime entrypoint.

---

## 👨‍💻 Author & Acknowledgments

- **Organization**: Datheon
- **Project**: Datheon Python Programming Internship Tasks
- **Language**: Python 3.8+ (Standard Library) / TypeScript / React
- **Status**: Completed & Verified ✅
