export function calculateSMA(prices, period) {
  const sma = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j].close_price;
    }

    sma.push(sum / period);
  }

  return sma;
}

export function calculateEMA(prices, period) {
  const ema = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      ema.push(prices[i].close_price);
    } else if (i < period) {
      let sum = 0;
      for (let j = 0; j <= i; j++) {
        sum += prices[j].close_price;
      }
      ema.push(sum / (i + 1));
    } else {
      const value = (prices[i].close_price - ema[i - 1]) * multiplier + ema[i - 1];
      ema.push(value);
    }
  }

  return ema;
}

export function calculateRSI(prices, period = 14) {
  const rsi = [];
  const gains = [];
  const losses = [];

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }

    const change = prices[i].close_price - prices[i - 1].close_price;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);

    if (i < period) {
      rsi.push(null);
      continue;
    }

    let avgGain, avgLoss;

    if (i === period) {
      avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    } else {
      const prevRSI = rsi[i - 1];
      if (prevRSI === null) {
        rsi.push(null);
        continue;
      }

      avgGain = (gains.slice(i - period, i - 1).reduce((a, b) => a + b, 0) * (period - 1) + gains[i - 1]) / period;
      avgLoss = (losses.slice(i - period, i - 1).reduce((a, b) => a + b, 0) * (period - 1) + losses[i - 1]) / period;
    }

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }

  return rsi;
}

export function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  const macdLine = fastEMA.map((fast, i) => {
    if (fast === null || slowEMA[i] === null) return null;
    return fast - slowEMA[i];
  });

  const macdPrices = macdLine.map((value, i) => ({
    close_price: value || 0
  }));

  const signalLine = calculateEMA(macdPrices.slice(slowPeriod - 1), signalPeriod);
  const fullSignalLine = new Array(slowPeriod - 1).fill(null).concat(signalLine);

  const histogram = macdLine.map((macd, i) => {
    if (macd === null || fullSignalLine[i] === null) return null;
    return macd - fullSignalLine[i];
  });

  return {
    macd: macdLine,
    signal: fullSignalLine,
    histogram: histogram
  };
}

export function calculateBollingerBands(prices, period = 20, stdDev = 2) {
  const sma = calculateSMA(prices, period);
  const upperBand = [];
  const lowerBand = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1 || sma[i] === null) {
      upperBand.push(null);
      lowerBand.push(null);
      continue;
    }

    let sumSquaredDiff = 0;
    for (let j = 0; j < period; j++) {
      const diff = prices[i - j].close_price - sma[i];
      sumSquaredDiff += diff * diff;
    }

    const standardDeviation = Math.sqrt(sumSquaredDiff / period);

    upperBand.push(sma[i] + (stdDev * standardDeviation));
    lowerBand.push(sma[i] - (stdDev * standardDeviation));
  }

  return {
    middle: sma,
    upper: upperBand,
    lower: lowerBand
  };
}

export function calculateATR(prices, period = 14) {
  const atr = [];
  const trueRanges = [];

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      trueRanges.push(prices[i].high_price - prices[i].low_price);
      atr.push(null);
      continue;
    }

    const highLow = prices[i].high_price - prices[i].low_price;
    const highClose = Math.abs(prices[i].high_price - prices[i - 1].close_price);
    const lowClose = Math.abs(prices[i].low_price - prices[i - 1].close_price);

    const tr = Math.max(highLow, highClose, lowClose);
    trueRanges.push(tr);

    if (i < period) {
      atr.push(null);
      continue;
    }

    if (i === period) {
      const avgTR = trueRanges.slice(1, period + 1).reduce((a, b) => a + b, 0) / period;
      atr.push(avgTR);
    } else {
      const prevATR = atr[i - 1];
      const currentATR = ((prevATR * (period - 1)) + tr) / period;
      atr.push(currentATR);
    }
  }

  return atr;
}

export function calculateAllIndicators(prices, strategyParams = {}) {
  const indicators = {
    sma_5: calculateSMA(prices, 5),
    sma_10: calculateSMA(prices, 10),
    sma_20: calculateSMA(prices, strategyParams.sma_short || 20),
    sma_50: calculateSMA(prices, strategyParams.sma_long || 50),
    sma_200: calculateSMA(prices, 200),
    rsi: calculateRSI(prices, strategyParams.rsi_period || 14),
    macd: calculateMACD(
      prices,
      strategyParams.macd_fast || 12,
      strategyParams.macd_slow || 26,
      strategyParams.macd_signal || 9
    ),
    bollingerBands: calculateBollingerBands(
      prices,
      strategyParams.bb_period || 20,
      strategyParams.bb_std_dev || 2
    ),
    atr: calculateATR(prices, 14)
  };

  return indicators;
}
