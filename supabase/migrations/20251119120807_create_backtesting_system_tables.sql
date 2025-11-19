/*
  # 历史回溯测试系统数据库架构

  ## 新表创建
  
  ### 1. stock_historical_prices - 股票历史价格数据
    - `id` (uuid, 主键)
    - `stock_code` (text) - 股票代码（如"7203"）
    - `trading_date` (date) - 交易日期
    - `open_price` (numeric) - 开盘价
    - `high_price` (numeric) - 最高价
    - `low_price` (numeric) - 最低价
    - `close_price` (numeric) - 收盘价
    - `adjusted_close` (numeric) - 调整收盘价（考虑拆股分红）
    - `volume` (bigint) - 成交量
    - `created_at` (timestamptz) - 数据创建时间
    - 复合唯一索引：(stock_code, trading_date)

  ### 2. technical_indicators_cache - 技术指标缓存
    - `id` (uuid, 主键)
    - `stock_code` (text) - 股票代码
    - `trading_date` (date) - 交易日期
    - `indicator_type` (text) - 指标类型（sma_5, sma_20, rsi_14, macd等）
    - `indicator_value` (numeric) - 指标值
    - `calculation_params` (jsonb) - 计算参数
    - `created_at` (timestamptz)
    - 复合索引：(stock_code, trading_date, indicator_type)

  ### 3. strategy_templates - 策略模板
    - `id` (uuid, 主键)
    - `strategy_name` (text) - 策略名称
    - `strategy_description` (text) - 策略描述
    - `strategy_logic` (jsonb) - 策略逻辑配置
    - `default_params` (jsonb) - 默认参数
    - `is_active` (boolean) - 是否启用
    - `created_at` (timestamptz)

  ### 4. backtest_results - 回测结果
    - `id` (uuid, 主键)
    - `stock_code` (text) - 股票代码
    - `strategy_id` (uuid) - 策略ID（外键）
    - `strategy_params` (jsonb) - 使用的策略参数
    - `start_date` (date) - 回测开始日期
    - `end_date` (date) - 回测结束日期
    - `initial_capital` (numeric) - 初始资金
    - `final_capital` (numeric) - 最终资金
    - `total_return` (numeric) - 总收益率
    - `trade_count` (integer) - 交易次数
    - `execution_time_ms` (integer) - 执行时间（毫秒）
    - `created_at` (timestamptz)

  ### 5. backtest_trades - 回测交易记录
    - `id` (uuid, 主键)
    - `backtest_id` (uuid) - 回测ID（外键）
    - `trade_date` (date) - 交易日期
    - `trade_type` (text) - 交易类型（buy/sell）
    - `price` (numeric) - 交易价格
    - `quantity` (integer) - 交易数量
    - `commission` (numeric) - 手续费
    - `signal_reason` (text) - 信号原因
    - `created_at` (timestamptz)

  ### 6. backtest_performance_metrics - 回测性能指标
    - `id` (uuid, 主键)
    - `backtest_id` (uuid) - 回测ID（外键）
    - `sharpe_ratio` (numeric) - 夏普比率
    - `max_drawdown` (numeric) - 最大回撤
    - `win_rate` (numeric) - 胜率
    - `profit_factor` (numeric) - 盈利因子
    - `avg_profit` (numeric) - 平均盈利
    - `avg_loss` (numeric) - 平均亏损
    - `total_profit` (numeric) - 总盈利
    - `total_loss` (numeric) - 总亏损
    - `max_consecutive_wins` (integer) - 最大连续盈利次数
    - `max_consecutive_losses` (integer) - 最大连续亏损次数
    - `created_at` (timestamptz)

  ### 7. user_backtest_history - 用户回测历史
    - `id` (uuid, 主键)
    - `session_id` (text) - 会话ID
    - `stock_code` (text) - 股票代码
    - `stock_name` (text) - 股票名称
    - `backtest_id` (uuid) - 回测ID（外键）
    - `strategy_name` (text) - 策略名称
    - `created_at` (timestamptz)

  ## 安全性
    - 所有表启用RLS（Row Level Security）
    - 允许匿名用户读取公共数据
    - 限制写入权限
*/

-- 1. 股票历史价格数据表
CREATE TABLE IF NOT EXISTS stock_historical_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_code text NOT NULL,
  trading_date date NOT NULL,
  open_price numeric(12, 2) NOT NULL,
  high_price numeric(12, 2) NOT NULL,
  low_price numeric(12, 2) NOT NULL,
  close_price numeric(12, 2) NOT NULL,
  adjusted_close numeric(12, 2) NOT NULL,
  volume bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(stock_code, trading_date)
);

