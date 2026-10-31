import React, { useState } from 'react';
import { StockPosition, INITIAL_HOLDINGS, POPULAR_CONSTITUENTS } from '../portfolioData';
import portfolioPyRaw from '../../Stock Portfolio Performance Tracker/portfolio.py?raw';
import constituentsCsvRaw from '../../Stock Portfolio Performance Tracker/constituents.csv?raw';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Plus,
  Trash2,
  Download,
  Terminal,
  FileCode,
  FileSpreadsheet,
  Copy,
  Check,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const Task2Portfolio: React.FC = () => {
  const [positions, setPositions] = useState<StockPosition[]>(INITIAL_HOLDINGS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'code' | 'constituents' | 'terminal'>('dashboard');

  // New Position Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [tickerInput, setTickerInput] = useState('');
  const [sharesInput, setSharesInput] = useState('');
  const [buyPriceInput, setBuyPriceInput] = useState('');
  const [currPriceInput, setCurrPriceInput] = useState('');
  const [formError, setFormError] = useState('');

  // S&P 500 search filter
  const [constituentSearch, setConstituentSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Compute aggregate totals
  const totalInvested = positions.reduce((sum, p) => sum + p.investedCapital, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPct = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  // Best & Worst performers
  const sortedByPct = [...positions].sort((a, b) => b.gainLossPct - a.gainLossPct);
  const bestPerformer = sortedByPct.length > 0 ? sortedByPct[0] : null;
  const worstPerformer = sortedByPct.length > 0 ? sortedByPct[sortedByPct.length - 1] : null;

  const handleSelectSuggestedTicker = (sym: string, defPrice: number) => {
    setTickerInput(sym);
    setCurrPriceInput(defPrice.toFixed(2));
    if (!buyPriceInput) {
      setBuyPriceInput((defPrice * 0.9).toFixed(2));
    }
  };

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const sym = tickerInput.trim().toUpperCase();
    const shares = parseFloat(sharesInput);
    const buyPrice = parseFloat(buyPriceInput);
    const currPrice = parseFloat(currPriceInput);

    if (!sym) {
      setFormError('Please enter a valid ticker symbol.');
      return;
    }
    if (isNaN(shares) || shares <= 0) {
      setFormError('Share quantity must be a positive number.');
      return;
    }
    if (isNaN(buyPrice) || buyPrice <= 0) {
      setFormError('Buy price must be a positive number.');
      return;
    }

    const matched = POPULAR_CONSTITUENTS.find((c) => c.symbol === sym);
    const name = matched ? matched.name : `${sym} Corporation`;
    const sector = matched ? matched.sector : 'General';
    const finalCurrPrice = !isNaN(currPrice) && currPrice > 0 ? currPrice : matched ? matched.defaultPrice : buyPrice;

    // Check if symbol already exists (calculate weighted average buy price)
    const existingIndex = positions.findIndex((p) => p.symbol === sym);

    if (existingIndex >= 0) {
      const existing = positions[existingIndex];
      const newTotalShares = existing.shares + shares;
      const newTotalCost = existing.shares * existing.buyPrice + shares * buyPrice;
      const avgBuyPrice = newTotalCost / newTotalShares;
      const invCap = newTotalShares * avgBuyPrice;
      const curVal = newTotalShares * finalCurrPrice;
      const gl = curVal - invCap;
      const glPct = invCap > 0 ? (gl / invCap) * 100 : 0;

      const updated = [...positions];
      updated[existingIndex] = {
        ...existing,
        shares: Number(newTotalShares.toFixed(4)),
        buyPrice: Number(avgBuyPrice.toFixed(2)),
        currentPrice: Number(finalCurrPrice.toFixed(2)),
        investedCapital: Number(invCap.toFixed(2)),
        currentValue: Number(curVal.toFixed(2)),
        gainLoss: Number(gl.toFixed(2)),
        gainLossPct: Number(glPct.toFixed(2)),
      };
      setPositions(updated);
    } else {
      const invCap = shares * buyPrice;
      const curVal = shares * finalCurrPrice;
      const gl = curVal - invCap;
      const glPct = invCap > 0 ? (gl / invCap) * 100 : 0;

      const newPos: StockPosition = {
        id: Date.now().toString(),
        symbol: sym,
        name,
        sector,
        shares: Number(shares.toFixed(4)),
        buyPrice: Number(buyPrice.toFixed(2)),
        currentPrice: Number(finalCurrPrice.toFixed(2)),
        investedCapital: Number(invCap.toFixed(2)),
        currentValue: Number(curVal.toFixed(2)),
        gainLoss: Number(gl.toFixed(2)),
        gainLossPct: Number(glPct.toFixed(2)),
      };
      setPositions([newPos, ...positions]);
    }

    // Reset form
    setTickerInput('');
    setSharesInput('');
    setBuyPriceInput('');
    setCurrPriceInput('');
    setShowAddModal(false);
  };

  const handleDeletePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  const handleExportCsv = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const headers = [
      'Timestamp',
      'Symbol',
      'Company_Name',
      'GICS_Sector',
      'Shares',
      'Buy_Price',
      'Current_Price',
      'Invested_Capital',
      'Current_Value',
      'Gain_Loss_Dollar',
      'Gain_Loss_Percent',
    ];

    const rows = positions.map((p) => [
      timestamp,
      p.symbol,
      `"${p.name}"`,
      `"${p.sector}"`,
      p.shares.toFixed(4),
      p.buyPrice.toFixed(2),
      p.currentPrice.toFixed(2),
      p.investedCapital.toFixed(2),
      p.currentValue.toFixed(2),
      `${p.gainLoss >= 0 ? '+' : ''}${p.gainLoss.toFixed(2)}`,
      `${p.gainLossPct >= 0 ? '+' : ''}${p.gainLossPct.toFixed(2)}%`,
    ]);

    const summaryRow = [
      'SUMMARY_TOTALS',
      `COUNT: ${positions.length}`,
      '',
      '',
      '',
      '',
      '',
      totalInvested.toFixed(2),
      totalValue.toFixed(2),
      `${totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}`,
      `${totalGainLossPct >= 0 ? '+' : ''}${totalGainLossPct.toFixed(2)}%`,
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(',')), '', summaryRow.join(',')].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_summary.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(portfolioPyRaw);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter S&P 500 constituents
  const filteredConstituents = POPULAR_CONSTITUENTS.filter(
    (c) =>
      c.symbol.toLowerCase().includes(constituentSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(constituentSearch.toLowerCase()) ||
      c.sector.toLowerCase().includes(constituentSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              Task 2
            </span>
            <span>Financial Engineering &amp; Stock Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Stock Portfolio Performance Tracker
          </h2>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Calculate real-time portfolio valuation, track percentage gain/loss per holding against S&amp;P 500 constituents, and persist transaction logs to <code>portfolio_summary.csv</code> using Python&apos;s built-in <code>csv</code> module.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold shadow-sm transition-all hover:border-emerald-500/50"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export portfolio_summary.csv</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Position</span>
          </button>
        </div>
      </div>

      {/* Sub-view navigation tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <PieChart className="w-4 h-4 text-emerald-400" />
            <span>Portfolio Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Console Table Output</span>
          </button>

          <button
            onClick={() => setActiveTab('constituents')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'constituents'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>S&amp;P 500 Constituents Dataset</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>portfolio.py Source</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metric Valuation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Total Portfolio Value
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                {positions.length} active holding(s)
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Total Invested Capital
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-300 font-mono">
                ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">Cost basis across all shares</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Net Profit / Loss
              </div>
              <div
                className={`text-2xl sm:text-3xl font-black font-mono flex items-center gap-1.5 ${
                  totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalGainLoss >= 0 ? (
                  <ArrowUpRight className="w-6 h-6 shrink-0" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 shrink-0" />
                )}
                <span>
                  {totalGainLoss >= 0 ? '+' : ''}
                  ${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div
                className={`text-[11px] font-mono font-bold ${
                  totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalGainLossPct >= 0 ? '+' : ''}
                {totalGainLossPct.toFixed(2)}% Overall Return
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Top Performer
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {bestPerformer ? bestPerformer.symbol : 'N/A'}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono truncate">
                {bestPerformer ? `${bestPerformer.name} (+${bestPerformer.gainLossPct.toFixed(2)}%)` : 'No holdings'}
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-zinc-950 px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Portfolio Positions ({positions.length})
                </span>
              </div>

              <div className="text-xs font-mono text-zinc-400">
                Auto-synced with <code>portfolio_summary.csv</code>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Symbol &amp; Company</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4 text-right">Shares</th>
                    <th className="py-3 px-4 text-right">Buy Price</th>
                    <th className="py-3 px-4 text-right">Current Price</th>
                    <th className="py-3 px-4 text-right">Invested Capital</th>
                    <th className="py-3 px-4 text-right">Current Value</th>
                    <th className="py-3 px-4 text-right">Gain / Loss ($)</th>
                    <th className="py-3 px-4 text-right">Return (%)</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-zinc-500 italic">
                        No positions in portfolio. Click &quot;Add Stock Position&quot; to begin tracking!
                      </td>
                    </tr>
                  ) : (
                    positions.map((p) => {
                      const isProfit = p.gainLoss >= 0;
                      return (
                        <tr key={p.id} className="hover:bg-zinc-850/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 font-bold">
                                {p.symbol}
                              </span>
                              <span className="text-zinc-300 font-normal truncate max-w-[150px]">{p.name}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-zinc-400">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                              {p.sector}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-medium text-zinc-200">
                            {p.shares.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4 text-right text-zinc-300">
                            ${p.buyPrice.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold text-white">
                            ${p.currentPrice.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4 text-right text-zinc-300">
                            ${p.investedCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold text-white">
                            ${p.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>

                          <td
                            className={`py-3.5 px-4 text-right font-bold ${
                              isProfit ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isProfit ? '+' : ''}${p.gainLoss.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] ${
                                isProfit
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/70'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800/70'
                              }`}
                            >
                              {isProfit ? '+' : ''}
                              {p.gainLossPct.toFixed(2)}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleDeletePosition(p.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="Delete position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TERMINAL CONSOLE TABLE TAB */}
      {activeTab === 'terminal' && (
        <div className="bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-xs space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>python3 &quot;Stock Portfolio Performance Tracker/portfolio.py&quot;</span>
            </div>
            <span className="text-zinc-500 text-[11px]">Formatted Console Output Stream</span>
          </div>

          <pre className="text-emerald-400 leading-relaxed overflow-x-auto select-text whitespace-pre py-2">
{`==================================================================================================
               STOCK PORTFOLIO PERFORMANCE TRACKER
==================================================================================================
 Report Timestamp : ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
 Active Holdings  : ${positions.length} stock(s)
--------------------------------------------------------------------------------------------------
Symbol  | Company                |  Shares |  Buy ($) |  Cur ($) | Invested ($) |   Value ($) | Return (%)
--------------------------------------------------------------------------------------------------
${positions
  .map(
    (p) =>
      `${p.symbol.padEnd(7, ' ')} | ${p.name.slice(0, 22).padEnd(22, ' ')} | ${p.shares.toFixed(2).padStart(7, ' ')} | ${p.buyPrice.toFixed(2).padStart(8, ' ')} | ${p.currentPrice.toFixed(2).padStart(8, ' ')} | ${p.investedCapital.toFixed(2).padStart(12, ' ')} | ${p.currentValue.toFixed(2).padStart(11, ' ')} | ${(p.gainLossPct >= 0 ? '+' : '') + p.gainLossPct.toFixed(2) + '%'}`
  )
  .join('\n')}
--------------------------------------------------------------------------------------------------
 Total Invested Capital : $${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 Current Market Value   : $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
 Total Portfolio Return : ${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)} (${totalGainLossPct >= 0 ? '+' : ''}${totalGainLossPct.toFixed(2)}%)
 Best Performer         : ${bestPerformer ? `${bestPerformer.symbol} (${bestPerformer.name}) -> +${bestPerformer.gainLossPct.toFixed(2)}%` : 'N/A'}
 Worst Performer        : ${worstPerformer ? `${worstPerformer.symbol} (${worstPerformer.name}) -> ${worstPerformer.gainLossPct.toFixed(2)}%` : 'N/A'}
==================================================================================================
[SUCCESS] Auto-logged to 'Stock Portfolio Performance Tracker/portfolio_summary.csv'`}
          </pre>
        </div>
      )}

      {/* S&P 500 CONSTITUENTS DATASET TAB */}
      {activeTab === 'constituents' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>S&amp;P 500 Constituents Dataset (constituents.csv)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                503 S&amp;P 500 companies used by <code>portfolio.py</code> for ticker symbol resolution and sector mapping.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={constituentSearch}
                onChange={(e) => setConstituentSearch(e.target.value)}
                placeholder="Search symbol, company, or sector..."
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pt-2">
            {filteredConstituents.map((item) => (
              <div
                key={item.symbol}
                onClick={() => {
                  handleSelectSuggestedTicker(item.symbol, item.defaultPrice);
                  setShowAddModal(true);
                }}
                className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-emerald-400 group-hover:text-emerald-300">
                    {item.symbol}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    ${item.defaultPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs font-medium text-zinc-200 truncate mt-1">
                  {item.name}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {item.sector}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PYTHON SOURCE CODE TAB */}
      {activeTab === 'code' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
          <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Stock Portfolio Performance Tracker/portfolio.py</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs font-mono text-zinc-200 border border-zinc-700 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-5 font-mono text-xs text-zinc-300 bg-zinc-950 overflow-x-auto max-h-[560px] overflow-y-auto leading-relaxed select-text">
            {portfolioPyRaw}
          </pre>
        </div>
      )}

      {/* ADD POSITION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Stock Position</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddPosition} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Stock Ticker Symbol (e.g. AAPL, NVDA, MSFT)
                </label>
                <input
                  type="text"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                  placeholder="e.g. AAPL"
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {['AAPL', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'TSLA'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      const item = POPULAR_CONSTITUENTS.find((c) => c.symbol === sym);
                      if (item) handleSelectSuggestedTicker(item.symbol, item.defaultPrice);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  >
                    +{sym}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Share Quantity</label>
                  <input
                    type="number"
                    step="any"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(e.target.value)}
                    placeholder="e.g. 10"
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Buy Price ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={buyPriceInput}
                    onChange={(e) => setBuyPriceInput(e.target.value)}
                    placeholder="e.g. 175.50"
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Current Market Price ($) <span className="text-zinc-500">(Auto-filled from S&amp;P 500)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={currPriceInput}
                  onChange={(e) => setCurrPriceInput(e.target.value)}
                  placeholder="e.g. 232.50"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-mono text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white shadow-md shadow-emerald-600/30"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
