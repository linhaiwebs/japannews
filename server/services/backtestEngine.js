import { calculateAllIndicators } from './technicalIndicators.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COMMISSION_RATE = 0.001;
const SLIPPAGE_RATE = 0.001;

class BacktestEngine {
  constructor(prices, strategy, strategyParams, initialCapital = 1000000) {
    this.prices = prices;
    this.strategy = strategy;
    this.strategyParams = strategyParams;
    this.initialCapital = initialCapital;

    this.cash = initialCapital;
    this.position = 0;
    this.positionPrice = 0;

    this.trades = [];
    this.portfolioValue = [];
    this.peakValue = initialCapital;
    this.maxDrawdown = 0;

    this.indicators = null;
  }

  calculateIndicators() {
    console.log('Calculating technical indicators...');
    this.indicators = calculateAllIndicators(this.prices, this.strategyParams);
  }

  generateSignals() {
    const signals = [];
    const strategyName = this.strategy.strategy_name;

    console.log(`Generating signals for strategy: ${strategyName}`);

    for (let i = 1; i < this.prices.length; i++) {
      let signal = 'hold';
      let reason = '';

      if (strategyName === 'SMA Golden Cross') {
        signal = this.checkSMAGoldenCross(i);
        reason = signal !== 'hold' ? `SMA${this.strategyParams.sma_short_period}/${this.strategyParams.sma_long_period} cross` : '';
      } else if (strategyName === 'RSI Oversold/Overbought') {
        signal = this.checkRSIStrategy(i);
        reason = signal !== 'hold' ? `RSI ${this.indicators.rsi[i]?.toFixed(2)}` : '';
      } else if (strategyName === 'Bollinger Bands Breakout') {
        signal = this.checkBollingerBands(i);
        reason = signal !== 'hold' ? 'Bollinger Band breakout' : '';
      } else if (strategyName === 'MACD Signal Cross') {
        signal = this.checkMACDStrategy(i);
        reason = signal !== 'hold' ? 'MACD signal cross' : '';
      } else if (strategyName === 'Multi-Indicator Combo') {
        signal = this.checkMultiIndicator(i);
        reason = signal !== 'hold' ? 'Multi-indicator consensus' : '';
      }

      signals.push({ signal, reason });
    }

    return signals;
  }

  checkSMAGoldenCross(index) {
    const shortPeriod = this.strategyParams.sma_short_period || 20;
    const longPeriod = this.strategyParams.sma_long_period || 50;

    const smaShort = this.indicators[`sma_${shortPeriod}`];
    const smaLong = this.indicators[`sma_${longPeriod}`];

    if (!smaShort || !smaLong || index < 1) return 'hold';

    const currentShort = smaShort[index];
    const currentLong = smaLong[index];
    const prevShort = smaShort[index - 1];
    const prevLong = smaLong[index - 1];

    if (!currentShort || !currentLong || !prevShort || !prevLong) return 'hold';

    if (prevShort <= prevLong && currentShort > currentLong) {
      return 'buy';
    }

    if (prevShort >= prevLong && currentShort < currentLong) {
      return 'sell';
    }

    return 'hold';
  }

  checkRSIStrategy(index) {
    const rsi = this.indicators.rsi[index];
    if (!rsi) return 'hold';

    const oversold = this.strategyParams.oversold_threshold || 30;
    const overbought = this.strategyParams.overbought_threshold || 70;

    if (rsi < oversold) {
      return 'buy';
    }

    if (rsi > overbought) {
      return 'sell';
    }

    return 'hold';
  }

  checkBollingerBands(index) {
    const bb = this.indicators.bollingerBands;
    const price = this.prices[index].close_price;

    if (!bb.lower[index] || !bb.upper[index]) return 'hold';

    if (price < bb.lower[index]) {
      return 'buy';
    }

    if (price > bb.upper[index]) {
      return 'sell';
    }

    return 'hold';
  }

  checkMACDStrategy(index) {
    const macd = this.indicators.macd;

    if (index < 1) return 'hold';

    const currentMACD = macd.macd[index];
    const currentSignal = macd.signal[index];
    const prevMACD = macd.macd[index - 1];
    const prevSignal = macd.signal[index - 1];

    if (!currentMACD || !currentSignal || !prevMACD || !prevSignal) return 'hold';

    if (prevMACD <= prevSignal && currentMACD > currentSignal) {
      return 'buy';
    }

    if (prevMACD >= prevSignal && currentMACD < currentSignal) {
      return 'sell';
    }

    return 'hold';
  }

  checkMultiIndicator(index) {
    const sma20 = this.indicators.sma_20[index];
    const sma50 = this.indicators.sma_50[index];
    const rsi = this.indicators.rsi[index];
    const macd = this.indicators.macd;

    if (!sma20 || !sma50 || !rsi || !macd.macd[index] || !macd.signal[index]) {
      return 'hold';
    }

    const buyConditions = [
      sma20 > sma50,
      rsi < 40,
      macd.macd[index] > macd.signal[index]
    ];

    const sellConditions = [
      sma20 < sma50,
      rsi > 65,
      macd.macd[index] < macd.signal[index]
    ];

    const buyCount = buyConditions.filter(c => c).length;
    const sellCount = sellConditions.filter(c => c).length;

    if (buyCount >= 2) {
      return 'buy';
    }

    if (sellCount >= 2) {
      return 'sell';
    }

    return 'hold';
  }

