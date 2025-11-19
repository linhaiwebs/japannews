import { useEffect, useState } from 'react';

interface AnalysisTerm {
  text: string;
  angle: number;
}

export default function RotatingAnalysisCircle() {
  const [rotation, setRotation] = useState(0);

  const analysisTerms: AnalysisTerm[] = [
    { text: '機械学習', angle: 0 },
    { text: '深層学習', angle: 45 },
    { text: '自然言語処理', angle: 90 },
    { text: 'データマイニング', angle: 135 },
    { text: 'ニューラルネットワーク', angle: 180 },
    { text: 'テクニカル分析', angle: 225 },
    { text: '予測モデル', angle: 270 },
    { text: 'アルゴリズム', angle: 315 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const isTermAtTop = (termAngle: number): boolean => {
    const currentAngle = (termAngle - rotation + 360) % 360;
    return currentAngle >= 330 || currentAngle <= 30;
  };

  return (
    <div className="relative z-20 mt-8 mb-8">
      <div className="max-w-[600px] mx-auto px-4">
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fee2e2" />
              </radialGradient>

              <filter id="textGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="150"
              cy="150"
              r="120"
              fill="url(#circleGradient)"
              stroke="#ef4444"
              strokeWidth="3"
              opacity="0.2"
            />

            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.4"
            />

            <g transform={`rotate(${rotation} 150 150)`}>
              {analysisTerms.map((term, index) => {
                const angleRad = (term.angle * Math.PI) / 180;
                const radius = 120;
                const x = 150 + radius * Math.cos(angleRad);
                const y = 150 + radius * Math.sin(angleRad);
                const isHighlighted = isTermAtTop(term.angle);

                return (
                  <g key={index} transform={`rotate(${-rotation} ${x} ${y})`}>
                    <rect
                      x={x - 55}
                      y={y - 15}
                      width="110"
                      height="30"
                      rx="15"
                      fill={isHighlighted ? '#ef4444' : '#fef2f2'}
                      stroke={isHighlighted ? '#dc2626' : '#fca5a5'}
                      strokeWidth={isHighlighted ? '2' : '1.5'}
                      opacity={isHighlighted ? 1 : 0.7}
                    />
                    <text
                      x={x}
                      y={y + 5}
                      fontSize={isHighlighted ? '14' : '12'}
                      fill={isHighlighted ? '#ffffff' : '#6b7280'}
                      textAnchor="middle"
                      fontWeight={isHighlighted ? 'bold' : 'normal'}
                      fontFamily="'Noto Sans JP', sans-serif"
                      filter={isHighlighted ? 'url(#textGlow)' : ''}
                    >
                      {term.text}
                    </text>
                  </g>
                );
              })}
            </g>

            <circle cx="150" cy="150" r="40" fill="#ef4444" opacity="0.1" />
            <circle cx="150" cy="150" r="30" fill="#dc2626" opacity="0.15" />
            <circle cx="150" cy="150" r="20" fill="#b91c1c" opacity="0.2" />

            <text
              x="150"
              y="155"
              fontSize="16"
              fill="#dc2626"
              textAnchor="middle"
              fontWeight="bold"
              fontFamily="'Noto Sans JP', sans-serif"
            >
              AI分析
            </text>
          </svg>

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="bg-gradient-to-r from-dark-red via-primary-red to-dark-red text-white px-3 py-1 rounded-full text-xs font-bold shadow-red-glow">
              注目
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-gray">
            <span className="text-primary-red font-semibold">AI技術</span>を活用した包括的な市場分析
          </p>
        </div>
      </div>
    </div>
  );
}
