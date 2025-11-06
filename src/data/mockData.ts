// Mock-Daten für das Magnificent 7 Dashboard
// Basierend auf den extrahierten Figma-Daten

export interface Company {
  id: string
  name: string
  symbol: string
  color: string
  revenue: number
  netIncome: number
  grossMargin: number
  revenueGrowth: number
}

export const companies: Company[] = [
  {
    id: 'meta',
    name: 'Meta',
    symbol: 'META',
    color: 'var(--color-chart-1)',
    revenue: 8.7,
    netIncome: 6.81,
    grossMargin: 6.2,
    revenueGrowth: 23,
  },
  {
    id: 'tesla',
    name: 'Tesla',
    symbol: 'TSLA',
    color: 'var(--color-chart-2)',
    revenue: 5.4,
    netIncome: 3.16,
    grossMargin: 24.8,
    revenueGrowth: 49,
  },
  {
    id: 'nvidia',
    name: 'Nvidia',
    symbol: 'NVDA',
    color: 'var(--color-chart-3)',
    revenue: 14.7,
    netIncome: 40.15,
    grossMargin: 24.3,
    revenueGrowth: 126,
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    symbol: 'MSFT',
    color: 'var(--color-chart-4)',
    revenue: 17,
    netIncome: 26.25,
    grossMargin: 12.5,
    revenueGrowth: 17,
  },
  {
    id: 'apple',
    name: 'Apple',
    symbol: 'AAPL',
    color: 'var(--color-chart-5)',
    revenue: 17.7,
    netIncome: 39.5,
    grossMargin: 12.7,
    revenueGrowth: 8,
  },
  {
    id: 'google',
    name: 'Google',
    symbol: 'GOOGL',
    color: 'var(--color-chart-6)',
    revenue: 11.5,
    netIncome: 24.51,
    grossMargin: 12.2,
    revenueGrowth: 15,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    symbol: 'AMZN',
    color: 'var(--color-chart-7)',
    revenue: 9.1,
    netIncome: 62.62,
    grossMargin: 5.7,
    revenueGrowth: 12,
  },
]

// Revenue data over 3 years (Quartals-Daten)
export interface QuarterData {
  quarter: string
  [key: string]: number | string
}

export const revenueData: QuarterData[] = [
  {
    quarter: 'Q1 2021',
    meta: 26.2,
    tesla: 10.4,
    nvidia: 5.7,
    microsoft: 41.7,
    apple: 89.6,
    google: 55.3,
    amazon: 108.5,
  },
  {
    quarter: 'Q2 2021',
    meta: 29.1,
    tesla: 12.0,
    nvidia: 6.5,
    microsoft: 46.2,
    apple: 81.4,
    google: 61.9,
    amazon: 113.1,
  },
  {
    quarter: 'Q3 2021',
    meta: 29.0,
    tesla: 13.8,
    nvidia: 7.1,
    microsoft: 45.3,
    apple: 83.4,
    google: 65.1,
    amazon: 110.8,
  },
  {
    quarter: 'Q4 2021',
    meta: 33.7,
    tesla: 17.7,
    nvidia: 7.6,
    microsoft: 51.7,
    apple: 123.9,
    google: 75.3,
    amazon: 137.4,
  },
  {
    quarter: 'Q1 2022',
    meta: 27.9,
    tesla: 18.8,
    nvidia: 8.3,
    microsoft: 49.4,
    apple: 97.3,
    google: 68.0,
    amazon: 116.4,
  },
  {
    quarter: 'Q2 2022',
    meta: 28.8,
    tesla: 16.9,
    nvidia: 6.7,
    microsoft: 51.9,
    apple: 83.0,
    google: 69.7,
    amazon: 121.2,
  },
  {
    quarter: 'Q3 2022',
    meta: 27.7,
    tesla: 21.5,
    nvidia: 5.9,
    microsoft: 50.1,
    apple: 90.1,
    google: 69.1,
    amazon: 127.1,
  },
  {
    quarter: 'Q4 2022',
    meta: 32.2,
    tesla: 24.3,
    nvidia: 6.1,
    microsoft: 52.7,
    apple: 117.2,
    google: 76.0,
    amazon: 149.2,
  },
  {
    quarter: 'Q1 2023',
    meta: 28.6,
    tesla: 23.3,
    nvidia: 7.2,
    microsoft: 52.9,
    apple: 94.8,
    google: 69.8,
    amazon: 127.4,
  },
  {
    quarter: 'Q2 2023',
    meta: 32.0,
    tesla: 24.9,
    nvidia: 13.5,
    microsoft: 56.2,
    apple: 81.8,
    google: 74.6,
    amazon: 134.4,
  },
  {
    quarter: 'Q3 2023',
    meta: 34.1,
    tesla: 23.4,
    nvidia: 18.1,
    microsoft: 56.5,
    apple: 89.5,
    google: 76.7,
    amazon: 143.1,
  },
  {
    quarter: 'Q4 2023',
    meta: 40.1,
    tesla: 25.2,
    nvidia: 22.1,
    microsoft: 62.0,
    apple: 119.6,
    google: 86.3,
    amazon: 170.0,
  },
  {
    quarter: 'Q1 2024',
    meta: 36.5,
    tesla: 21.3,
    nvidia: 26.0,
    microsoft: 61.9,
    apple: 90.8,
    google: 80.5,
    amazon: 143.3,
  },
]

// Stock-Preis-Daten (Mock für aktuelle Preise)
export interface StockPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export const stockPrices: StockPrice[] = [
  { symbol: 'META', price: 38.52, change: 1.06, changePercent: 2.83 },
  { symbol: 'TSLA', price: 242.84, change: -3.21, changePercent: -1.3 },
  { symbol: 'NVDA', price: 878.37, change: 24.15, changePercent: 2.83 },
  { symbol: 'MSFT', price: 415.26, change: 5.32, changePercent: 1.3 },
  { symbol: 'AAPL', price: 189.84, change: 2.14, changePercent: 1.14 },
  { symbol: 'GOOGL', price: 140.23, change: 1.87, changePercent: 1.35 },
  { symbol: 'AMZN', price: 178.25, change: 3.45, changePercent: 1.98 },
]
