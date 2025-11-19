import { StockPrice } from '../types/stock';

interface ScrollingHistoryDataProps {
  prices: StockPrice[];
  stockName: string;
}

const getPlaceholderPrices = (): StockPrice[] => {
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return {
      date: date.toLocaleDateString('ja-JP'),
      open: '---',
      high: '---',
      low: '---',
      close: '---',
      volume: '---',
      change: '---',
      changePercent: '---',
      per: 'N/A',
      pbr: 'N/A',
      dividend: 'N/A',
      code: '----',
    };
  });
};

export default function ScrollingHistoryData({ prices, stockName }: ScrollingHistoryDataProps) {
  const displayPrices = prices.length > 0 ? prices : getPlaceholderPrices();
  const infinitePrices = [...displayPrices.slice(0, 10), ...displayPrices.slice(0, 10), ...displayPrices.slice(0, 10)];

  return (
    <div className="px-4 py-3">
      <div className="max-w-lg mx-auto">
        <div className="relative z-10 px-6 py-2 h-[330px] overflow-hidden">
          <div className="animate-scroll-up">
            {infinitePrices.map((price, index) => {
              return (
                <div
                  key={`${price.date}-${index}`}
                  className="h-[110px] flex flex-col justify-center px-3 py-2 rounded-lg mb-2"
                  style={{
                    backgroundImage: 'url(/images/slider.png)',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="text-center mb-1">
                    <div className="flex items-center justify-center gap-3 text-sm mb-1">
                      <span className="font-semibold" style={{ color: '#FFD700' }}>{price.date}</span>
                      <span style={{ color: '#FFD700' }}>•</span>
                      <span className="text-xs font-semibold" style={{ color: '#FFD700' }}>{price.volume || 'N/A'}株</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">始値</span>
                        <span className="text-xs font-semibold text-white">{price.open}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">終値</span>
                        <span className="text-xs font-semibold text-white">{price.close}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">前日比</span>
                        <span className="text-xs font-semibold text-white">{price.change || '0.0'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">PER</span>
                        <span className="font-semibold text-white">{price.per || 'N/A'}<span className="text-[10px]">倍</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">PBR</span>
                        <span className="font-semibold text-white">{price.pbr || 'N/A'}<span className="text-[10px]">倍</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">利回り</span>
                        <span className="font-semibold text-white">{price.dividend || 'N/A'}<span className="text-[10px]">%</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-1 text-center">
          <p className="text-xs text-white">
            データ出典: 公開市場情報 | 更新: 準リアルタイム
          </p>
          <p className="text-xs text-white/70 mt-1">
            ※過去のデータは将来の結果を保証するものではありません
          </p>
        </div>
      </div>
    </div>
  );
}
