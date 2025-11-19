import { useState } from 'react';

interface StockInputCardProps {
  onSubmit: (code: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function StockInputCard({ onSubmit, disabled, loading }: StockInputCardProps) {
  const [stockCode, setStockCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockCode.trim()) {
      onSubmit(stockCode.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border-4 border-mizuho-cyan/20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-mizuho-blue mb-2 font-artistic">
            銘柄番号/銘柄
          </h2>
          <div className="w-24 h-1 bg-mizuho-cyan mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="stock-code" className="block text-sm font-medium text-gray-700 mb-2">
              左右両端提出番号
            </label>
            <input
              id="stock-code"
              type="text"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              placeholder="例：7203"
              disabled={disabled || loading}
              className="w-full px-4 py-3 border-2 border-mizuho-cyan/40 rounded-xl focus:border-mizuho-cyan focus:ring-2 focus:ring-mizuho-cyan/20 outline-none transition-all text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={disabled || loading || !stockCode.trim()}
            className="w-full bg-cyan-gradient text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg md:text-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                読み込み中...
              </span>
            ) : (
              '診断の情報はこちら'
            )}
          </button>

          <p className="text-xs md:text-sm text-gray-600 text-center leading-relaxed">
            株式会社が評価機能を公開して頂いており、<br className="hidden md:inline" />
            おインタリジェンスがビデーをマネージとして把握<br className="hidden md:inline" />
            一連を得して、情報・サービスの定期等に活用させて頂きました。
          </p>
        </form>
      </div>
    </div>
  );
}
