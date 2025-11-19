import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockInfo, StockPrice } from '../types/stock';
import TurquoiseCard from './TurquoiseCard';

interface SplitStockCardProps {
  info: StockInfo;
  latestPrice?: StockPrice;
}

export default function SplitStockCard({ info, latestPrice }: SplitStockCardProps) {
  const isPositive = info.change.includes('+') || parseFloat(info.change) > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="px-4 py-3">
      <div className="max-w-lg mx-auto">
        <TurquoiseCard>
          <div className="relative z-10 px-4 py-6">
            <div>
              <div className="text-center pt-4 pb-4">
                <div className="text-dark-red text-xl font-bold mb-1">
                  {info.name} ({info.code})
                </div>
                <div className="text-text-gray text-sm">
                  {info.timestamp}
                </div>
              </div>

              <div className="grid gap-1" style={{ gridTemplateColumns: '40% 60%' }}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl text-accent-red font-black">
                      ¥{info.price}
                    </div>
                    <TrendIcon className="w-6 h-6 text-accent-red" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-gray">{info.change}</span>
                    <span className="text-sm text-text-gray">{info.changePercent}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-red font-bold">始値</span>
                    <span className="text-secondary-red">{latestPrice?.open || info.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-red font-bold">高値</span>
                    <span className="text-secondary-red">{latestPrice?.high || info.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-red font-bold">終値</span>
                    <span className="text-secondary-red">{latestPrice?.close || info.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-red font-bold">安値</span>
                    <span className="text-secondary-red">{latestPrice?.low || info.price}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-primary-red/20">
                    <span className="text-dark-red font-bold">前日比</span>
                    <span className="text-text-gray">{info.changePercent}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-primary-red/20">
                    <span className="text-dark-red font-bold">売買高</span>
                    <span className="text-secondary-red">{latestPrice?.volume || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TurquoiseCard>

        <div className="mt-2 text-center">
          <p className="text-xs text-text-gray">
            データ出典: 公開市場情報（準リアルタイム）
          </p>
          <p className="text-xs text-text-light mt-1">
            ※本情報は参考資料であり、投資助言ではありません
          </p>
        </div>
      </div>
    </div>
  );
}
