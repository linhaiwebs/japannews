import { useState, useEffect, useRef } from 'react';
import NewHeader from '../components/NewHeader';
import DiagnosisLoadingOverlay from '../components/DiagnosisLoadingOverlay';
import NewDiagnosisModal from '../components/NewDiagnosisModal';
import CompactStockDisplay from '../components/CompactStockDisplay';
import StockAnalysisTitle from '../components/StockAnalysisTitle';
import RotatingAIBadge from '../components/RotatingAIBadge';
import ScrollingHistoryData from '../components/ScrollingHistoryData';
import { StockData } from '../types/stock';
import { DiagnosisState } from '../types/diagnosis';
import { useUrlParams } from '../hooks/useUrlParams';
import { apiClient } from '../lib/apiClient';
import { userTracking } from '../lib/userTracking';
import { trackEvent } from '../lib/googleTracking';
import { executeBacktest, fetchStrategies, formatBacktestSummary, type BacktestResults } from '../lib/backtestClient';

const getDefaultStockData = (code: string): StockData => ({
  info: {
    code: code || '----',
    name: 'データ取得中...',
    price: '---',
    change: '0.0',
    changePercent: '0.00%',
    per: 'N/A',
    pbr: 'N/A',
    dividend: 'N/A',
    industry: 'N/A',
    marketCap: 'N/A',
    market: 'N/A',
    timestamp: new Date().toLocaleString('ja-JP'),
  },
  prices: [
    {
      date: new Date().toLocaleDateString('ja-JP'),
      open: '---',
      high: '---',
      low: '---',
      close: '---',
      volume: '---',
      change: '0.0',
      changePercent: '0.00%',
      per: 'N/A',
      pbr: 'N/A',
      dividend: 'N/A',
      code: code || '----',
    }
  ]
});

