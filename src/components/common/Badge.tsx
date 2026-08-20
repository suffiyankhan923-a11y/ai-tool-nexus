import React from 'react';
import { PricingType } from '../../types';
import { Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PricingBadgeProps {
  pricing: PricingType | string;
  size?: 'sm' | 'md';
}

export const PricingBadge: React.FC<PricingBadgeProps> = ({ pricing, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-mono' : 'px-2.5 py-1 text-xs font-semibold font-mono';

  switch (pricing) {
    case 'Free':
      return (
        <span className={`inline-flex items-center rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-xs shadow-emerald-500/10 ${sizeClasses}`}>
          Free
        </span>
      );
    case 'Freemium':
      return (
        <span className={`inline-flex items-center rounded-full font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30 shadow-xs shadow-blue-500/10 ${sizeClasses}`}>
          Freemium
        </span>
      );
    case 'Free Trial':
      return (
        <span className={`inline-flex items-center rounded-full font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-xs shadow-amber-500/10 ${sizeClasses}`}>
          Free Trial
        </span>
      );
    case 'Paid':
    default:
      return (
        <span className={`inline-flex items-center rounded-full font-medium bg-white/5 text-slate-300 border border-white/10 shadow-xs ${sizeClasses}`}>
          Paid
        </span>
      );
  }
};

export const VerifiedBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-xs shadow-blue-500/10 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs'
      } font-medium`}
      title="Verified AI Tool"
    >
      <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-blue-400' : 'w-3.5 h-3.5 text-blue-400'} />
      <span>Verified</span>
    </span>
  );
};

export const FeaturedBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-xs shadow-amber-500/10">
      <Sparkles className="w-3 h-3 text-amber-400" />
      <span>Featured</span>
    </span>
  );
};

export const TrendingBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-xs shadow-rose-500/10">
      <TrendingUp className="w-3 h-3 text-rose-400" />
      <span>Trending</span>
    </span>
  );
};