  executeTrade(index, signal, reason) {
    const price = this.prices[index].close_price;
    const date = this.prices[index].trading_date;

    const adjustedPrice = signal === 'buy'
      ? price * (1 + SLIPPAGE_RATE)
      : price * (1 - SLIPPAGE_RATE);

    if (signal === 'buy' && this.position === 0) {
      const positionSize = this.strategyParams.position_size || 0.2;
      const investAmount = this.cash * positionSize;
      const quantity = Math.floor(investAmount / adjustedPrice);

      if (quantity > 0) {
        const cost = quantity * adjustedPrice;
        const commission = cost * COMMISSION_RATE;

        this.cash -= (cost + commission);
        this.position = quantity;
        this.positionPrice = adjustedPrice;

        this.trades.push({
          trade_date: date,
          trade_type: 'buy',
          price: adjustedPrice,
          quantity: quantity,
          commission: commission,
          signal_reason: reason
        });

        console.log(`BUY: ${quantity} shares at ¥${adjustedPrice.toFixed(2)} on ${date} (${reason})`);
      }
    } else if (signal === 'sell' && this.position > 0) {
      const revenue = this.position * adjustedPrice;
      const commission = revenue * COMMISSION_RATE;

      this.cash += (revenue - commission);

      this.trades.push({
        trade_date: date,
        trade_type: 'sell',
        price: adjustedPrice,
        quantity: this.position,
        commission: commission,
        signal_reason: reason
      });

      console.log(`SELL: ${this.position} shares at ¥${adjustedPrice.toFixed(2)} on ${date} (${reason})`);

      this.position = 0;
      this.positionPrice = 0;
    }
  }

  updatePortfolioValue(index) {
    const currentPrice = this.prices[index].close_price;
    const positionValue = this.position * currentPrice;
    const totalValue = this.cash + positionValue;

    this.portfolioValue.push({
      date: this.prices[index].trading_date,
      value: totalValue,
      cash: this.cash,
      position_value: positionValue
    });

    if (totalValue > this.peakValue) {
      this.peakValue = totalValue;
    }

    const drawdown = (this.peakValue - totalValue) / this.peakValue;
    if (drawdown > this.maxDrawdown) {
      this.maxDrawdown = drawdown;
    }
  }

  async run() {
    console.log('Starting backtest execution...');
    const startTime = Date.now();

    this.calculateIndicators();
    const signals = this.generateSignals();

    for (let i = 1; i < this.prices.length; i++) {
      const { signal, reason } = signals[i - 1];

      this.executeTrade(i, signal, reason);
      this.updatePortfolioValue(i);
    }

    if (this.position > 0) {
      const lastPrice = this.prices[this.prices.length - 1].close_price;
      const revenue = this.position * lastPrice;
      const commission = revenue * COMMISSION_RATE;
      this.cash += (revenue - commission);

      this.trades.push({
        trade_date: this.prices[this.prices.length - 1].trading_date,
        trade_type: 'sell',
        price: lastPrice,
        quantity: this.position,
        commission: commission,
        signal_reason: 'Close position at end'
      });

      this.position = 0;
    }

    const executionTime = Date.now() - startTime;

    const results = {
      initial_capital: this.initialCapital,
      final_capital: this.cash,
      total_return: ((this.cash - this.initialCapital) / this.initialCapital) * 100,
      trade_count: this.trades.length,
      max_drawdown: this.maxDrawdown * 100,
      execution_time_ms: executionTime,
      trades: this.trades,
      portfolio_value: this.portfolioValue
    };

    console.log(`Backtest completed in ${executionTime}ms`);
    console.log(`Total trades: ${this.trades.length}`);
    console.log(`Final capital: ¥${this.cash.toFixed(2)}`);
    console.log(`Total return: ${results.total_return.toFixed(2)}%`);

    return results;
  }
}

export async function runBacktest(stockCode, strategyId, strategyParams, startDate, endDate, prices) {
  try {
    const { data: strategy, error } = await supabase
      .from('strategy_templates')
      .select('*')
      .eq('id', strategyId)
      .maybeSingle();

    if (error || !strategy) {
      throw new Error('Strategy not found');
    }

    const mergedParams = { ...strategy.default_params, ...strategyParams };

    const engine = new BacktestEngine(prices, strategy, mergedParams);
    const results = await engine.run();

    return {
      ...results,
      strategy_id: strategyId,
      strategy_name: strategy.strategy_name,
      stock_code: stockCode,
      start_date: startDate,
      end_date: endDate
    };

  } catch (error) {
    console.error('Backtest execution error:', error);
    throw error;
  }
}

export { BacktestEngine };
