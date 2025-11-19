export default function RotatingNotableBadge() {
  return (
    <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 z-10">
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="notableShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0059a4" floodOpacity="0.3" />
            </filter>
          </defs>

          <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="#009cad"
              stroke="#FFFFFF"
              strokeWidth="2"
              filter="url(#notableShadow)"
            />

            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 35 * Math.cos(rad);
              const y1 = 50 + 35 * Math.sin(rad);
              const x2 = 50 + 42 * Math.cos(rad);
              const y2 = 50 + 42 * Math.sin(rad);

              return (
                <line
                  key={angle}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#009cad"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-xs md:text-sm text-center px-2 leading-tight drop-shadow-lg" style={{ writingMode: 'horizontal-tb' }}>
            注目の<br />報告
          </span>
        </div>
      </div>
    </div>
  );
}
