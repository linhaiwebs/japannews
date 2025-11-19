import { Brain, Database, FileText, ArrowRight, Sparkles, Layers, TrendingUp } from 'lucide-react';

export default function AIProcessFlow() {
  return (
    <div className="relative z-20 mt-4 mb-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-gradient-to-br from-white/95 to-green-50/90 backdrop-blur-lg border-2 border-green-500/40 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400/10 to-lime-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-center mb-6 sm:mb-8 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }}>
              AI分析プロセス
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">

              <div className="relative group w-full lg:w-auto lg:flex-1 max-w-xs">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 animate-glow-pulse"></div>
                <div className="relative bg-gradient-to-br from-white to-green-50 backdrop-blur-sm border-2 border-green-400/50 rounded-xl p-4 sm:p-5 shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 rounded-full blur-lg animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-3 sm:p-4 rounded-full shadow-lg">
                        <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white animate-icon-float" />
                      </div>
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 animate-sparkle" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="bg-green-500/20 px-3 py-1 rounded-full">
                        <span className="text-green-700 font-bold text-xs sm:text-sm">STEP 1</span>
                      </div>
                      <h4 className="text-green-900 font-bold text-sm sm:text-base lg:text-lg leading-snug">
                        注目銘柄を<br />スマートに判定
                      </h4>
                      <p className="text-green-700 text-xs sm:text-sm opacity-90">
                        AIが市場データを<br className="sm:hidden" />スキャン
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 rotate-90 lg:rotate-0">
                <div className="relative">
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 animate-arrow-flow" />
                  <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-md animate-pulse"></div>
                </div>
              </div>

              <div className="relative group w-full lg:w-auto lg:flex-1 max-w-xs">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-lime-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 animate-glow-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="relative bg-gradient-to-br from-white to-green-50 backdrop-blur-sm border-2 border-green-400/50 rounded-xl p-4 sm:p-5 shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="relative bg-gradient-to-br from-green-600 to-lime-500 p-3 sm:p-4 rounded-full shadow-lg">
                        <Database className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white animate-icon-float" style={{ animationDelay: '0.5s' }} />
                      </div>
                      <Layers className="absolute -bottom-1 -right-1 w-4 h-4 text-emerald-400 animate-sparkle" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="bg-green-500/20 px-3 py-1 rounded-full">
                        <span className="text-green-700 font-bold text-xs sm:text-sm">STEP 2</span>
                      </div>
                      <h4 className="text-green-900 font-bold text-sm sm:text-base lg:text-lg leading-snug">
                        AIデータ整理と<br />LLMモデル推論
                      </h4>
                      <p className="text-green-700 text-xs sm:text-sm opacity-90">
                        データ処理と<br className="sm:hidden" />AI分析
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 rotate-90 lg:rotate-0">
                <div className="relative">
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-arrow-flow" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>

              <div className="relative group w-full lg:w-auto lg:flex-1 max-w-xs">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 animate-glow-pulse" style={{ animationDelay: '0.6s' }}></div>
                <div className="relative bg-gradient-to-br from-white to-green-50 backdrop-blur-sm border-2 border-green-400/50 rounded-xl p-4 sm:p-5 shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-3 sm:p-4 rounded-full shadow-lg">
                        <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white animate-icon-float" style={{ animationDelay: '1s' }} />
                      </div>
                      <TrendingUp className="absolute -top-1 -right-1 w-4 h-4 text-green-400 animate-sparkle" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="bg-green-500/20 px-3 py-1 rounded-full">
                        <span className="text-green-700 font-bold text-xs sm:text-sm">STEP 3</span>
                      </div>
                      <h4 className="text-green-900 font-bold text-sm sm:text-base lg:text-lg leading-snug">
                        詳細レポートを<br />生成
                      </h4>
                      <p className="text-green-700 text-xs sm:text-sm opacity-90">
                        詳細レポートを<br className="sm:hidden" />生成
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <div className="inline-block bg-gradient-to-r from-white/80 to-green-50/80 backdrop-blur-sm border border-green-500/30 rounded-lg px-4 py-2.5 sm:px-6 sm:py-3 shadow-lg">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <span className="text-green-600 font-semibold">AI技術による</span>高速かつ正確な市場分析プロセス
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
