interface TurquoiseCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TurquoiseCard({ children, className = "" }: TurquoiseCardProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 242, 242, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px 0 rgba(239, 68, 68, 0.15), inset 0 0 30px rgba(252, 165, 165, 0.1)'
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(248, 113, 113, 0.2)',
          borderRadius: '11px',
          margin: '4px'
        }}
      />
      {children}
    </div>
  );
}
