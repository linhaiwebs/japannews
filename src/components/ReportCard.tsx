import { ReactNode } from 'react';

interface ReportCardProps {
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
  layout?: 'horizontal' | 'vertical';
  imageWidth?: string;
}

export default function ReportCard({
  title,
  description,
  tags,
  imageSrc,
  layout = 'vertical',
  imageWidth = '40%'
}: ReportCardProps) {
  if (layout === 'horizontal') {
    return (
      <div className="flex gap-4">
        <div style={{ width: imageWidth, flexShrink: 0 }}>
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-mizuho-cyan/10 to-mizuho-blue/10 rounded-lg overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm text-text-dark leading-relaxed mb-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-mizuho-cyan text-white text-xs font-bold rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-mizuho-cyan/10 to-mizuho-blue/10 rounded-lg overflow-hidden mb-2 md:mb-3">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-xs md:text-sm text-text-dark leading-relaxed mb-2 md:mb-3">
        {description}
      </p>

      <div className="flex flex-wrap gap-1 md:gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 md:px-3 py-0.5 md:py-1 bg-mizuho-cyan text-white text-[10px] md:text-xs font-bold rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
