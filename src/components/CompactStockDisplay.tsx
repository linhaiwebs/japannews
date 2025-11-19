import { TrendingUp } from 'lucide-react';
import { StockInfo, StockPrice } from '../types/stock';

interface CompactStockDisplayProps {
  info: StockInfo;
  latestPrice?: StockPrice;
  onAnalyze?: () => void;
}

export default function CompactStockDisplay({ info, latestPrice, onAnalyze }: CompactStockDisplayProps) {
  const isPositive = info.change.includes('+') || parseFloat(info.change) > 0;

  return (
    <div className="relative">
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img
            src="/images/left.png"
            alt=""
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-xl font-bold font-artistic" style={{ color: '#87CEEB' }}>
            {info.name} ({info.code})
          </h2>
          <img
            src="/images/right.png"
            alt=""
            className="w-8 h-8 object-contain"
          />
        </div>
        <p className="text-sm text-white mt-1">{info.timestamp}</p>
      </div>

      <div
        className="rounded-2xl shadow-lg p-6 border border-blue-300 relative"
        style={{
          backgroundImage: 'url(/images/stock.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl font-bold text-white">
                ¥{info.price}
              </div>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {info.change}
              </span>
              <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {info.changePercent}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <span className="text-white text-sm font-medium">{info.market}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <span className="text-white text-sm font-medium">{info.industry}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-xs mb-4">
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg py-1 px-1">
            <span style={{ color: '#22c55e' }} className="mb-0.5 font-medium">PER</span>
            <span className="text-white font-semibold">{info.per || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg py-1 px-1">
            <span style={{ color: '#22c55e' }} className="mb-0.5 font-medium">PBR</span>
            <span className="text-white font-semibold">{info.pbr || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg py-1 px-1">
            <span style={{ color: '#22c55e' }} className="mb-0.5 font-medium">配当</span>
            <span className="text-white font-semibold">{info.dividend || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg py-1 px-1">
            <span style={{ color: '#22c55e' }} className="mb-0.5 font-medium">時価総額</span>
            <span className="text-white font-semibold text-[10px]">{info.marketCap || 'N/A'}</span>
          </div>
        </div>

        <div className="w-full h-0.5 bg-white/40 mb-4"></div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mb-6">
          <div className="flex justify-between gap-1">
            <span style={{ color: '#22c55e' }} className="font-medium">始値</span>
            <span className="text-white font-semibold">{latestPrice?.open || info.price}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span style={{ color: '#22c55e' }} className="font-medium">高値</span>
            <span className="text-white font-semibold">{latestPrice?.high || info.price}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span style={{ color: '#22c55e' }} className="font-medium">終値</span>
            <span className="text-white font-semibold">{latestPrice?.close || info.price}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span style={{ color: '#22c55e' }} className="font-medium">安値</span>
            <span className="text-white font-semibold">{latestPrice?.low || info.price}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span style={{ color: '#22c55e' }} className="font-medium">前日比</span>
            <span className="text-white font-semibold">+{info.change}</span>
          </div>
          <div className="flex justify-between gap-1">
            <span style={{ color: '#22c55e' }} className="font-medium">売買高</span>
            <span className="text-white font-semibold">{latestPrice?.volume || 'N/A'}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative inline-block w-full">
            <div
              className="absolute inset-0 rounded-xl translate-y-1.5"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 200, 87, 0.6) 0%, rgba(255, 180, 70, 0.6) 100%)',
                zIndex: 0
              }}
            ></div>
            <button
              onClick={onAnalyze}
              className="relative w-full font-bold py-3 px-6 rounded-xl text-white transition-all duration-200 hover:translate-y-0.5 active:translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 50%, #4A90E2 100%)',
                zIndex: 1
              }}
            >
              参考情報を表示
            </button>
          </div>
          <p className="text-center mt-2 text-xs text-amber-300 font-bold">
            ※本情報は参考資料であり投資助言ではありません
          </p>
          <p className="text-center mt-1 text-xs text-white/70 font-light">
            データのセキュリティは厳重に保護されています
          </p>
        </div>
      </div>
    </div>
  );
}
