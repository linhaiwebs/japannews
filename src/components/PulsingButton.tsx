import { Sparkles, Zap } from 'lucide-react';
import GradientButton from './GradientButton';

interface PulsingButtonProps {
  onClick: () => void;
  stockName?: string;
  disabled?: boolean;
}

export default function PulsingButton({ onClick, stockName = '', disabled = false }: PulsingButtonProps) {
  const buttonText = stockName ? `【${stockName}】の情報を表示` : '銘柄情報を表示';

  const handleClick = () => {
    onClick();
  };

  return (
    <div className="flex justify-center px-4 my-8">
      <div className="max-w-lg w-full">
        <button
          onClick={handleClick}
          disabled={disabled}
          className="relative group disabled:opacity-50 disabled:cursor-not-allowed w-full transform transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <GradientButton className="animate-button-pulse animate-glow-ring-red">
            <div className="relative px-8 py-5 overflow-hidden" style={{ willChange: 'transform' }}>
              <div
                className="absolute inset-0 opacity-20 animate-gradient-shift"
                style={{
                  background: 'linear-gradient(90deg, rgba(185,28,28,0.3) 0%, rgba(239,68,68,0.5) 25%, rgba(248,113,113,0.4) 50%, rgba(239,68,68,0.5) 75%, rgba(185,28,28,0.3) 100%)',
                  backgroundSize: '200% 100%'
                }}
              />

              <div
                className="absolute inset-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-[shimmer-sweep_2s_ease-in-out]"
                style={{
                  animation: 'shimmer-sweep 4s ease-in-out infinite',
                  animationDelay: '1s',
                  opacity: 0.15
                }}
              />

              <div className="relative flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 animate-spin text-red-100 drop-shadow-[0_0_8px_rgba(252,165,165,0.9)]" style={{ animationDuration: '3s', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                  <span className="font-black text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.3)' }}>{buttonText}</span>
                  <Zap className="w-6 h-6 text-red-100 animate-icon-bounce drop-shadow-[0_0_8px_rgba(252,165,165,0.9)]" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                </div>
                <span className="text-xs text-red-50 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>※教育・学習用の情報表示</span>
              </div>
            </div>
          </GradientButton>
        </button>
      </div>
    </div>
  );
}
