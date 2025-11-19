interface TurquoiseFrameProps {
  children?: React.ReactNode;
  className?: string;
}

export default function TurquoiseFrame({ children, className = "" }: TurquoiseFrameProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 700 200"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="turquoiseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="frameFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(254, 242, 242, 0.8)" />
          </linearGradient>
        </defs>

        <rect
          x="5"
          y="5"
          width="690"
          height="190"
          rx="12"
          fill="none"
          stroke="url(#turquoiseGradient)"
          strokeWidth="6"
        />

        <rect
          x="15"
          y="15"
          width="670"
          height="170"
          rx="8"
          fill="url(#frameFill)"
          stroke="rgba(239, 68, 68, 0.4)"
          strokeWidth="2"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
