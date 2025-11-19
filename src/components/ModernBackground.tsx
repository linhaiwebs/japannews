interface ModernBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModernBackground({ children, className = "" }: ModernBackgroundProps) {
  return (
    <div
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 25%, #f3f4f6 50%, #f9fafb 75%, #ffffff 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div
        className="absolute inset-0 opacity-20 animate-gradient-shift-slow"
        style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
          backgroundSize: '200% 200%',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 45%, rgba(34, 197, 94, 0.08) 45%, rgba(34, 197, 94, 0.08) 55%, transparent 55%),
            linear-gradient(-45deg, transparent 45%, rgba(34, 197, 94, 0.08) 45%, rgba(34, 197, 94, 0.08) 55%, transparent 55%)
          `,
          backgroundSize: '120px 120px'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-6"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-4 animate-wave-pattern"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.06) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
            <path d="M50 0 L93.3 25 L93.3 62 L50 87 L6.7 62 L6.7 25 Z" fill="none" stroke="rgba(34, 197, 94, 0.15)" strokeWidth="1"/>
          </pattern>
          <pattern id="waves" x="0" y="0" width="200" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 Q50 5, 100 20 T200 20" fill="none" stroke="rgba(34, 197, 94, 0.08)" strokeWidth="2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)"/>
        <rect width="100%" height="100%" fill="url(#waves)"/>
      </svg>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />

      <svg className="absolute top-8 left-8 w-32 h-32 opacity-10 animate-float" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="6" fill="url(#grad1)" />
        <circle cx="16" cy="16" r="12" fill="none" stroke="url(#grad1)" strokeWidth="1" />
        <circle cx="16" cy="16" r="18" fill="none" stroke="url(#grad1)" strokeWidth="0.5" strokeDasharray="4 4" className="animate-spin-slow" style={{ transformOrigin: 'center', animationDuration: '20s' }}/>
        <path d="M 40 16 L 65 16 M 52.5 3.5 L 52.5 28.5 M 40 40 L 65 65 M 65 40 L 40 65" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" />
        <polygon points="80,16 95,28 95,52 80,64 65,52 65,28" fill="none" stroke="url(#grad1)" strokeWidth="1.5"/>
      </svg>

      <svg className="absolute top-8 right-8 w-32 h-32 opacity-10 animate-float" style={{ animationDelay: '1s' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#15803d', stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="28" height="28" fill="none" stroke="url(#grad2)" strokeWidth="1.5" className="animate-spin-slow" style={{ transformOrigin: '26px 26px', animationDuration: '25s', animationDirection: 'reverse' }}/>
        <rect x="20" y="20" width="12" height="12" fill="url(#grad2)" opacity="0.5" />
        <circle cx="26" cy="26" r="16" fill="none" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="2 3"/>
        <path d="M 54 20 L 75 20 L 75 42 M 54 62 L 75 62 L 75 42" stroke="url(#grad2)" strokeWidth="2" fill="none" />
        <path d="M 82 26 L 90 16 L 98 26 L 90 36 Z" fill="none" stroke="url(#grad2)" strokeWidth="1.5"/>
      </svg>

      <svg className="absolute bottom-24 left-8 w-40 h-40 opacity-8 animate-float" style={{ animationDelay: '2s' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 0.2 }} />
          </linearGradient>
          <radialGradient id="radial1">
            <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="35" fill="url(#radial1)"/>
        <path d="M 15 50 L 40 50 M 60 50 L 85 50 M 50 15 L 50 40 M 50 60 L 50 85" stroke="url(#grad3)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="url(#grad3)" strokeWidth="2" strokeDasharray="6 6" className="animate-spin-slow" style={{ transformOrigin: 'center', animationDuration: '30s' }}/>
        <circle cx="50" cy="50" r="28" fill="none" stroke="url(#grad3)" strokeWidth="1" />
      </svg>

      <svg className="absolute bottom-24 right-8 w-40 h-40 opacity-8 animate-float" style={{ animationDelay: '0.5s' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        <polygon points="50,12 62,38 90,38 68,56 75,82 50,62 25,82 32,56 10,38 38,38" fill="none" stroke="url(#grad4)" strokeWidth="2" className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '35s' }}/>
        <circle cx="50" cy="50" r="8" fill="url(#grad4)" opacity="0.6" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="url(#grad4)" strokeWidth="1.5" />
        <path d="M 50 25 L 50 20 M 75 50 L 80 50 M 50 75 L 50 80 M 25 50 L 20 50" stroke="url(#grad4)" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/8 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/4 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div
        className="absolute top-0 left-0 w-full h-1 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)',
          animation: 'shimmer-horizontal 3s ease-in-out infinite'
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-full h-1 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)',
          animation: 'shimmer-horizontal 3s ease-in-out infinite',
          animationDelay: '1.5s'
        }}
      />

      {children}
    </div>
  );
}
