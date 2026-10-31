export interface StockPosition {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  investedCapital: number;
  currentValue: number;
  gainLoss: number;
  gainLossPct: number;
}

export const INITIAL_HOLDINGS: StockPosition[] = [
  {
    id: '1',
    symbol: 'NVDA',
    name: 'Nvidia',
    sector: 'Information Technology',
    shares: 25.0,
    buyPrice: 112.40,
    currentPrice: 141.80,
    investedCapital: 2810.00,
    currentValue: 3545.00,
    gainLoss: 735.00,
    gainLossPct: 26.16,
  },
  {
    id: '2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Information Technology',
    shares: 15.0,
    buyPrice: 185.00,
    currentPrice: 232.50,
    investedCapital: 2775.00,
    currentValue: 3487.50,
    gainLoss: 712.50,
    gainLossPct: 25.68,
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft',
    sector: 'Information Technology',
    shares: 10.0,
    buyPrice: 398.50,
    currentPrice: 431.20,
    investedCapital: 3985.00,
    currentValue: 4312.00,
    gainLoss: 327.00,
    gainLossPct: 8.21,
  },
  {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon',
    sector: 'Consumer Discretionary',
    shares: 20.0,
    buyPrice: 174.20,
    currentPrice: 188.75,
    investedCapital: 3484.00,
    currentValue: 3775.00,
    gainLoss: 291.00,
    gainLossPct: 8.35,
  },
  {
    id: '5',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Discretionary',
    shares: 12.0,
    buyPrice: 248.80,
    currentPrice: 269.19,
    investedCapital: 2985.60,
    currentValue: 3230.28,
    gainLoss: 244.68,
    gainLossPct: 8.20,
  },
];

export const POPULAR_CONSTITUENTS: Array<{ symbol: string; name: string; sector: string; defaultPrice: number }> = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Information Technology', defaultPrice: 232.50 },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Information Technology', defaultPrice: 431.20 },
  { symbol: 'NVDA', name: 'Nvidia', sector: 'Information Technology', defaultPrice: 141.80 },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)', sector: 'Communication Services', defaultPrice: 169.40 },
  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer Discretionary', defaultPrice: 188.75 },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Communication Services', defaultPrice: 585.30 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Discretionary', defaultPrice: 269.19 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', defaultPrice: 454.60 },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', defaultPrice: 222.80 },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', defaultPrice: 284.10 },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Health Care', defaultPrice: 568.40 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Health Care', defaultPrice: 161.90 },
  { symbol: 'XOM', name: 'ExxonMobil', sector: 'Energy', defaultPrice: 120.30 },
  { symbol: 'WMT', name: 'Walmart', sector: 'Consumer Staples', defaultPrice: 82.50 },
  { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples', defaultPrice: 168.10 },
  { symbol: 'MA', name: 'Mastercard', sector: 'Financials', defaultPrice: 508.20 },
  { symbol: 'LLY', name: 'Eli Lilly and Company', sector: 'Health Care', defaultPrice: 824.50 },
  { symbol: 'HD', name: 'Home Depot (The)', sector: 'Consumer Discretionary', defaultPrice: 402.10 },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', defaultPrice: 151.30 },
  { symbol: 'ABBV', name: 'AbbVie', sector: 'Health Care', defaultPrice: 188.90 },
  { symbol: 'COST', name: 'Costco', sector: 'Consumer Staples', defaultPrice: 910.40 },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Financials', defaultPrice: 42.15 },
  { symbol: 'KO', name: 'Coca-Cola Company (The)', sector: 'Consumer Staples', defaultPrice: 67.80 },
  { symbol: 'PEP', name: 'PepsiCo', sector: 'Consumer Staples', defaultPrice: 174.50 },
  { symbol: 'CRM', name: 'Salesforce', sector: 'Information Technology', defaultPrice: 288.70 },
  { symbol: 'NFLX', name: 'Netflix', sector: 'Communication Services', defaultPrice: 755.20 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Information Technology', defaultPrice: 156.30 },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Information Technology', defaultPrice: 505.40 },
  { symbol: 'DIS', name: 'Walt Disney Company (The)', sector: 'Communication Services', defaultPrice: 96.50 },
  { symbol: 'INTC', name: 'Intel', sector: 'Information Technology', defaultPrice: 22.80 },
];
