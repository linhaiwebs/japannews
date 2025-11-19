interface WheatIconProps {
  direction?: 'left' | 'right';
  className?: string;
}

export default function WheatIcon({ direction = 'left', className = '' }: WheatIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform: direction === 'right' ? 'scaleX(-1)' : 'none'
      }}
    >
      <defs>
        <linearGradient id={`wheatGradient-${direction}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M20 35 L20 15"
        stroke={`url(#wheatGradient-${direction})`}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <ellipse cx="20" cy="12" rx="3" ry="5" fill={`url(#wheatGradient-${direction})`} />
      <ellipse cx="20" cy="16" rx="3" ry="5" fill={`url(#wheatGradient-${direction})`} />
      <ellipse cx="20" cy="20" rx="3" ry="5" fill={`url(#wheatGradient-${direction})`} />
      <ellipse cx="20" cy="24" rx="3" ry="5" fill={`url(#wheatGradient-${direction})`} />

      <ellipse cx="16" cy="14" rx="2.5" ry="4" fill={`url(#wheatGradient-${direction})`} opacity="0.8" />
      <ellipse cx="24" cy="14" rx="2.5" ry="4" fill={`url(#wheatGradient-${direction})`} opacity="0.8" />
      <ellipse cx="16" cy="18" rx="2.5" ry="4" fill={`url(#wheatGradient-${direction})`} opacity="0.8" />
      <ellipse cx="24" cy="18" rx="2.5" ry="4" fill={`url(#wheatGradient-${direction})`} opacity="0.8" />
      <ellipse cx="16" cy="22" rx="2.5" ry="4" fill={`url(#wheatGradient-${direction})`} opacity="0.8" />
      <ellipse cx="24" cy="22" rx="2.5" ry="4" fill={`url(#wheatGradient-${direction})`} opacity="0.8" />
    </svg>
  );
}