CREATE INDEX IF NOT EXISTS idx_stock_prices_lookup 
  ON stock_historical_prices(stock_code, trading_date DESC);

CREATE INDEX IF NOT EXISTS idx_stock_prices_date 
  ON stock_historical_prices(trading_date DESC);

ALTER TABLE stock_historical_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to stock prices"
  ON stock_historical_prices
  FOR SELECT
  TO anon
  USING (true);

-- 2. 技术指标缓存表
CREATE TABLE IF NOT EXISTS technical_indicators_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_code text NOT NULL,
  trading_date date NOT NULL,
  indicator_type text NOT NULL,
  indicator_value numeric(16, 6),
  calculation_params jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(stock_code, trading_date, indicator_type)
);

CREATE INDEX IF NOT EXISTS idx_indicators_lookup
  ON technical_indicators_cache(stock_code, trading_date DESC, indicator_type);

ALTER TABLE technical_indicators_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to indicators"
  ON technical_indicators_cache
  FOR SELECT
  TO anon
  USING (true);

-- 3. 策略模板表
CREATE TABLE IF NOT EXISTS strategy_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_name text UNIQUE NOT NULL,
  strategy_description text NOT NULL,
  strategy_logic jsonb NOT NULL DEFAULT '{}',
  default_params jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strategies_active
  ON strategy_templates(is_active, strategy_name);

ALTER TABLE strategy_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to strategies"
  ON strategy_templates
  FOR SELECT
  TO anon
  USING (is_active = true);

-- 4. 回测结果表
CREATE TABLE IF NOT EXISTS backtest_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_code text NOT NULL,
  strategy_id uuid REFERENCES strategy_templates(id),
  strategy_params jsonb NOT NULL DEFAULT '{}',
  start_date date NOT NULL,
  end_date date NOT NULL,
  initial_capital numeric(16, 2) NOT NULL DEFAULT 1000000,
  final_capital numeric(16, 2) NOT NULL,
  total_return numeric(8, 4) NOT NULL,
  trade_count integer NOT NULL DEFAULT 0,
  execution_time_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_backtest_results_stock
  ON backtest_results(stock_code, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_backtest_results_strategy
  ON backtest_results(strategy_id, created_at DESC);

ALTER TABLE backtest_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to backtest results"
  ON backtest_results
  FOR SELECT
  TO anon
  USING (true);

-- 5. 回测交易记录表
CREATE TABLE IF NOT EXISTS backtest_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backtest_id uuid REFERENCES backtest_results(id) ON DELETE CASCADE,
  trade_date date NOT NULL,
  trade_type text NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  price numeric(12, 2) NOT NULL,
  quantity integer NOT NULL,
  commission numeric(10, 2) NOT NULL DEFAULT 0,
  signal_reason text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_backtest_trades_lookup
  ON backtest_trades(backtest_id, trade_date);

ALTER TABLE backtest_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to backtest trades"
  ON backtest_trades
  FOR SELECT
  TO anon
  USING (true);

-- 6. 回测性能指标表
CREATE TABLE IF NOT EXISTS backtest_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backtest_id uuid UNIQUE REFERENCES backtest_results(id) ON DELETE CASCADE,
  sharpe_ratio numeric(8, 4),
  max_drawdown numeric(8, 4),
  win_rate numeric(6, 4),
  profit_factor numeric(8, 4),
  avg_profit numeric(12, 2),
  avg_loss numeric(12, 2),
  total_profit numeric(16, 2),
  total_loss numeric(16, 2),
  max_consecutive_wins integer DEFAULT 0,
  max_consecutive_losses integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_backtest
  ON backtest_performance_metrics(backtest_id);

ALTER TABLE backtest_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to performance metrics"
  ON backtest_performance_metrics
  FOR SELECT
  TO anon
  USING (true);

-- 7. 用户回测历史表
CREATE TABLE IF NOT EXISTS user_backtest_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  stock_code text NOT NULL,
  stock_name text NOT NULL,
  backtest_id uuid REFERENCES backtest_results(id),
  strategy_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_backtest_session
  ON user_backtest_history(session_id, created_at DESC);

ALTER TABLE user_backtest_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read own backtest history"
  ON user_backtest_history
  FOR SELECT
  TO anon
  USING (true);