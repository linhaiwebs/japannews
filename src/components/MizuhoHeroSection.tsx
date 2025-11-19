import AnimatedLogoSVG from './AnimatedLogoSVG';

export default function MizuhoHeroSection() {
  return (
    <div className="relative w-screen" style={{ margin: 0, padding: 0, left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      <img
        src="/images/mv_board.png"
        alt="MIZUHO Background"
        className="w-full h-auto object-cover"
        style={{ margin: 0, padding: 0, display: 'block', transform: 'scale(1.15)', transformOrigin: 'center top' }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <AnimatedLogoSVG />
      </div>

      <div className="absolute bottom-0 right-0 z-20" style={{ transform: 'translateY(50%)' }}>
        <img
          src="/images/news_chara.png"
          alt="Character"
          className="w-32 h-auto md:w-48 lg:w-56 drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
