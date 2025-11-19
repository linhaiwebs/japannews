import ImagePlaceholder from './ImagePlaceholder';

export default function IntroductionSection() {
  return (
    <div className="relative bg-orange-gradient overflow-hidden py-12 md:py-16">
      <div className="absolute top-0 left-0 right-0 h-8 bg-white" style={{
        clipPath: 'polygon(0 0, 5% 70%, 10% 0, 15% 70%, 20% 0, 25% 70%, 30% 0, 35% 70%, 40% 0, 45% 70%, 50% 0, 55% 70%, 60% 0, 65% 70%, 70% 0, 75% 70%, 80% 0, 85% 70%, 90% 0, 95% 70%, 100% 0, 100% 100%, 0 100%)'
      }}></div>

      <div className="absolute inset-0 opacity-10">
        <ImagePlaceholder
          name="coffee-pattern.png"
          width={200}
          height={200}
          alt="Pattern"
          className="absolute top-10 right-10"
          bgColor="#FF8A5C"
        />
        <ImagePlaceholder
          name="coins-pattern.png"
          width={150}
          height={150}
          alt="Pattern"
          className="absolute bottom-10 left-10"
          bgColor="#FF8A5C"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ImagePlaceholder
              name="coffee-illustration.png"
              width={200}
              height={200}
              alt="Coffee Illustration"
              bgColor="#FFFFFF"
            />
          </div>

          <div className="flex-1 text-white space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              大事を描きをかもお楽しく。
            </h2>

            <div className="space-y-3 text-sm md:text-base leading-relaxed">
              <p>
                テーション　ユージ ガニン　コントニュ、
              </p>
              <p>
                これはユーザーの公意が個人の受け比を楽しく快適な会議のながら、
              </p>
              <p>
                みんながかかる会わを持ちAIメニューションを
              </p>
              <p>
                担いながら、わかめながら補聴を行えます。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{
        clipPath: 'polygon(0 50%, 5% 30%, 10% 50%, 15% 30%, 20% 50%, 25% 30%, 30% 50%, 35% 30%, 40% 50%, 45% 30%, 50% 50%, 55% 30%, 60% 50%, 65% 30%, 70% 50%, 75% 30%, 80% 50%, 85% 30%, 90% 50%, 95% 30%, 100% 50%, 100% 0, 0 0)'
      }}></div>
    </div>
  );
}
