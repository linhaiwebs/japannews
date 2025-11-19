interface NewHeaderProps {
  stockCode?: string;
  stockName?: string;
}

export default function NewHeader({ stockCode, stockName }: NewHeaderProps) {
  return (
    <header className="w-full py-4 px-4 md:px-8 mt-2 md:mt-4">
      <div className="max-w-7xl mx-auto flex items-start justify-between mb-4">
        <div className="flex flex-col items-start flex-1">
          <div className="flex items-baseline gap-1 flex-wrap">
            <h1
              className="text-2xl md:text-4xl font-black tracking-tight font-artistic leading-tight"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FFD700 50%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(255, 107, 0, 0.3)'
              }}
            >
              【速報：{stockCode || '----'}】
            </h1>
          </div>
          <div className="mt-2">
            <p className="text-lg md:text-2xl font-bold text-white leading-tight">
              AIがあなたの投資仮説を
            </p>
            <p className="text-lg md:text-2xl font-bold text-white leading-tight">
              過去データで即時検証！
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-20 md:h-28 w-auto object-contain"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center mb-4">
        <img
          src="/images/top.png"
          alt=""
          className="w-full max-w-2xl h-auto object-contain mb-4"
        />

        <div className="flex flex-col items-center max-w-4xl w-full px-4">
          <div
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-xl p-4 mb-4 shadow-lg border-2 border-blue-400"
          >
            <h2 className="text-xl md:text-2xl font-black text-white text-center mb-2">
              客観的な歴史回溯テストツール
            </h2>
            <div
              className="text-sm md:text-base font-medium text-center text-blue-100"
              style={{
                letterSpacing: '0.05em'
              }}
            >
              過去の市場データに基づく統計分析システム
            </div>
          </div>

          <div className="w-full bg-amber-50 border-3 border-amber-400 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm md:text-base text-amber-900 font-bold leading-relaxed">
                  【重要な免責事項】
                </p>
                <p className="text-xs md:text-sm text-amber-800 font-semibold leading-relaxed mt-1">
                  本シミュレーション結果は過去のデータに基づいたものであり、将来の投資成果を保証するものではありません。本サービスは情報提供のみを目的としており、投資助言・推奨ではありません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
