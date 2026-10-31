# Stock Portfolio Performance Tracker

A comprehensive investment portfolio tracking utility that calculates real-time portfolio valuation, percentage gain/loss per holding, and automatically logs transaction summaries to `portfolio_summary.csv`.

---

## 📋 Task 2 Requirements & Technical Approach

1. **Script Architecture:** `portfolio.py` manages positions, calculations, and CSV file operations.
2. **Dictionary Position Storage:** Holds positions in a structured dictionary:
   ```python
   {
       "AAPL": {
           "symbol": "AAPL",
           "name": "Apple Inc.",
           "sector": "Information Technology",
           "shares": 15.0,
           "buy_price": 185.00,
           "current_price": 232.50,
           "invested_capital": 2775.00,
           "current_value": 3487.50,
           "gain_loss": 712.50,
           "gain_loss_pct": 25.68
       }
   }
   ```
3. **Dataset Cross-Referencing:** Loads `constituents.csv` (S&P 500 company directory with 503 securities) to resolve company names, GICS sectors, and sub-industries.
4. **Valuation Engine:**
   - **Invested Capital:** $\text{Shares} \times \text{Buy Price}$
   - **Current Market Value:** $\text{Shares} \times \text{Current Price}$
   - **Gain/Loss ($):** $\text{Current Value} - \text{Invested Capital}$
   - **Gain/Loss (%):** $\frac{\text{Gain/Loss}}{\text{Invested Capital}} \times 100$
5. **CSV Persistence (`portfolio_summary.csv`):**
   - Automatically writes transaction and performance summaries using Python's built-in `csv` module.
   - Includes full column headers, timestamped entries, and an aggregate summary totals row.
6. **Formatted Console Output:** Clean tabular presentation with ANSI colored highlights (green for gains, red for losses).

---

## 🗂️ Project File Structure

```
Stock Portfolio Performance Tracker/
├── portfolio.py          # Main executable portfolio tracking utility
├── constituents.csv      # Complete S&P 500 ticker & company dataset (503 companies)
├── portfolio_summary.csv # Auto-generated transaction & valuation CSV output
├── test_portfolio.py     # Unit test suite verifying calculations and CSV output
├── requirements.txt      # Python 3 standard library environment details
└── README.md             # Project documentation & instructions
```

---

## 🚀 How to Run

### Run the Portfolio CLI Tracker:
```bash
python3 "Stock Portfolio Performance Tracker/portfolio.py"
```

### Run Unit Tests:
```bash
python3 -m unittest "Stock Portfolio Performance Tracker/test_portfolio.py"
```

---

## 📊 CSV Export Format (`portfolio_summary.csv`)

| Column | Description |
|---|---|
| `Timestamp` | Date and time the report was exported |
| `Symbol` | Stock ticker symbol (e.g. AAPL, NVDA) |
| `Company_Name` | Company name from S&P 500 constituents |
| `GICS_Sector` | Industry sector classification |
| `Shares` | Quantity of shares held |
| `Buy_Price` | Weighted average purchase price ($) |
| `Current_Price` | Current market quote ($) |
| `Invested_Capital` | Total money invested ($) |
| `Current_Value` | Current market value ($) |
| `Gain_Loss_Dollar`| Dollar gain or loss ($) |
| `Gain_Loss_Percent`| Percentage return (%) |