export default function NewHome() {
  const urlParams = useUrlParams();
  const [stockCode, setStockCode] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRealData, setHasRealData] = useState(false);

  const [diagnosisState, setDiagnosisState] = useState<DiagnosisState>('initial');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [diagnosisStartTime, setDiagnosisStartTime] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);
  const [backtestId, setBacktestId] = useState<string>('');
  const [backtestResults, setBacktestResults] = useState<BacktestResults | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (urlParams.code) {
      setStockCode(urlParams.code);
      fetchStockData(urlParams.code);
    } else {
      const defaultCode = '----';
      setStockCode(defaultCode);
      setStockData(getDefaultStockData(defaultCode));
      setHasRealData(false);
    }
  }, [urlParams.code]);

  useEffect(() => {
    const trackPageVisit = async () => {
      if (stockData) {
        await userTracking.trackPageLoad({
          stockCode: stockCode,
          stockName: stockData.info.name,
          urlParams: {
            src: urlParams.src || '',
            gclid: urlParams.gclid || '',
            racText: urlParams.racText || '',
            code: urlParams.code || ''
          }
        });
      }
    };

    trackPageVisit();
  }, [stockData, stockCode, urlParams]);

  const fetchStockData = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/stock/data?code=${code}`);

      if (!response.ok) {
        throw new Error('株価データの取得に失敗しました');
      }

      const data = await response.json();
      setStockData(data);
      setStockCode(code);
      setHasRealData(true);
    } catch (err) {
      console.warn('Stock data fetch failed, using default data:', err);
      setStockData(getDefaultStockData(code));
      setStockCode(code);
      setHasRealData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const runDiagnosis = async () => {
    if (diagnosisState !== 'initial' || !stockData || !hasRealData) return;

    trackEvent('Bdd');

    setDiagnosisState('connecting');
    setDiagnosisStartTime(Date.now());
    setAnalysisResult('');
    setLoadingProgress(0);
    setShowLoadingOverlay(true);
    setBacktestId('');
    setBacktestResults(null);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 85) {
          return prev + Math.random() * 15;
        } else if (prev < 95) {
          return prev + Math.random() * 2;
        }
        return prev;
      });
    }, 100);

    try {
      console.log('Fetching available strategies...');
      const strategies = await fetchStrategies();

      if (!strategies || strategies.length === 0) {
        throw new Error('利用可能な戦略が見つかりません');
      }

      const defaultStrategy = strategies.find(s => s.strategy_name === 'SMA Golden Cross') || strategies[0];

      console.log(`Executing backtest with strategy: ${defaultStrategy.strategy_name}`);

      const backtestResult = await executeBacktest({
        stockCode: stockCode,
        strategyId: defaultStrategy.id,
        strategyParams: defaultStrategy.default_params
      });

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setLoadingProgress(100);

      setTimeout(() => {
        setShowLoadingOverlay(false);
        setDiagnosisState('results');

        const summary = formatBacktestSummary(backtestResult.results);
        setAnalysisResult(summary);
        setBacktestId(backtestResult.backtest_id);
        setBacktestResults(backtestResult);

        const durationMs = Date.now() - diagnosisStartTime;
        userTracking.trackDiagnosisClick({
          stockCode: stockCode,
          stockName: stockData.info.name,
          durationMs: durationMs
        });
      }, 600);

    } catch (err) {
      console.error('Backtest error:', err);
      let errorMessage = 'バックテスト実行中にエラーが発生しました';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setDiagnosisState('error');
      setShowLoadingOverlay(false);
      setLoadingProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };


  const closeModal = () => {
    setDiagnosisState('initial');
    setAnalysisResult('');
    setLoadingProgress(0);
    setShowLoadingOverlay(false);
    setDiagnosisStartTime(0);
    setError(null);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleLineConversion = async () => {
    try {
      console.log('Fetching LINE redirect link...');
      const response = await apiClient.get('/api/line-redirects/select');
      const data = await response.json();

      console.log('Redirect API response:', data);

      if (data.success && data.link) {
        console.log('Redirecting to:', data.link.redirect_url);
        window.location.href = data.link.redirect_url;
      } else {
        console.error('No redirect link available:', data.error);
        alert('リダイレクトリンクの取得に失敗しました。管理画面でリダイレクトリンクを設定してください。');
      }
    } catch (error) {
      console.error('Failed to get LINE redirect:', error);
      alert('ネットワークエラーが発生しました。リダイレクトリンクを取得できません。');
    }
  };

  return (
    <div className="min-h-screen relative" style={{ margin: 0, padding: 0 }}>
      <NewHeader stockCode={stockCode} stockName={stockData?.info.name} />

      <div style={{ margin: 0, padding: 0 }}>
        {loading && (
          <div className="text-center py-12 md:py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-mizuho-cyan border-t-white"></div>
            <p className="mt-4 text-mizuho-blue font-medium text-sm sm:text-base">株価データを読み込んでいます...</p>
          </div>
        )}

        {diagnosisState === 'initial' && (
          <>
            <StockAnalysisTitle
              stockName={stockData?.info.name || 'データ取得中'}
              stockCode={stockCode}
            />

            <div className="relative max-w-xl mx-auto px-4 py-8 md:py-12">
              <RotatingAIBadge />

              <div className="relative z-10">
                <CompactStockDisplay
                  info={stockData?.info || getDefaultStockData('----').info}
                  latestPrice={stockData?.prices[0]}
                  onAnalyze={runDiagnosis}
                />
              </div>

              <div className="mt-8 relative">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <img
                    src="/images/left.png"
                    alt=""
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  />
                  <h2 className="text-xl md:text-2xl font-bold text-white text-center font-artistic">
                    歴史データ表示
                  </h2>
                  <img
                    src="/images/right.png"
                    alt=""
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  />
                </div>
                <p className="text-xs md:text-sm text-blue-200 font-semibold text-center px-4 mb-2">
                  過去の市場データに基づく客観的情報
                </p>
                <p className="text-xs text-amber-300 font-bold text-center px-4 mb-6">
                  ※本情報は統計データであり、投資助言・推奨ではありません
                </p>
                <div className="mb-6 flex justify-center">
                  <div className="relative inline-block w-full max-w-md px-4">
                    <div
                      className="absolute inset-0 rounded-xl translate-y-1.5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 200, 87, 0.6) 0%, rgba(255, 180, 70, 0.6) 100%)',
                        zIndex: 0
                      }}
                    ></div>
                    <button
                      onClick={runDiagnosis}
                      className="relative w-full font-bold py-4 px-8 rounded-xl text-white transition-all duration-200 hover:translate-y-0.5 active:translate-y-1 text-base"
                      style={{
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 50%, #4A90E2 100%)',
                        zIndex: 1
                      }}
                    >
                      分析レポートを即時生成する
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <ScrollingHistoryData
                    prices={stockData?.prices || []}
                    stockName={stockData?.info.name || 'データ取得中...'}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <DiagnosisLoadingOverlay
          isVisible={showLoadingOverlay}
          progress={loadingProgress}
          onComplete={() => setShowLoadingOverlay(false)}
        />

        {diagnosisState === 'error' && (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-2xl mx-auto p-5 sm:p-6 md:p-8 bg-white/20 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">情報取得エラー</h3>
              <p className="text-sm sm:text-base text-white font-semibold mb-5 sm:mb-6">{error}</p>
              <button
                onClick={() => {
                  setDiagnosisState('initial');
                  setError(null);
                }}
                className="w-full bg-cyan-gradient text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
              >
                もう一度試す
              </button>
            </div>
          </div>
        )}

        <NewDiagnosisModal
          isOpen={diagnosisState === 'streaming' || diagnosisState === 'results'}
          onClose={closeModal}
          analysis={analysisResult}
          stockCode={stockCode}
          stockName={stockData?.info.name || ''}
          stockPrice={stockData?.info.price || ''}
          priceChange={`${stockData?.info.change || ''} (${stockData?.info.changePercent || ''})`}
          isStreaming={diagnosisState === 'streaming'}
          isConnecting={diagnosisState === 'connecting'}
          onLineConversion={handleLineConversion}
          gclid={urlParams.gclid}
          backtestId={backtestId}
        />
      </div>
    </div>
  );
}
