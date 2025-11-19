export default function FixedHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-gradient-to-r from-blue-900 to-blue-700 z-50 shadow-lg border-b-2 border-blue-400/30">
      <div className="h-full flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-900 font-bold text-lg">R</span>
          </div>
          <span className="text-white font-bold text-lg md:text-xl tracking-wide">
            rotkstock
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
            ホーム
          </a>
          <a href="#diagnosis" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
            診断
          </a>
          <a href="#about" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
            先生紹介
          </a>
          <a href="#contact" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
            お問い合わせ
          </a>
        </nav>

        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
