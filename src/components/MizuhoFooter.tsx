import { Link } from 'react-router-dom';

export default function MizuhoFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-artistic">tokyostocks</h2>
          <p className="text-sm md:text-base opacity-90 mb-6">
            &copy; {currentYear} tokyostocks. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-12 mb-10">
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/30 pb-2 font-artistic">
              法人情報
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-300 transition-colors">
                  会社について
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-blue-300 transition-colors">
                  チーム
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-blue-300 transition-colors">
                  採用情報
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-blue-300 transition-colors">
                  プレスリリース
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/30 pb-2 font-artistic">
              サイトメニュー
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-blue-300 transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-300 transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link to="/specified-commercial-transaction-act" className="hover:text-blue-300 transition-colors">
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link to="/risk-disclosure" className="hover:text-blue-300 transition-colors">
                  リスク開示
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-blue-300 transition-colors">
                  免責事項
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-300 transition-colors">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-300 transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-blue-300 transition-colors">
                  サポート
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/30 pt-8 text-center text-xs text-white/70 leading-relaxed">
          <p className="mb-2">【重要】本サービスで提供される情報は教育・情報提供のみを目的としており、特定の金融商品の売買や投資勧誘を行うものではありません。</p>
          <p className="mb-2">株式投資には価格変動リスクがあり、投資元本を割り込む可能性があります。</p>
          <p className="mb-2">投資に関する最終決定は、利用者ご自身の責任と判断で行ってください。</p>
          <p>当サービス提供者は金融商品取引業者ではなく、個別の投資助言を行うことはできません。投資を行う際は、必ず金融商品取引業者または専門家にご相談ください。</p>
        </div>
      </div>
    </footer>
  );
}
