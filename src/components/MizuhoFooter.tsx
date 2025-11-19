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

        <div className="border-t border-white/30 pt-8 space-y-6">
          <div className="bg-amber-900/30 border-2 border-amber-500/50 rounded-xl p-6">
            <h3 className="text-base font-black text-amber-300 mb-3 text-center">
              【重要な法的免責事項】
            </h3>
            <div className="text-sm text-white/90 leading-relaxed space-y-2">
              <p className="font-semibold">
                <span className="text-amber-300">■ サービスの性質：</span>
                本サービスは「過去の市場データに基づく統計分析ツール」であり、情報提供のみを目的としています。特定の金融商品の売買推奨・投資助言を行うものではありません。
              </p>
              <p className="font-semibold">
                <span className="text-amber-300">■ 投資判断の責任：</span>
                提供される情報は過去のデータに基づくものであり、将来の投資成果を保証するものではありません。投資に関する最終決定は、利用者ご自身の責任と判断で行ってください。
              </p>
              <p className="font-semibold">
                <span className="text-amber-300">■ リスク認識：</span>
                株式投資には価格変動リスクがあり、投資元本を割り込む可能性があります。投資を行う際は、十分なリスク理解の上で実施してください。
              </p>
              <p className="font-semibold">
                <span className="text-amber-300">■ 事業者情報：</span>
                当サービス提供者は金融商品取引業者ではありません。個別の投資助言を行うことはできません。投資を行う際は、必ず金融商品取引業者または専門家にご相談ください。
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-white/70 leading-relaxed">
            <p className="font-semibold mb-2">運営: tokyostocks</p>
            <p className="mb-1">データ出典: 公開市場情報（準リアルタイム）</p>
            <p className="mb-1">本サービスは情報提供のみを目的とし、金融商品取引業に該当する行為は行いません。</p>
            <p className="text-xs text-white/50 mt-3">
              法律に関するご質問は、<Link to="/terms" className="underline hover:text-blue-300">利用規約</Link>、
              <Link to="/privacy" className="underline hover:text-blue-300 ml-1">プライバシーポリシー</Link>、
              <Link to="/disclaimer" className="underline hover:text-blue-300 ml-1">免責事項</Link>をご確認ください。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
