import { useEffect, useState } from 'react';

export default function AnimatedLogoSVG() {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 950 200"
        className="w-full max-w-5xl mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))' }}
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700;900&display=swap');

              .logo-text {
                font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
                font-weight: 900;
                stroke: #ffffff;
                stroke-width: 3;
                fill: transparent;
                stroke-linecap: round;
                stroke-linejoin: round;
              }

              .artistic-text {
                font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
                font-weight: 900;
                stroke: #ffffff;
                stroke-width: 3.5;
                fill: transparent;
                stroke-linecap: round;
                stroke-linejoin: round;
                font-style: italic;
                letter-spacing: 2px;
              }

              .vertical-text {
                font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
                font-weight: 700;
                stroke: #ffffff;
                stroke-width: 2;
                fill: transparent;
                stroke-linecap: round;
                stroke-linejoin: round;
              }

              .char-1 {
                stroke-dasharray: 800;
                stroke-dashoffset: 800;
                animation: draw 0.8s ease-out forwards, fillColor 0.3s ease-out 0.8s forwards;
              }

              .char-2 {
                stroke-dasharray: 800;
                stroke-dashoffset: 800;
                animation: draw 0.8s ease-out 0.3s forwards, fillColor 0.3s ease-out 1.1s forwards;
              }

              .char-3 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw 0.8s ease-out 0.6s forwards, fillColor 0.3s ease-out 1.4s forwards;
              }

              .char-4 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw 0.8s ease-out 0.9s forwards, fillColor 0.3s ease-out 1.7s forwards;
              }

              .char-5 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw 0.8s ease-out 1.2s forwards, fillColor 0.3s ease-out 2.0s forwards;
              }

              .char-6 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw 0.8s ease-out 1.5s forwards, fillColor 0.3s ease-out 2.3s forwards;
              }

              .vertical-char-1 {
                stroke-dasharray: 700;
                stroke-dashoffset: 700;
                animation: draw 0.8s ease-out 1.8s forwards, fillColor 0.3s ease-out 2.6s forwards;
              }

              .vertical-char-2 {
                stroke-dasharray: 700;
                stroke-dashoffset: 700;
                animation: draw 0.8s ease-out 2.1s forwards, fillColor 0.3s ease-out 2.9s forwards;
              }

              @keyframes draw {
                to {
                  stroke-dashoffset: 0;
                }
              }

              @keyframes fillColor {
                to {
                  fill: #ffffff;
                  fill-opacity: 1;
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .logo-text, .artistic-text, .vertical-text {
                  animation: none !important;
                  stroke-dashoffset: 0 !important;
                  fill: #ffffff !important;
                }
              }
            `}
          </style>
        </defs>

        <text x="60" y="130" fontSize="100" className="artistic-text char-1">A</text>
        <text x="170" y="130" fontSize="100" className="artistic-text char-2">I</text>
        <text x="270" y="130" fontSize="100" className="logo-text char-3">株</text>
        <text x="395" y="130" fontSize="100" className="logo-text char-4">式</text>
        <text x="520" y="130" fontSize="100" className="logo-text char-5">情</text>
        <text x="645" y="130" fontSize="100" className="logo-text char-6">報</text>

        <g transform="translate(820, 50)">
          <text x="0" y="60" fontSize="70" className="vertical-text vertical-char-1">報</text>
          <text x="0" y="130" fontSize="70" className="vertical-text vertical-char-2">告</text>
        </g>
      </svg>
    </div>
  );
}
