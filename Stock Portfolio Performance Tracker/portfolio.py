#!/usr/bin/env python3
"""
=============================================================================
Task 2: Stock Portfolio Performance Tracker
=============================================================================
Calculate real-time portfolio valuation and persist performance logs to CSV.

Requirements fulfilled:
1. Store portfolio positions in a structured dictionary.
2. Cross-reference ticker symbols, company names, and sectors from constituents.csv.
3. Compute total invested capital vs. current market value.
4. Calculate percentage and dollar gain/loss per holding and total portfolio.
5. Export structured transaction & performance summary to 'portfolio_summary.csv'.
6. Formatted console output with clean tabular reporting.
=============================================================================
"""

import os
import sys
import csv
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any

# Current script and workspace paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONSTITUENTS_CSV = os.path.join(SCRIPT_DIR, "constituents.csv")
DEFAULT_SUMMARY_CSV = os.path.join(SCRIPT_DIR, "portfolio_summary.csv")

# Baseline reference prices for top S&P 500 constituents
BASELINE_MARKET_PRICES: Dict[str, float] = {
    "AAPL": 232.50,
    "MSFT": 431.20,
    "NVDA": 141.80,
    "GOOGL": 169.40,
    "AMZN": 188.75,
    "META": 585.30,
    "TSLA": 269.19,
    "BRK.B": 454.60,
    "JPM": 222.80,
    "V": 284.10,
    "UNH": 568.40,
    "JNJ": 161.90,
    "XOM": 120.30,
    "WMT": 82.50,
    "PG": 168.10,
    "MA": 508.20,
    "LLY": 824.50,
    "HD": 402.10,
    "CVX": 151.30,
    "ABBV": 188.90,
    "COST": 910.40,
    "BAC": 42.15,
    "KO": 67.80,
    "PEP": 174.50,
    "CRM": 288.70,
    "NFLX": 755.20,
    "AMD": 156.30,
    "ADBE": 505.40,
    "DIS": 96.50,
    "INTC": 22.80,
}

# ANSI Colors for terminal output
class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

    @classmethod
    def is_supported(cls) -> bool:
        return hasattr(sys.stdout, "isatty") and sys.stdout.isatty() and os.name != "nt"


def colorize(text: str, color_code: str) -> str:
    """Format string with ANSI escape codes if terminal supports it."""
    if Colors.is_supported():
        return f"{color_code}{text}{Colors.RESET}"
    return text


def load_constituents(csv_path: Optional[str] = None) -> Dict[str, Dict[str, str]]:
    """
    Load S&P 500 constituents from constituents.csv.
    Returns a dictionary keyed by uppercase Symbol.
    """
    path = csv_path or CONSTITUENTS_CSV
    companies: Dict[str, Dict[str, str]] = {}

    if not os.path.isfile(path):
        return companies

    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for row in reader:
                sym = row.get("Symbol", "").strip().upper()
                if sym:
                    companies[sym] = {
                        "symbol": sym,
                        "name": row.get("Security", sym),
                        "sector": row.get("GICS Sector", "General"),
                        "sub_industry": row.get("GICS Sub-Industry", ""),
                        "headquarters": row.get("Headquarters Location", ""),
                        "date_added": row.get("Date added", ""),
                    }
    except Exception as e:
        print(f"Warning: Could not load constituents from {path}: {e}")

    return companies


def fetch_live_price(symbol: str, timeout: float = 2.0) -> Optional[float]:
    """
    Attempt to fetch real-time stock quote from public market quote endpoints via urllib.
    Falls back gracefully if network is unavailable or rate-limited.
    """
    import json
    import urllib.request
    sym = symbol.strip().upper()
    try:
        # Query free public financial quote API
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval=1d&range=1d"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PythonStockTracker/1.0"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                meta = data.get("chart", {}).get("result", [{}])[0].get("meta", {})
                regular_price = meta.get("regularMarketPrice")
                if regular_price and isinstance(regular_price, (int, float)):
                    return round(float(regular_price), 2)
    except Exception:
        # Graceful fallback on network timeout or offline mode
        pass
    return None


