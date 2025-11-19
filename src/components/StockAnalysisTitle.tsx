interface StockAnalysisTitleProps {
  stockName: string;
  stockCode?: string;
}

export default function StockAnalysisTitle({ stockName, stockCode }: StockAnalysisTitleProps) {
  return (
    <div className="w-full py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img
            src="/images/left.png"
            alt=""
            className="w-6 h-6 md:w-8 md:h-8 object-contain"
          />

          <h2
            className="text-xl md:text-3xl font-black text-center font-artistic leading-tight"
            style={{
              background: 'linear-gradient(135deg, #4A90E2 0%, #87CEEB 50%, #4A90E2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 10px rgba(74, 144, 226, 0.3)'
            }}
          >
            {stockCode && `【${stockCode}】`}{stockName}
          </h2>

          <img
            src="/images/right.png"
            alt=""
            className="w-6 h-6 md:w-8 md:h-8 object-contain"
          />
        </div>

        <div className="text-center">
          <p className="text-base md:text-xl font-bold text-white mb-2">
            過去データに基づく客観的分析
          </p>
          <p className="text-sm md:text-base text-blue-200 font-medium">
            公開市場データによる統計的検証システム
          </p>
        </div>
      </div>
    </div>
  );
}
