#!/usr/bin/env python3
"""
Unit tests for Stock Portfolio Performance Tracker.
Validates position management, cost-basis averaging, market valuation, PnL calculations, and CSV export.
"""

import unittest
import os
import sys
import csv
import tempfile
from pathlib import Path

# Add project directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from portfolio import PortfolioTracker, get_current_price, load_constituents


class TestPortfolioTracker(unittest.TestCase):

    def setUp(self):
        """Create clean portfolio instance for testing."""
        self.tracker = PortfolioTracker()

    def test_constituents_loaded(self):
        """Verify S&P 500 constituents are properly parsed."""
        self.assertGreater(len(self.tracker.constituents), 450)
        self.assertIn("AAPL", self.tracker.constituents)
        self.assertIn("MSFT", self.tracker.constituents)
        self.assertIn("NVDA", self.tracker.constituents)
        self.assertEqual(self.tracker.constituents["AAPL"]["sector"], "Information Technology")

    def test_add_position(self):
        """Verify single stock position calculation."""
        pos = self.tracker.add_position("AAPL", shares=10.0, buy_price=150.0, current_price=200.0)
        self.assertEqual(pos["shares"], 10.0)
        self.assertEqual(pos["buy_price"], 150.0)
        self.assertEqual(pos["current_price"], 200.0)
        self.assertEqual(pos["invested_capital"], 1500.0)
        self.assertEqual(pos["current_value"], 2000.0)
        self.assertEqual(pos["gain_loss"], 500.0)
        self.assertEqual(pos["gain_loss_pct"], 33.33)

    def test_average_cost_basis_on_duplicate_add(self):
        """Verify adding more shares recalculates weighted average cost basis."""
        # 10 shares @ $100 = $1,000
        self.tracker.add_position("MSFT", shares=10.0, buy_price=100.0, current_price=150.0)
        # Add 10 more shares @ $200 = $2,000. Total 20 shares, Total Cost $3,000 -> Avg Buy Price $150
        pos = self.tracker.add_position("MSFT", shares=10.0, buy_price=200.0, current_price=150.0)
        self.assertEqual(pos["shares"], 20.0)
        self.assertEqual(pos["buy_price"], 150.0)
        self.assertEqual(pos["invested_capital"], 3000.0)
        self.assertEqual(pos["current_value"], 3000.0)
        self.assertEqual(pos["gain_loss"], 0.0)

    def test_negative_gain_loss(self):
        """Verify loss calculations."""
        pos = self.tracker.add_position("TSLA", shares=5.0, buy_price=300.0, current_price=240.0)
        self.assertEqual(pos["invested_capital"], 1500.0)
        self.assertEqual(pos["current_value"], 1200.0)
        self.assertEqual(pos["gain_loss"], -300.0)
        self.assertEqual(pos["gain_loss_pct"], -20.0)

    def test_remove_position(self):
        """Verify position removal."""
        self.tracker.add_position("NVDA", shares=5.0, buy_price=100.0)
        self.assertTrue(self.tracker.remove_position("NVDA"))
        self.assertNotIn("NVDA", self.tracker.positions)
        self.assertFalse(self.tracker.remove_position("NONEXISTENT"))

    def test_portfolio_totals(self):
        """Verify aggregate portfolio totals."""
        self.tracker.add_position("AAPL", shares=10.0, buy_price=100.0, current_price=120.0)  # +200
        self.tracker.add_position("GOOGL", shares=10.0, buy_price=100.0, current_price=90.0)  # -100
        totals = self.tracker.calculate_totals()

        self.assertEqual(totals["total_positions"], 2)
        self.assertEqual(totals["total_invested"], 2000.0)
        self.assertEqual(totals["total_value"], 2100.0)
        self.assertEqual(totals["total_gain_loss"], 100.0)
        self.assertEqual(totals["total_gain_loss_pct"], 5.0)
        self.assertEqual(totals["best_performer"]["symbol"], "AAPL")
        self.assertEqual(totals["worst_performer"]["symbol"], "GOOGL")

    def test_csv_export(self):
        """Verify CSV export output structure and validity."""
        self.tracker.add_position("AAPL", shares=10.0, buy_price=150.0, current_price=200.0)
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
            tmp_path = tmp.name

        try:
            exported_path = self.tracker.export_to_csv(tmp_path)
            self.assertTrue(os.path.isfile(exported_path))

            with open(exported_path, "r", encoding="utf-8") as f:
                reader = list(csv.reader(f))
                header = reader[0]
                self.assertIn("Symbol", header)
                self.assertIn("Invested_Capital", header)
                self.assertIn("Gain_Loss_Percent", header)

                # Check data row
                aapl_row = next(r for r in reader if r and r[1] == "AAPL")
                self.assertEqual(aapl_row[1], "AAPL")
                self.assertEqual(aapl_row[7], "1500.00")
                self.assertEqual(aapl_row[8], "2000.00")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)


if __name__ == "__main__":
    unittest.main()
