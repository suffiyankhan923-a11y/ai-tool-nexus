import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  showCount = true,
  size = 'sm'
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base font-semibold';

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map(starIndex => (
          <Star
            key={starIndex}
            className={`${starSize} ${
              starIndex <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                : 'text-slate-700 fill-slate-800/60'
            }`}
          />
        ))}
      </div>
      <span className={`font-bold text-slate-200 ${textSize}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-slate-500 font-normal">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
