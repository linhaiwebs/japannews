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

    // 清除之前的interval（如果存在）
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
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/gemini/diagnosis`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: stockCode,
          stockData: {
            name: stockData.info.name,
            price: stockData.info.price,
            change: stockData.info.change,
            changePercent: stockData.info.changePercent,
            per: stockData.info.per,
            pbr: stockData.info.pbr,
            dividend: stockData.info.dividend,
            industry: stockData.info.industry,
            marketCap: stockData.info.marketCap,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      if (!response.ok) {
        throw new Error('情報の取得に失敗しました');
      }

      setDiagnosisState('processing');

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullAnalysis = '';
        let firstChunk = true;

        if (!reader) {
          throw new Error('ストリーム読み取りに失敗しました');
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              try {
                const parsed = JSON.parse(data);

                if (parsed.error) {
                  throw new Error(parsed.error);
                }

                if (parsed.content) {
                  fullAnalysis += parsed.content;

                  if (firstChunk && fullAnalysis.trim().length > 0) {
                    setLoadingProgress(100);
                    setTimeout(() => {
                      setShowLoadingOverlay(false);
                      setDiagnosisState('streaming');
                    }, 600);
                    firstChunk = false;
                  }

                  setAnalysisResult(fullAnalysis);
                }

                if (parsed.done) {
                  setDiagnosisState('results');

                  const durationMs = Date.now() - diagnosisStartTime;
                  await userTracking.trackDiagnosisClick({
                    stockCode: stockCode,
                    stockName: stockData.info.name,
                    durationMs: durationMs
                  });
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
              }
            }
          }
        }
      } else {
        const result = await response.json();

        if (!result.analysis || result.analysis.trim() === '') {
          throw new Error('参考情報が取得できませんでした');
        }

        setAnalysisResult(result.analysis);
        setDiagnosisState('results');

        const durationMs = Date.now() - diagnosisStartTime;
        await userTracking.trackDiagnosisClick({
          stockCode: stockCode,
          stockName: stockData.info.name,
          durationMs: durationMs
        });
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
      let errorMessage = '情報取得中にエラーが発生しました';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'リクエストがタイムアウトしました';
        } else {
          errorMessage = err.message;
        }
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
      <NewHeader />

      <div style={{ margin: 0, padding: 0 }}>
        {loading && (
          <div className="text-center py-12 md:py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-mizuho-cyan border-t-white"></div>
            <p className="mt-4 text-mizuho-blue font-medium text-sm sm:text-base">株価データを読み込んでいます...</p>
          </div>
        )}

        {diagnosisState === 'initial' && (
          <>
            <StockAnalysisTitle stockName={stockData?.info.name || 'データ取得中'} />

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
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img
                    src="/images/left.png"
                    alt=""
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  />
                  <h2 className="text-xl md:text-2xl font-bold text-white text-center font-artistic">
                    株式データ履歴
                  </h2>
                  <img
                    src="/images/right.png"
                    alt=""
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  />
                </div>
                <p className="text-xs md:text-sm text-white font-bold text-center px-4 mb-2">
                  過去の株式市場データの参考表示
                </p>
                <p className="text-xs text-amber-300 font-bold text-center px-4 mb-6">
                  ※投資判断はご自身の責任で行ってください
                </p>
                <div className="mb-6 flex justify-center">
                  <div className="relative inline-block">
                    <div
                      className="absolute inset-0 rounded-xl translate-y-1.5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 200, 87, 0.6) 0%, rgba(255, 180, 70, 0.6) 100%)',
                        zIndex: 0
                      }}
                    ></div>
                    <button
                      onClick={runDiagnosis}
                      className="relative font-bold py-3 px-10 rounded-xl text-white transition-all duration-200 hover:translate-y-0.5 active:translate-y-1"
                      style={{
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 50%, #4A90E2 100%)',
                        zIndex: 1
                      }}
                    >
                      参考情報を表示
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
        />
      </div>
    </div>
  );
}
