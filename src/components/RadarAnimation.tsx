import { useEffect, useState } from 'react';

interface StockTarget {
  name: string;
  angle: number;
  distance: number;
  size: number;
}

export default function RadarAnimation() {
  const [rotation, setRotation] = useState(0);

  const stockTargets: StockTarget[] = [
    { name: 'トヨタ', angle: 30, distance: 70, size: 18 },
    { name: 'ソニー', angle: 80, distance: 85, size: 16 },
    { name: '任天堂', angle: 135, distance: 75, size: 20 },
    { name: 'ソフトバンク', angle: 190, distance: 80, size: 14 },
    { name: 'キーエンス', angle: 240, distance: 90, size: 15 },
    { name: 'ファナック', angle: 290, distance: 65, size: 17 },
    { name: '三菱UFJ', angle: 350, distance: 95, size: 13 },
    { name: 'KDDI', angle: 110, distance: 60, size: 16 },
    { name: 'NTT', angle: 160, distance: 70, size: 19 },
    { name: '日立', angle: 210, distance: 85, size: 15 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const isTargetHighlighted = (targetAngle: number): boolean => {
    const normalizedRotation = rotation % 360;
    const diff = Math.abs(normalizedRotation - targetAngle);
    const minDiff = Math.min(diff, 360 - diff);
    return minDiff < 25;
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-64 flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fca5a5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
          </radialGradient>

          <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="90" fill="url(#radarBg)" />

        <circle cx="100" cy="100" r="90" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.25" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.2" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.15" />

        <line x1="100" y1="10" x2="100" y2="190" stroke="#ef4444" strokeWidth="0.5" opacity="0.2" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="#ef4444" strokeWidth="0.5" opacity="0.2" />

        {stockTargets.map((target, index) => {
          const angleRad = (target.angle * Math.PI) / 180;
          const x = 100 + target.distance * Math.cos(angleRad);
          const y = 100 + target.distance * Math.sin(angleRad);
          const highlighted = isTargetHighlighted(target.angle);

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="3"
                fill={highlighted ? '#dc2626' : '#fca5a5'}
                opacity={highlighted ? 1 : 0.4}
              />
              <text
                x={x}
                y={y - 8}
                fontSize={target.size}
                fill={highlighted ? '#991b1b' : '#6b7280'}
                textAnchor="middle"
                fontWeight={highlighted ? 'bold' : 'normal'}
                opacity={highlighted ? 1 : 0.5}
                fontFamily="'Noto Sans JP', sans-serif"
                className="transition-all duration-300"
              >
                {target.name}
              </text>
            </g>
          );
        })}

        <g transform={`rotate(${rotation} 100 100)`}>
          <path
            d="M 100 100 L 190 100 A 90 90 0 0 1 100 190 Z"
            fill="url(#sweepGradient)"
            opacity="0.4"
          />
          <line
            x1="100"
            y1="100"
            x2="190"
            y2="100"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="190" cy="100" r="3" fill="#dc2626" />
        </g>

        <circle cx="100" cy="100" r="8" fill="#ef4444" />
        <circle cx="100" cy="100" r="4" fill="#fef2f2" />
      </svg>
    </div>
  );
}
