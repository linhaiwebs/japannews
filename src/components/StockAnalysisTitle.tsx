interface StockAnalysisTitleProps {
  stockName: string;
}

export default function StockAnalysisTitle({ stockName }: StockAnalysisTitleProps) {
  return (
    <div className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
        <img
          src="/images/left.png"
          alt=""
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />

        <h2
          className="text-2xl md:text-4xl font-black text-center font-artistic"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)'
          }}
        >
          AIがあなたの関心銘柄を検出：「{stockName}」
        </h2>

        <img
          src="/images/right.png"
          alt=""
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
      </div>
    </div>
  );
}
