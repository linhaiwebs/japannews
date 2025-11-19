import { apiClient } from './apiClient';

export interface BacktestRequest {
  stockCode: string;
  strategyId: string;
  strategyParams?: Record<string, any>;
  startDate?: string;
  endDate?: string;
}

export interface BacktestResults {
  success: boolean;
  backtest_id: string;
  results: {
    initial_capital: number;
    final_capital: number;
    total_return: number;
    trade_count: number;
    max_drawdown: number;
    execution_time_ms: number;
    trades: any[];
    portfolio_value: any[];
    performance_metrics: {
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
    };
    monthly_returns: any[];
    strategy_name: string;
    stock_code: string;
    start_date: string;
    end_date: string;
  };
}

export interface StrategyTemplate {
  id: string;
  strategy_name: string;
  strategy_description: string;
  strategy_logic: Record<string, any>;
  default_params: Record<string, any>;
  is_active: boolean;
}

export async function executeBacktest(request: BacktestRequest): Promise<BacktestResults> {
  const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/backtest/execute`;

  const endDate = request.endDate || new Date().toISOString().split('T')[0];
  const startDate = request.startDate || (() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 5);
    return date.toISOString().split('T')[0];
  })();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stockCode: request.stockCode,
      strategyId: request.strategyId,
      strategyParams: request.strategyParams || {},
      startDate,
      endDate
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'バックテスト実行に失敗しました');
  }

  return await response.json();
}

export async function fetchStrategies(): Promise<StrategyTemplate[]> {
  const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/backtest/strategies`;

  const response = await apiClient.get(apiUrl);

  if (!response.ok) {
    throw new Error('戦略テンプレートの取得に失敗しました');
  }

  const data = await response.json();
  return data.strategies || [];
}

export async function fetchBacktestResult(backtestId: string) {
  const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/backtest/result/${backtestId}`;

  const response = await apiClient.get(apiUrl);

  if (!response.ok) {
    throw new Error('バックテスト結果の取得に失敗しました');
  }

  return await response.json();
}

export function formatBacktestSummary(results: BacktestResults['results']): string {
  const { performance_metrics, total_return, trade_count, strategy_name } = results;

  const summary = `
【${strategy_name}の過去データ検証結果】

過去5年間の実際の市場データを使用した回溯テスト結果：

■ 総合パフォーマンス
・総収益率: ${total_return.toFixed(2)}%
・シャープレシオ: ${performance_metrics.sharpe_ratio.toFixed(4)}
・最大ドローダウン: ${performance_metrics.max_drawdown.toFixed(2)}%

■ 取引統計
・総取引回数: ${trade_count}回
・勝率: ${(performance_metrics.win_rate * 100).toFixed(2)}%
・プロフィットファクター: ${performance_metrics.profit_factor.toFixed(2)}

■ 損益分析
・平均利益: ¥${performance_metrics.avg_profit.toFixed(2)}
・平均損失: ¥${performance_metrics.avg_loss.toFixed(2)}
・最大連続勝利: ${performance_metrics.max_consecutive_wins}回
・最大連続損失: ${performance_metrics.max_consecutive_losses}回

この結果は実際の過去5年間の市場データに基づいており、完全な取引履歴、技術指標の詳細、リスク管理記録は、上部の各アイコンからPDF/Excelレポートとしてダウンロードできます。

重要事項：
- 本情報は過去データに基づく統計的検証結果であり、投資助言・推奨ではありません
- 過去のパフォーマンスは将来の投資成果を保証するものではありません
- 実際の投資判断は、必ずご自身の責任において行ってください
  `.trim();

  return summary;
}
