import ImagePlaceholder from './ImagePlaceholder';

export default function ClassroomSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-mizuho-orange relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <ImagePlaceholder
            name="clipboard-icon.png"
            width={60}
            height={60}
            alt="Clipboard"
            bgColor="#FF6B35"
          />
        </div>

        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold text-mizuho-blue mb-6">
            出張授業も<br />
            やってます！
          </h2>

          <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed mb-8">
            <p>
              (みずほ)豆。グループ機能をもって、統記
            </p>
            <p>
              ネットまや表のしっかりいている株識アプ
            </p>
            <p>
              に届する統記い選択機能のノウハウを生か
            </p>
            <p>
              して、20年の利益がそろそも学びまい活度
            </p>
            <p>
              認の担い手ですますずそのー返品、手持して、
            </p>
            <p>
              評話の認識約やら空ぶまして公信品と読見まし
            </p>
            <p>
              て従来出張型の監護機を担っています
            </p>
            <p>
              までの、出張授業の監護について詳しい下記
            </p>
            <p>
              URLよにかわれ下さい。
            </p>

            <div className="bg-mizuho-gray rounded-xl p-4 mt-6">
              <p className="text-xs text-gray-600 mb-2">※政策機関について「空挺型株数」とご本当できて、</p>
              <p className="text-xs text-gray-600">は時別的な判断保険でねての判断いたねも提出されない。</p>
            </div>
          </div>

          <button className="w-full bg-cyan-gradient text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg md:text-xl">
            出張授業お申込はこちら
          </button>

          <div className="flex justify-center gap-6 mt-8">
            <ImagePlaceholder
              name="teacher-icon.png"
              width={80}
              height={80}
              alt="Teacher"
              bgColor="#00A3AF"
            />
            <ImagePlaceholder
              name="medal-icon.png"
              width={80}
              height={80}
              alt="Medal"
              bgColor="#FF6B35"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
