import RadarAnimation from './RadarAnimation';
import GradientButton from './GradientButton';

interface HeroSectionProps {
  stockCode?: string;
  stockName?: string;
  onDiagnosis?: () => void;
  disabled?: boolean;
}

export default function HeroSection({ stockCode = '----', stockName = '', onDiagnosis, disabled = false }: HeroSectionProps) {
  const hasStockData = stockCode !== '----' && stockName;

  return (
    <div className="relative w-full mt-[50px]">
      <div className="w-full px-4 py-6 flex flex-col items-center">
        <RadarAnimation />
      </div>

      {onDiagnosis && (
        <div className="px-4 py-3">
          <div className="max-w-lg mx-auto">
            <button
              onClick={onDiagnosis}
              disabled={disabled}
              className="relative group w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <GradientButton className="animate-glow-ring-red">
                <div
                  className="absolute inset-0 opacity-15 animate-gradient-shift"
                  style={{
                    background: 'linear-gradient(90deg, rgba(185,28,28,0.3) 0%, rgba(239,68,68,0.5) 50%, rgba(185,28,28,0.3) 100%)',
                    backgroundSize: '200% 100%'
                  }}
                />

                <div className="relative flex flex-col items-center gap-1 py-4 px-6">
                  <span className="text-white font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.3)' }}>
                    {hasStockData ? `【${stockName}】` : '銘柄'}の情報を見る
                  </span>
                  <span className="text-xs text-red-50 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>※教育・学習用の情報表示ツール</span>
                </div>
              </GradientButton>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
