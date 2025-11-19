export function calculatePerformanceMetrics(backtestResults) {
  const { trades, portfolio_value, initial_capital, final_capital } = backtestResults;

  if (!trades || trades.length === 0) {
    return {
      sharpe_ratio: 0,
      max_drawdown: backtestResults.max_drawdown || 0,
      win_rate: 0,
      profit_factor: 0,
      avg_profit: 0,
      avg_loss: 0,
      total_profit: 0,
      total_loss: 0,
      max_consecutive_wins: 0,
      max_consecutive_losses: 0
    };
  }

  const completedTrades = analyzeCompletedTrades(trades);

  const returns = calculateDailyReturns(portfolio_value);

  const sharpeRatio = calculateSharpeRatio(returns);

  const winningTrades = completedTrades.filter(t => t.profit > 0);
  const losingTrades = completedTrades.filter(t => t.profit < 0);

  const winRate = completedTrades.length > 0
    ? (winningTrades.length / completedTrades.length)
    : 0;

  const totalProfit = winningTrades.reduce((sum, t) => sum + t.profit, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));

  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;

  const avgProfit = winningTrades.length > 0
    ? totalProfit / winningTrades.length
    : 0;

  const avgLoss = losingTrades.length > 0
    ? totalLoss / losingTrades.length
    : 0;

  const { maxConsecutiveWins, maxConsecutiveLosses } = calculateConsecutiveStats(completedTrades);

  return {
    sharpe_ratio: sharpeRatio,
    max_drawdown: backtestResults.max_drawdown || 0,
    win_rate: winRate,
    profit_factor: profitFactor,
    avg_profit: avgProfit,
    avg_loss: avgLoss,
    total_profit: totalProfit,
    total_loss: totalLoss,
    max_consecutive_wins: maxConsecutiveWins,
    max_consecutive_losses: maxConsecutiveLosses
  };
}

function analyzeCompletedTrades(trades) {
  const completedTrades = [];
  let buyTrade = null;

  for (const trade of trades) {
    if (trade.trade_type === 'buy') {
      buyTrade = trade;
    } else if (trade.trade_type === 'sell' && buyTrade) {
      const buyValue = buyTrade.quantity * buyTrade.price + buyTrade.commission;
      const sellValue = trade.quantity * trade.price - trade.commission;
      const profit = sellValue - buyValue;

      completedTrades.push({
        buy_date: buyTrade.trade_date,
        sell_date: trade.trade_date,
        buy_price: buyTrade.price,
        sell_price: trade.price,
        quantity: trade.quantity,
        profit: profit,
        return_pct: (profit / buyValue) * 100
      });

      buyTrade = null;
    }
  }

  return completedTrades;
}

function calculateDailyReturns(portfolioValue) {
  const returns = [];

  for (let i = 1; i < portfolioValue.length; i++) {
    const prevValue = portfolioValue[i - 1].value;
    const currentValue = portfolioValue[i].value;

    const dailyReturn = (currentValue - prevValue) / prevValue;
    returns.push(dailyReturn);
  }

  return returns;
}

function calculateSharpeRatio(returns, riskFreeRate = 0.001) {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  const variance = returns.reduce((sum, r) => {
    return sum + Math.pow(r - avgReturn, 2);
  }, 0) / returns.length;

  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  const annualizedReturn = avgReturn * 252;
  const annualizedStdDev = stdDev * Math.sqrt(252);
  const annualizedRiskFreeRate = riskFreeRate * 252;

  const sharpeRatio = (annualizedReturn - annualizedRiskFreeRate) / annualizedStdDev;

  return sharpeRatio;
}

function calculateConsecutiveStats(completedTrades) {
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  for (const trade of completedTrades) {
    if (trade.profit > 0) {
      currentWinStreak++;
      currentLossStreak = 0;

      if (currentWinStreak > maxConsecutiveWins) {
        maxConsecutiveWins = currentWinStreak;
      }
    } else {
      currentLossStreak++;
      currentWinStreak = 0;

      if (currentLossStreak > maxConsecutiveLosses) {
        maxConsecutiveLosses = currentLossStreak;
      }
    }
  }

  return { maxConsecutiveWins, maxConsecutiveLosses };
}

export function calculateMonthlyReturns(portfolioValue) {
  const monthlyData = {};

  for (const entry of portfolioValue) {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        start_value: entry.value,
        end_value: entry.value,
        first_date: entry.date,
        last_date: entry.date
      };
    } else {
      monthlyData[monthKey].end_value = entry.value;
      monthlyData[monthKey].last_date = entry.date;
    }
  }

  const monthlyReturns = Object.entries(monthlyData).map(([month, data]) => {
    const returnPct = ((data.end_value - data.start_value) / data.start_value) * 100;

    return {
      month,
      return_pct: returnPct,
      start_value: data.start_value,
      end_value: data.end_value
    };
  });

  return monthlyReturns.sort((a, b) => a.month.localeCompare(b.month));
}
