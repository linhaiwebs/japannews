interface ImagePlaceholderProps {
  name: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  bgColor?: string;
}

export default function ImagePlaceholder({
  name,
  width,
  height,
  alt,
  className = '',
  bgColor = '#E5E7EB'
}: ImagePlaceholderProps) {
  const imagePath = `/images/mizuho/${name}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: '100%'
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ backgroundColor: bgColor }}
      >
        <rect width={width} height={height} fill={bgColor} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9CA3AF"
          fontSize="14"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {name}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#D1D5DB"
          fontSize="11"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {width}×{height}
        </text>
      </svg>

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/75 flex items-center justify-center">
        <div className="text-white text-xs text-center px-4">
          <p className="font-semibold mb-1">📁 Upload image:</p>
          <p className="text-gray-300">{imagePath}</p>
        </div>
      </div>
    </div>
  );
}