def get_current_price(
    symbol: str,
    override_price: Optional[float] = None,
    allow_live_fetch: bool = True
) -> float:
    """
    Retrieve market price for a ticker.
    Hierarchy:
    1. User override if provided.
    2. Real-time live quote via online endpoint (if enabled and accessible).
    3. Baseline reference prices for S&P 500 constituents.
    4. Deterministic hash-based price model for any other ticker.
    """
    if override_price is not None and override_price > 0:
        return round(override_price, 2)

    sym = symbol.strip().upper()

    # Attempt live quote lookup if enabled
    if allow_live_fetch:
        live = fetch_live_price(sym)
        if live is not None and live > 0:
            return live

    # Baseline reference prices for top constituents
    if sym in BASELINE_MARKET_PRICES:
        return BASELINE_MARKET_PRICES[sym]

    # Deterministic fallback price based on ticker hash for reproducibility
    hash_val = sum(ord(c) * (i + 1) for i, c in enumerate(sym))
    fallback = round(45.0 + (hash_val % 350) + 0.50, 2)
    return fallback


class PortfolioTracker:
    """Core investment portfolio tracker managing holdings, valuation, and persistence."""

    def __init__(self, constituents_file: Optional[str] = None):
        self.constituents = load_constituents(constituents_file)
        # Main portfolio dictionary: Symbol -> Position Dict
        self.positions: Dict[str, Dict[str, Any]] = {}

    def add_position(
        self,
        symbol: str,
        shares: float,
        buy_price: float,
        current_price: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Add or update a stock position in the portfolio dictionary.
        Validates shares > 0 and buy_price > 0.
        """
        sym = symbol.strip().upper()
        if shares <= 0:
            raise ValueError(f"Shares must be positive. Received: {shares}")
        if buy_price <= 0:
            raise ValueError(f"Buy price must be positive. Received: {buy_price}")

        company_info = self.constituents.get(sym, {
            "symbol": sym,
            "name": f"{sym} Corporation",
            "sector": "Unclassified"
        })

        curr_price = get_current_price(sym, current_price)

        # If already exists, compute average cost basis
        if sym in self.positions:
            existing = self.positions[sym]
            total_shares = existing["shares"] + shares
            total_cost = (existing["shares"] * existing["buy_price"]) + (shares * buy_price)
            avg_buy_price = round(total_cost / total_shares, 2)
            shares = total_shares
            buy_price = avg_buy_price

        invested_capital = round(shares * buy_price, 2)
        current_value = round(shares * curr_price, 2)
        gain_loss = round(current_value - invested_capital, 2)
        gain_loss_pct = round((gain_loss / invested_capital) * 100, 2) if invested_capital > 0 else 0.0

        position = {
            "symbol": sym,
            "name": company_info.get("name", sym),
            "sector": company_info.get("sector", "General"),
            "shares": round(shares, 4),
            "buy_price": round(buy_price, 2),
            "current_price": round(curr_price, 2),
            "invested_capital": invested_capital,
            "current_value": current_value,
            "gain_loss": gain_loss,
            "gain_loss_pct": gain_loss_pct,
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        self.positions[sym] = position
        return position

    def remove_position(self, symbol: str) -> bool:
        """Remove a position from the portfolio."""
        sym = symbol.strip().upper()
        if sym in self.positions:
            del self.positions[sym]
            return True
        return False

    def update_market_price(self, symbol: str, new_price: float):
        """Update current market price and recalculate gain/loss metrics."""
        sym = symbol.strip().upper()
        if sym not in self.positions:
            raise KeyError(f"Ticker '{sym}' not found in portfolio.")

        pos = self.positions[sym]
        pos["current_price"] = round(new_price, 2)
        pos["current_value"] = round(pos["shares"] * new_price, 2)
        pos["gain_loss"] = round(pos["current_value"] - pos["invested_capital"], 2)
        pos["gain_loss_pct"] = round(
            (pos["gain_loss"] / pos["invested_capital"]) * 100, 2
        ) if pos["invested_capital"] > 0 else 0.0
        pos["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def refresh_market_prices(self, use_live: bool = True) -> int:
        """
        Refresh current market prices for all positions using live online quote or dataset baseline.
        Returns count of refreshed holdings.
        """
        count = 0
        for sym in list(self.positions.keys()):
            new_p = get_current_price(sym, allow_live_fetch=use_live)
            self.update_market_price(sym, new_p)
            count += 1
        return count

    def calculate_totals(self) -> Dict[str, Any]:
        """Compute aggregate portfolio summary totals."""
        total_invested = round(sum(p["invested_capital"] for p in self.positions.values()), 2)
        total_value = round(sum(p["current_value"] for p in self.positions.values()), 2)
        total_gain_loss = round(total_value - total_invested, 2)
        total_gain_loss_pct = round(
            (total_gain_loss / total_invested) * 100, 2
        ) if total_invested > 0 else 0.0

        # Best & worst performers
        sorted_by_pct = sorted(
            self.positions.values(),
            key=lambda x: x["gain_loss_pct"],
            reverse=True
        )

        best_performer = sorted_by_pct[0] if sorted_by_pct else None
        worst_performer = sorted_by_pct[-1] if sorted_by_pct else None

        return {
            "total_positions": len(self.positions),
            "total_invested": total_invested,
            "total_value": total_value,
            "total_gain_loss": total_gain_loss,
            "total_gain_loss_pct": total_gain_loss_pct,
            "best_performer": best_performer,
            "worst_performer": worst_performer,
        }

    def export_to_csv(self, filename: Optional[str] = None) -> str:
        """
        Write the portfolio summary to an external CSV file using Python's built-in csv module.
        """
        target_path = filename or DEFAULT_SUMMARY_CSV
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        headers = [
            "Timestamp",
            "Symbol",
            "Company_Name",
            "GICS_Sector",
            "Shares",
            "Buy_Price",
            "Current_Price",
            "Invested_Capital",
            "Current_Value",
            "Gain_Loss_Dollar",
            "Gain_Loss_Percent",
        ]

        # Ensure directory exists
        os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)

        with open(target_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)

            for pos in sorted(self.positions.values(), key=lambda p: p["symbol"]):
                writer.writerow([
                    timestamp,
                    pos["symbol"],
                    pos["name"],
                    pos["sector"],
                    f"{pos['shares']:.4f}",
                    f"{pos['buy_price']:.2f}",
                    f"{pos['current_price']:.2f}",
                    f"{pos['invested_capital']:.2f}",
                    f"{pos['current_value']:.2f}",
                    f"{pos['gain_loss']:+.2f}",
                    f"{pos['gain_loss_pct']:+.2f}%",
                ])

            # Write summary footer row
            totals = self.calculate_totals()
            writer.writerow([])
            writer.writerow([
                "SUMMARY_TOTALS",
                f"COUNT: {totals['total_positions']}",
                "",
                "",
                "",
                "",
                "",
                f"{totals['total_invested']:.2f}",
                f"{totals['total_value']:.2f}",
                f"{totals['total_gain_loss']:+.2f}",
                f"{totals['total_gain_loss_pct']:+.2f}%",
            ])

        return target_path

    def print_formatted_summary(self):
        """Render formatted ASCII portfolio table with colorized performance metrics."""
        totals = self.calculate_totals()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        print("\n" + "=" * 98)
        print(colorize("               STOCK PORTFOLIO PERFORMANCE TRACKER", Colors.CYAN + Colors.BOLD))
        print("=" * 98)
        print(f" Report Timestamp : {now_str}")
        print(f" Active Holdings  : {totals['total_positions']} stock(s)")
        print("-" * 98)

        # Table Header
        header = f"{'Symbol':<7} | {'Company':<22} | {'Shares':>7} | {'Buy ($)':>8} | {'Cur ($)':>8} | {'Invested ($)':>12} | {'Value ($)':>11} | {'Return (%)':>10}"
        print(colorize(header, Colors.BOLD))
        print("-" * 98)

        if not self.positions:
            print("  (No active holdings in portfolio. Add positions to calculate valuation)")
        else:
            for p in sorted(self.positions.values(), key=lambda x: x["symbol"]):
                pnl_color = Colors.GREEN if p["gain_loss"] >= 0 else Colors.RED
                pnl_pct_str = f"{p['gain_loss_pct']:+.2f}%"
                company_truncated = (p['name'][:20] + "..") if len(p['name']) > 22 else p['name']

                row = (
                    f"{p['symbol']:<7} | "
                    f"{company_truncated:<22} | "
                    f"{p['shares']:>7.2f} | "
                    f"{p['buy_price']:>8.2f} | "
                    f"{p['current_price']:>8.2f} | "
                    f"{p['invested_capital']:>12.2f} | "
                    f"{p['current_value']:>11.2f} | "
                    f"{colorize(f'{pnl_pct_str:>10}', pnl_color)}"
                )
                print(row)

        print("-" * 98)

        # Portfolio Summary Box
        ret_color = Colors.GREEN if totals['total_gain_loss'] >= 0 else Colors.RED
        tot_gain = totals['total_gain_loss']
        tot_pct = totals['total_gain_loss_pct']
        gain_str = f"${tot_gain:+,.2f} ({tot_pct:+.2f}%)"

        print(f" Total Invested Capital : ${totals['total_invested']:,.2f}")
        print(f" Current Market Value   : ${totals['total_value']:,.2f}")
        print(f" Total Portfolio Return : {colorize(gain_str, ret_color + Colors.BOLD)}")

        if totals['best_performer']:
            best = totals['best_performer']
            best_pct = best['gain_loss_pct']
            print(f" Best Performer         : {best['symbol']} ({best['name']}) -> {colorize(f'{best_pct:+.2f}%', Colors.GREEN)}")
        if totals['worst_performer']:
            worst = totals['worst_performer']
            worst_pct = worst['gain_loss_pct']
            print(f" Worst Performer        : {worst['symbol']} ({worst['name']}) -> {colorize(f'{worst_pct:+.2f}%', Colors.RED)}")

        print("=" * 98 + "\n")


def seed_sample_portfolio() -> PortfolioTracker:
    """Initialize portfolio tracker with diverse S&P 500 blue-chip holdings."""
    tracker = PortfolioTracker()
    tracker.add_position("NVDA", shares=25.0, buy_price=112.40)
    tracker.add_position("AAPL", shares=15.0, buy_price=185.00)
    tracker.add_position("MSFT", shares=10.0, buy_price=398.50)
    tracker.add_position("AMZN", shares=20.0, buy_price=174.20)
    tracker.add_position("TSLA", shares=12.0, buy_price=248.80)
    return tracker


def main():
    """Interactive command-line interface for the portfolio tracker."""
    print("Initializing Stock Portfolio Tracker...")
    tracker = seed_sample_portfolio()

    # Initial formatted display
    tracker.print_formatted_summary()

    # Automatically write sample output
    out_csv = tracker.export_to_csv()
    print(colorize(f"[SUCCESS] Portfolio summary automatically persisted to '{out_csv}'\n", Colors.GREEN))

    while True:
        print("Commands: [1] Add/Update Holding  [2] Remove Holding  [3] Show Summary  [4] Export CSV  [5] Refresh Market Prices  [6] Exit")
        try:
            cmd = input("Select action (1-6): ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting. Goodbye!")
            break

        if cmd == "1":
            try:
                sym = input("Enter Ticker Symbol (e.g. AAPL, GOOGL): ").strip().upper()
                if not sym:
                    print("Ticker symbol cannot be empty.")
                    continue
                shares = float(input("Enter Share Quantity: ").strip())
                buy_price = float(input("Enter Buy Price ($): ").strip())
                custom_curr = input("Enter Current Market Price ($) [Leave blank for market quote]: ").strip()
                curr_price = float(custom_curr) if custom_curr else None

                pos = tracker.add_position(sym, shares, buy_price, curr_price)
                print(colorize(f"Added {sym}: {pos['shares']} shares @ ${pos['buy_price']} (Current: ${pos['current_price']})", Colors.GREEN))
                tracker.export_to_csv()
            except ValueError as e:
                print(colorize(f"Input Error: {e}", Colors.RED))

        elif cmd == "2":
            sym = input("Enter Ticker Symbol to remove: ").strip().upper()
            if tracker.remove_position(sym):
                print(colorize(f"Removed {sym} from portfolio.", Colors.YELLOW))
                tracker.export_to_csv()
            else:
                print(colorize(f"Ticker {sym} not found in portfolio.", Colors.RED))

        elif cmd == "3":
            tracker.print_formatted_summary()

        elif cmd == "4":
            path = tracker.export_to_csv()
            print(colorize(f"[SUCCESS] Exported portfolio summary to {path}", Colors.GREEN))

        elif cmd == "5":
            print("Fetching latest quotes from market feeds & reference datasets...")
            refreshed = tracker.refresh_market_prices(use_live=True)
            tracker.export_to_csv()
            print(colorize(f"[SUCCESS] Refreshed market valuation for {refreshed} holdings and updated portfolio_summary.csv", Colors.GREEN))
            tracker.print_formatted_summary()

        elif cmd == "6" or cmd.lower() in ("q", "quit", "exit"):
            print("Session ended. All transactions logged.")
            break
        else:
            print("Invalid option. Please enter 1, 2, 3, 4, 5, or 6.")


if __name__ == "__main__":
    main()
