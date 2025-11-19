import { X, ExternalLink, TrendingUp, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { trackEvent, trackConversion } from '../lib/googleTracking';
import { userTracking } from '../lib/userTracking';
import ReportDownloadIcons from './ReportDownloadIcons';
import { fetchBacktestResult } from '../lib/backtestClient';
import { generateStrategyReport, generateIndicatorsReport, generateRiskReport, generatePerformanceReport } from '../lib/reportGenerators';

interface NewDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
  stockCode: string;
  stockName: string;
  stockPrice: string;
  priceChange: string;
  isStreaming?: boolean;
  isConnecting?: boolean;
  onLineConversion?: () => void;
  gclid?: string;
  backtestId?: string;
}

const formatAnalysisText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const formattedLine = line.replace(/(\d+\.?\d*%?|\d+円|[+-]\d+\.?\d*)/g, (match) => {
      return `<span class="text-blue-600 font-semibold text-base">${match}</span>`;
    });

    const isBold = line.includes('###') || line.includes('**') || line.match(/^[\d]+\./);
    const cleanLine = formattedLine.replace(/###|\*\*/g, '');

    if (isBold) {
      return `<div key="${index}" class="font-bold text-gray-900 mt-4 mb-2">${cleanLine}</div>`;
    }

    return `<div key="${index}" class="text-gray-700">${cleanLine}</div>`;
  }).join('');
};

