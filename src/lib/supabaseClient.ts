import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StockHistoricalPrice {
  id: string;
  stock_code: string;
  trading_date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  adjusted_close: number;
  volume: number;
  created_at: string;
}

export interface TechnicalIndicator {
  id: string;
  stock_code: string;
  trading_date: string;
  indicator_type: string;
  indicator_value: number;
  calculation_params: Record<string, any>;
  created_at: string;
}

export interface StrategyTemplate {
  id: string;
  strategy_name: string;
  strategy_description: string;
  strategy_logic: Record<string, any>;
  default_params: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface BacktestResult {
  id: string;
  stock_code: string;
  strategy_id: string;
  strategy_params: Record<string, any>;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital: number;
  total_return: number;
  trade_count: number;
  execution_time_ms: number;
  created_at: string;
}

export interface BacktestTrade {
  id: string;
  backtest_id: string;
  trade_date: string;
  trade_type: 'buy' | 'sell';
  price: number;
  quantity: number;
  commission: number;
  signal_reason: string;
  created_at: string;
}

export interface BacktestPerformanceMetrics {
  id: string;
  backtest_id: string;
  sharpe_ratio: number;
  max_drawdown: number;
  win_rate: number;
  profit_factor: number;
  avg_profit: number;
  avg_loss: number;
  total_profit: number;
  total_loss: number;
  max_consecutive_wins: number;
  max_consecutive_losses: number;
  created_at: string;
}
