import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { getHistoricalPrices, validateAndCleanData } from '../services/dataFetcher.js';
import { runBacktest } from '../services/backtestEngine.js';
import { calculatePerformanceMetrics, calculateMonthlyReturns } from '../services/performanceMetrics.js';

const router = express.Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/execute', async (req, res) => {
  const startTime = Date.now();

  try {
    const { stockCode, strategyId, strategyParams, startDate, endDate } = req.body;

    if (!stockCode || !strategyId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log(`\n=== Starting backtest for ${stockCode} ===`);
    console.log(`Strategy ID: ${strategyId}`);
    console.log(`Date range: ${startDate} to ${endDate}`);

    const prices = await getHistoricalPrices(
      stockCode,
      startDate || '2019-01-01',
      endDate || new Date().toISOString().split('T')[0]
    );

    if (!prices || prices.length < 100) {
      return res.status(400).json({
        error: '取得できた価格データが不足しています。別の銘柄をお試しください。',
        dataPoints: prices?.length || 0
      });
    }

    const validPrices = await validateAndCleanData(prices);

    console.log(`Running backtest with ${validPrices.length} price data points`);

    const backtestResults = await runBacktest(
      stockCode,
      strategyId,
      strategyParams || {},
      startDate || '2019-01-01',
      endDate || new Date().toISOString().split('T')[0],
      validPrices
    );

    const performanceMetrics = calculatePerformanceMetrics(backtestResults);

    const monthlyReturns = calculateMonthlyReturns(backtestResults.portfolio_value);

    const { data: insertedBacktest, error: backtestError } = await supabase
      .from('backtest_results')
      .insert({
        stock_code: stockCode,
        strategy_id: strategyId,
        strategy_params: strategyParams || {},
        start_date: startDate || '2019-01-01',
        end_date: endDate || new Date().toISOString().split('T')[0],
        initial_capital: backtestResults.initial_capital,
        final_capital: backtestResults.final_capital,
        total_return: backtestResults.total_return,
        trade_count: backtestResults.trade_count,
        execution_time_ms: backtestResults.execution_time_ms
      })
      .select()
      .single();

    if (backtestError) {
      console.error('Error saving backtest result:', backtestError);
    }

    const backtestId = insertedBacktest?.id;

    if (backtestId && backtestResults.trades.length > 0) {
      const tradesWithBacktestId = backtestResults.trades.map(trade => ({
        ...trade,
        backtest_id: backtestId
      }));

      const { error: tradesError } = await supabase
        .from('backtest_trades')
        .insert(tradesWithBacktestId);

      if (tradesError) {
        console.error('Error saving trades:', tradesError);
      }

      const { error: metricsError } = await supabase
        .from('backtest_performance_metrics')
        .insert({
          backtest_id: backtestId,
          ...performanceMetrics
        });

      if (metricsError) {
        console.error('Error saving performance metrics:', metricsError);
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n=== Backtest completed in ${totalTime}ms ===\n`);

    res.json({
      success: true,
      backtest_id: backtestId,
      results: {
        ...backtestResults,
        performance_metrics: performanceMetrics,
        monthly_returns: monthlyReturns
      }
    });

  } catch (error) {
    console.error('Backtest execution error:', error);
    res.status(500).json({
      error: 'バックテスト実行中にエラーが発生しました',
      details: error.message
    });
  }
});

router.get('/strategies', async (req, res) => {
  try {
    const { data: strategies, error } = await supabase
      .from('strategy_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      strategies: strategies || []
    });

  } catch (error) {
    console.error('Error fetching strategies:', error);
    res.status(500).json({
      error: '戦略テンプレートの取得に失敗しました'
    });
  }
});

router.get('/result/:backtestId', async (req, res) => {
  try {
    const { backtestId } = req.params;

    const { data: backtest, error: backtestError } = await supabase
      .from('backtest_results')
      .select('*')
      .eq('id', backtestId)
      .maybeSingle();

    if (backtestError || !backtest) {
      return res.status(404).json({ error: 'バックテスト結果が見つかりません' });
    }

    const { data: trades } = await supabase
      .from('backtest_trades')
      .select('*')
      .eq('backtest_id', backtestId)
      .order('trade_date', { ascending: true });

    const { data: metrics } = await supabase
      .from('backtest_performance_metrics')
      .select('*')
      .eq('backtest_id', backtestId)
      .maybeSingle();

    res.json({
      success: true,
      backtest,
      trades: trades || [],
      metrics: metrics || {}
    });

  } catch (error) {
    console.error('Error fetching backtest result:', error);
    res.status(500).json({
      error: 'バックテスト結果の取得に失敗しました'
    });
  }
});

export default router;
