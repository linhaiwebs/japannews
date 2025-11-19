import { useState, useEffect } from 'react';
import { executeBacktest, fetchStrategies, BacktestResults, StrategyTemplate } from '../lib/backtestClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, Award, AlertCircle } from 'lucide-react';

export default function Backtest() {
  const [stockCode, setStockCode] = useState('7203');
  const [strategies, setStrategies] = useState<StrategyTemplate[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [error, setError] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadStrategies();
    setDefaultDates();
  }, []);

  const setDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 5);

    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  const loadStrategies = async () => {
    try {
      const strategyList = await fetchStrategies();
      setStrategies(strategyList);
      if (strategyList.length > 0) {
        setSelectedStrategy(strategyList[0].id);
      }
    } catch (err) {
      console.error('Failed to load strategies:', err);
      setError('戦略テンプレートの読み込みに失敗しました');
    }
  };

  const handleExecuteBacktest = async () => {
    if (!stockCode || !selectedStrategy) {
      setError('銘柄コードと戦略を選択してください');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const result = await executeBacktest({
        stockCode,
        strategyId: selectedStrategy,
        startDate,
        endDate
      });

      setResults(result);
    } catch (err: any) {
      console.error('Backtest execution failed:', err);
      setError(err.message || 'バックテストの実行に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            バックテストシステム
          </h1>
          <p className="text-lg text-gray-600">
            過去の市場データを使用して投資戦略のパフォーマンスを検証
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">バックテスト設定</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                銘柄コード
              </label>
              <input
                type="text"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
                placeholder="7203"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                戦略テンプレート
              </label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.strategy_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                開始日
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                終了日
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {selectedStrategy && strategies.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">戦略の説明</h3>
              <p className="text-gray-700">
                {strategies.find(s => s.id === selectedStrategy)?.strategy_description}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleExecuteBacktest}
            disabled={loading || !stockCode || !selectedStrategy}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Activity className="w-5 h-5 mr-2 animate-spin" />
                バックテスト実行中...
              </span>
            ) : (
              'バックテストを実行'
            )}
          </button>
        </div>

        {results && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="総収益率"
                value={formatPercent(results.results.total_return)}
                icon={results.results.total_return >= 0 ? TrendingUp : TrendingDown}
                color={results.results.total_return >= 0 ? 'green' : 'red'}
              />
              <MetricCard
                title="最終資金"
                value={formatCurrency(results.results.final_capital)}
                icon={DollarSign}
                color="blue"
              />
              <MetricCard
                title="取引回数"
                value={`${results.results.trade_count}回`}
                icon={Activity}
                color="purple"
              />
              <MetricCard
                title="シャープレシオ"
                value={results.results.performance_metrics.sharpe_ratio.toFixed(4)}
                icon={Award}
                color="indigo"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">パフォーマンス指標</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PerformanceItem
                  label="最大ドローダウン"
                  value={formatPercent(results.results.performance_metrics.max_drawdown)}
                />
                <PerformanceItem
                  label="勝率"
                  value={formatPercent(results.results.performance_metrics.win_rate * 100)}
                />
                <PerformanceItem
                  label="プロフィットファクター"
                  value={results.results.performance_metrics.profit_factor.toFixed(2)}
                />
                <PerformanceItem
                  label="平均利益"
                  value={formatCurrency(results.results.performance_metrics.avg_profit)}
                />
                <PerformanceItem
                  label="平均損失"
                  value={formatCurrency(results.results.performance_metrics.avg_loss)}
                />
                <PerformanceItem
                  label="最大連続勝利"
                  value={`${results.results.performance_metrics.max_consecutive_wins}回`}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ポートフォリオ価値の推移</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={results.results.portfolio_value}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="ポートフォリオ価値"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">月次リターン</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.results.monthly_returns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPercent(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                  <Bar
                    dataKey="return_pct"
                    name="月次リターン"
                    fill="#3b82f6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">取引履歴</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">日付</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">タイプ</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">価格</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">数量</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">手数料</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">シグナル理由</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.trades.map((trade, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{trade.trade_date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            trade.trade_type === 'buy'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.trade_type === 'buy' ? '買い' : '売り'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900">
                          {formatCurrency(trade.price)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900">{trade.quantity}</td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(trade.commission)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{trade.signal_reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">重要事項</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 本情報は過去データに基づく統計的検証結果であり、投資助言・推奨ではありません</li>
                <li>• 過去のパフォーマンスは将来の投資成果を保証するものではありません</li>
                <li>• 実際の投資判断は、必ずご自身の責任において行ってください</li>
                <li>• バックテスト結果には取引コストやスリッページが含まれています</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'green' | 'red' | 'blue' | 'purple' | 'indigo';
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-rose-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-pink-600',
    indigo: 'from-indigo-500 to-blue-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-600">{title}</span>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

interface PerformanceItemProps {
  label: string;
  value: string;
}

function PerformanceItem({ label, value }: PerformanceItemProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  );
}
