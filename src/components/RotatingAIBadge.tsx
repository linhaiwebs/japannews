export default function RotatingAIBadge() {
  return (
    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-50">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="gearShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FFD700" floodOpacity="0.5" />
            </filter>
          </defs>

          <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="#FFD700"
              stroke="#FFFFFF"
              strokeWidth="2"
              filter="url(#gearShadow)"
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
                  stroke="#FFD700"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-2xl md:text-3xl tracking-wider drop-shadow-lg">
            AI
          </span>
        </div>
      </div>
    </div>
  );
}
