import ImagePlaceholder from './ImagePlaceholder';

export default function TeacherCard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-mizuho-blue mb-4">
          先生の紹介
        </h2>
        <p className="text-gray-700 text-sm md:text-base">
          理室のあマ辞籍処あい
        </p>
        <p className="text-gray-700 text-sm md:text-base">
          皆さんでの野評述してと先生を情報化解説しています。
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-mizuho-cyan/20">
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-mizuho-purple shadow-lg">
                  <ImagePlaceholder
                    name="teacher-avatar.png"
                    width={192}
                    height={192}
                    alt="小室真南海 先生"
                    bgColor="#6B4C9A"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-mizuho-cyan text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                  講師
                </div>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-mizuho-blue mb-1">
                  情報名実<br />
                  小室真南海 先生
                </h3>
                <p className="text-sm text-gray-600">
                  金融名株式レポート/センディー
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="relative bg-mizuho-purple/10 rounded-2xl p-6 border-2 border-mizuho-purple/20">
                <div className="absolute -left-3 top-4 w-6 h-6 bg-mizuho-purple/10 border-2 border-mizuho-purple/20 rotate-45"></div>

                <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed">
                  <p>
                    みなさん大入るこうです脱ど
                  </p>
                  <p>
                    つ全量答を楽しくましてにでる
                  </p>
                  <p>
                    大事の私は今年は好きですが、現在
                  </p>
                  <p>
                    またAメルナルメッって、等きえ
                  </p>
                  <p>
                    もとい話「暇」「ゲーム」でを
                  </p>
                  <p>
                    始んでいるこんです
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot === 1 ? 'bg-mizuho-cyan' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
