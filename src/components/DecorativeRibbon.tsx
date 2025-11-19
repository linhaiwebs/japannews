interface DecorativeRibbonProps {
  className?: string;
}

export default function DecorativeRibbon({ className = "" }: DecorativeRibbonProps) {
  return (
    <svg
      viewBox="0 0 800 100"
      className={`max-w-full h-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="ribbonGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>

      <path
        d="M 20 50 Q 10 30, 30 20 L 770 20 Q 790 30, 780 50 Q 790 70, 770 80 L 30 80 Q 10 70, 20 50 Z"
        fill="white"
        stroke="#22c55e"
        strokeWidth="3"
      />

      <path
        d="M 40 50 Q 35 40, 45 35 L 755 35 Q 765 40, 760 50 Q 765 60, 755 65 L 45 65 Q 35 60, 40 50 Z"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2"
        opacity="0.5"
      />

      <g transform="translate(60, 50)">
        <ellipse cx="0" cy="0" rx="8" ry="10" fill="#22c55e" opacity="0.7" />
        <ellipse cx="-5" cy="-8" rx="6" ry="8" fill="#86efac" opacity="0.6" />
        <ellipse cx="5" cy="-8" rx="6" ry="8" fill="#86efac" opacity="0.6" />
        <ellipse cx="-8" cy="5" rx="5" ry="6" fill="#4ade80" opacity="0.5" />
        <ellipse cx="8" cy="5" rx="5" ry="6" fill="#4ade80" opacity="0.5" />
      </g>

      <g transform="translate(90, 35)">
        <path d="M 0 0 L 3 -6 L 6 0 Z" fill="#22c55e" opacity="0.6" />
        <path d="M -5 3 L -2 -3 L 1 3 Z" fill="#86efac" opacity="0.5" />
        <path d="M 5 3 L 8 -3 L 11 3 Z" fill="#4ade80" opacity="0.5" />
      </g>

      <g transform="translate(740, 50)">
        <ellipse cx="0" cy="0" rx="8" ry="10" fill="#22c55e" opacity="0.7" />
        <ellipse cx="-5" cy="-8" rx="6" ry="8" fill="#86efac" opacity="0.6" />
        <ellipse cx="5" cy="-8" rx="6" ry="8" fill="#86efac" opacity="0.6" />
        <ellipse cx="-8" cy="5" rx="5" ry="6" fill="#4ade80" opacity="0.5" />
        <ellipse cx="8" cy="5" rx="5" ry="6" fill="#4ade80" opacity="0.5" />
      </g>

      <g transform="translate(710, 35)">
        <path d="M 0 0 L 3 -6 L 6 0 Z" fill="#22c55e" opacity="0.6" />
        <path d="M -5 3 L -2 -3 L 1 3 Z" fill="#86efac" opacity="0.5" />
        <path d="M 5 3 L 8 -3 L 11 3 Z" fill="#4ade80" opacity="0.5" />
      </g>

      <circle cx="120" cy="45" r="2" fill="#22c55e" opacity="0.4" />
      <circle cx="680" cy="45" r="2" fill="#22c55e" opacity="0.4" />
      <circle cx="130" cy="55" r="2" fill="#86efac" opacity="0.4" />
      <circle cx="670" cy="55" r="2" fill="#86efac" opacity="0.4" />
    </svg>
  );
}
