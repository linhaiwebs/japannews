import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-red-50 border-2 border-amber-400 rounded-lg shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold text-red-800 mb-1">
              【重要】本サービスについて
            </p>
            <p className="text-xs text-gray-800 leading-relaxed">
              本サービスは公開市場データの参考表示を目的とした情報提供ツールです。
              <span className="font-bold text-red-700">投資助言・推奨を行うものではありません。</span>
              株式投資には価格変動リスクがあり、投資元本を割り込む可能性があります。
              <span className="font-bold text-red-700">投資判断は必ずご自身の責任で行ってください。</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
