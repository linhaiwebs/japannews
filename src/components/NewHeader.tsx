export default function NewHeader() {
  return (
    <header className="w-full py-6 px-4 md:px-8 mt-4 md:mt-6">
      <div className="max-w-7xl mx-auto flex items-start justify-between mb-6">
        <div className="flex flex-col items-start">
          <div className="flex items-baseline gap-0">
            <h1
              className="text-3xl md:text-5xl font-black tracking-tight font-artistic"
              style={{
                background: 'linear-gradient(135deg, #0066CC 0%, #87CEEB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              情報
            </h1>
            <span className="text-xl md:text-3xl font-medium text-white font-artistic ml-1">
              銘柄基本
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-24 md:h-32 w-auto object-contain"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        <img
          src="/images/top.png"
          alt=""
          className="w-full max-w-2xl h-auto object-contain mb-4"
        />

        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight text-center">
            銘柄情報参照
          </h2>
          <div
            className="mt-2 text-sm md:text-base font-medium italic text-center"
            style={{
              color: '#87CEEB',
              letterSpacing: '0.1em',
              transform: 'skewY(-2deg)'
            }}
          >
            「参考情報提供ツール」
          </div>
          <div className="mt-3 text-xs text-amber-300 font-bold text-center px-4">
            ※本サービスは投資助言ではありません
          </div>
        </div>
      </div>
    </header>
  );
}