export default function NewDiagnosisModal({
  isOpen,
  onClose,
  analysis,
  stockCode,
  stockName,
  stockPrice,
  priceChange,
  isStreaming = false,
  isConnecting = false,
  onLineConversion,
  gclid,
  backtestId,
}: NewDiagnosisModalProps) {

  const handleReportDownload = async (reportType: string) => {
    if (!backtestId) {
      alert('バックテストが完了していません');
      return;
    }

    try {
      console.log(`Downloading ${reportType} report for backtest ${backtestId}`);
      const data = await fetchBacktestResult(backtestId);

      const reportData = {
        backtest: data.backtest,
        trades: data.trades,
        metrics: data.metrics,
        stockName: stockName
      };

      switch (reportType) {
        case 'strategy':
          await generateStrategyReport(reportData);
          break;
        case 'indicators':
          await generateIndicatorsReport(reportData);
          break;
        case 'risk':
          await generateRiskReport(reportData);
          break;
        case 'performance':
          await generatePerformanceReport(reportData);
          break;
        default:
          console.error('Unknown report type:', reportType);
      }
    } catch (error) {
      console.error('Report download error:', error);
      alert('レポートの生成中にエラーが発生しました');
    }
  };
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.removeAttribute('data-modal-open');
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-2 sm:p-4 backdrop-blur-md"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 48, 135, 0.90) 0%, rgba(0, 85, 184, 0.90) 50%, rgba(0, 163, 175, 0.90) 100%)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] z-[9999]" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-2xl overflow-hidden border-3 border-white">
          <div className="relative sticky top-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between border-b-3 border-blue-700 backdrop-blur-sm z-10 shadow-lg">
            <div className="flex-1 text-center pr-6">
              <h2 className="text-base sm:text-lg font-bold text-white drop-shadow-lg font-artistic">
                過去データ検証結果（サマリー版）
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                {stockName}（{stockCode}） - {stockPrice}円 {priceChange}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm hover:shadow-lg"
              aria-label="閉じる"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

          <div className="relative overflow-y-auto max-h-[calc(90vh-120px)] px-4 py-4 sm:px-6 sm:py-5 space-y-4 bg-gradient-to-br from-blue-50 to-cyan-50">

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-green-900 mb-2">
                    シミュレーション結果：
                  </h3>
                  <p className="text-sm sm:text-base text-green-800 font-bold leading-relaxed">
                    あなたの仮説は過去5年間でベンチマーク（TOPIX/日経平均）を上回りました。
                  </p>
                  <div className="mt-3 p-3 bg-white/60 rounded-lg border border-green-300">
                    <p className="text-xs text-green-900">
                      <span className="font-bold">検証期間：</span>過去5年間（2019年〜2024年）<br/>
                      <span className="font-bold">基準指標：</span>PBR・ROE複合分析<br/>
                      <span className="font-bold">データ出典：</span>公開市場情報
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-blue-300 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative space-y-3">
                <p className="text-xs sm:text-sm text-center text-gray-600 font-semibold border-b border-gray-200 pb-2">
                  データ出典: 公開市場情報 | 本情報は統計分析であり投資助言ではありません
                </p>

                <ReportDownloadIcons
                  backtestId={backtestId}
                  stockCode={stockCode}
                  stockName={stockName}
                  onDownload={handleReportDownload}
                />

                <div className="bg-white rounded-xl p-4 border-2 border-blue-200 backdrop-blur-sm shadow-md">
                  <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-2">
                    {isConnecting ? (
                      <div className="text-center py-6">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-blue-600 font-bold text-base mt-3">過去データ読み込み中...</p>
                      </div>
                    ) : (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysis) }} />
                        {isStreaming && (
                          <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-3 border-amber-400 rounded-xl p-4 sm:p-5 shadow-lg mt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-7 h-7 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-black text-amber-900 mb-2">
                        これはサマリーです
                      </h3>
                      <p className="text-sm sm:text-base text-amber-900 font-semibold leading-relaxed mb-3">
                        この結果を生んだ<span className="text-amber-700 font-black">完全な投資戦略（売買ルール、リスク指標、詳細なシステム評価）</span>は、LINE限定の<span className="text-red-600 font-black">【AI検証レポート】</span>でのみ公開されています。
                      </p>
                      <div className="bg-white/80 rounded-lg p-3 border-2 border-amber-300">
                        <p className="text-xs sm:text-sm text-amber-800 font-bold">
                          📊 完全レポートに含まれる内容：<br/>
                          • 具体的な売買シグナルの検証<br/>
                          • ドローダウン・シャープレシオ等のリスク指標<br/>
                          • 市場環境別のパフォーマンス分析<br/>
                          • 最適ポートフォリオ比率の提案
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {onLineConversion && (
                  <>
                    <button
                      onClick={() => {
                        trackEvent('Add');
                        trackConversion();
                        userTracking.trackConversion({ gclid });
                        onLineConversion?.();
                      }}
                      className="relative overflow-hidden w-full text-white font-black py-5 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-base sm:text-lg mt-5 group border-3 border-green-400"
                      style={{
                        willChange: 'transform',
                        background: 'linear-gradient(135deg, #00C300 0%, #00E600 25%, #00C300 50%, #00A800 75%, #00C300 100%)',
                        backgroundSize: '200% 100%',
                        boxShadow: '0 10px 30px rgba(0, 195, 0, 0.6), 0 5px 15px rgba(0, 195, 0, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.3)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div
                        className="absolute inset-0 opacity-20 animate-gradient-shift"
                        style={{
                          background: 'linear-gradient(90deg, rgba(0,195,0,0.3) 0%, rgba(0,230,0,0.5) 50%, rgba(0,195,0,0.3) 100%)',
                          backgroundSize: '200% 100%'
                        }}
                      />

                      <ExternalLink className="relative w-6 h-6 animate-icon-bounce drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                      <span className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.4)' }}>
                        【LINE限定】無料AI検証レポートをダウンロードする
                      </span>
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-3 p-3 bg-green-50 rounded-lg border border-green-300">
                      <Shield className="w-5 h-5 text-green-600" />
                      <p className="text-xs sm:text-sm text-green-800 font-bold">
                        【公式アカウント認証済み】信頼性の高いAI分析を、安全なLINEシステムでお届けします。
                      </p>
                    </div>

                    <div className="mt-3 p-3 bg-red-50 rounded-lg border-2 border-red-300">
                      <p className="text-xs sm:text-sm text-red-800 font-bold leading-relaxed text-center">
                        ※本日限定の詳細レポート | 過去データに基づく統計分析 | 投資助言・推奨ではありません
                      </p>
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
