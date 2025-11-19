import { X, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import RobotScholarIcon from './RobotScholarIcon';
import { trackEvent, trackConversion } from '../lib/googleTracking';
import { userTracking } from '../lib/userTracking';

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
}

const formatAnalysisText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const formattedLine = line.replace(/(\d+\.?\d*%?|\d+円|[+-]\d+\.?\d*)/g, (match) => {
      return `<span class="text-mizuho-cyan font-semibold text-base">${match}</span>`;
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
}: NewDiagnosisModalProps) {
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
      <div className="relative w-full max-w-2xl max-h-[90vh] z-[9999]" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-2xl overflow-hidden border-3 border-white">
          <div className="relative sticky top-0 bg-cyan-gradient px-3 py-2 flex items-center justify-between border-b-3 border-mizuho-cyan-dark backdrop-blur-sm z-10 shadow-lg">
          <div className="flex-1 text-center pr-6">
            <h2 className="text-sm sm:text-base font-bold text-white drop-shadow-lg font-artistic">
              {stockName}（{stockCode}）参考情報
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm hover:shadow-lg"
            aria-label="閉じる"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>

        <div className="relative overflow-y-auto max-h-[calc(90vh-100px)] px-3 py-2 sm:px-4 sm:py-3 space-y-2 bg-gradient-to-br from-blue-50 to-cyan-50">

          <p className="text-[10px] sm:text-xs text-center text-gray-600 mb-2">
            データ出典: 公開市場情報（準リアルタイム）| 参考資料（投資助言ではありません）
          </p>

          <div className="relative bg-white/80 backdrop-blur-xl rounded-lg p-3 sm:p-4 border-2 border-mizuho-cyan/30 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-mizuho-cyan/20 to-mizuho-blue/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-tr from-mizuho-cyan/20 to-mizuho-blue/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative space-y-2">
              <div className="bg-white rounded-lg p-2 sm:p-3 border-2 border-mizuho-cyan/30 backdrop-blur-sm shadow-lg">
                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-1">
                  {isConnecting ? (
                    <div className="text-center py-4">
                      <p className="text-mizuho-cyan font-bold text-sm">市場データ読み込み中...</p>
                    </div>
                  ) : (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysis) }} />
                      {isStreaming && (
                        <span className="inline-block w-2 h-4 bg-cyan-gradient animate-pulse ml-1"></span>
                      )}
                    </>
                  )}
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
                    className="relative overflow-hidden w-full text-white font-bold py-2 px-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm mt-3 group"
                    style={{
                      willChange: 'transform',
                      background: 'linear-gradient(135deg, #00A3AF 0%, #00C4D0 25%, #00A3AF 50%, #008A94 75%, #00A3AF 100%)',
                      backgroundSize: '200% 100%',
                      border: '2px solid rgba(0, 163, 175, 0.6)',
                      boxShadow: '0 8px 24px rgba(0, 163, 175, 0.5), 0 4px 12px rgba(0, 163, 175, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-15 animate-gradient-shift"
                      style={{
                        background: 'linear-gradient(90deg, rgba(0,163,175,0.3) 0%, rgba(0,196,208,0.5) 50%, rgba(0,163,175,0.3) 100%)',
                        backgroundSize: '200% 100%'
                      }}
                    />

                    <div
                      className="absolute inset-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-[shimmer-sweep_2s_ease-in-out]"
                      style={{
                        animation: 'shimmer-sweep 5s ease-in-out infinite',
                        animationDelay: '1.5s',
                        opacity: 0.1
                      }}
                    />

                    <ExternalLink className="relative w-4 h-4 animate-icon-bounce drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                    <span className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.3)' }}>LINEで情報を受け取る</span>
                  </button>

                  <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-300">
                    <p className="text-[10px] sm:text-xs text-amber-800 font-semibold leading-relaxed">
                      ※LINEで参考情報をお届けします。本情報は投資助言・推奨ではありません。
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
