import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Bookmark, Sparkles, TrendingUp } from 'lucide-react';
import { Tool } from '../../types';
import { PricingBadge, VerifiedBadge } from '../common/Badge';
import { Rating } from '../common/Rating';
import { isToolSaved, toggleSaveTool } from '../../lib/services/toolsService';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setSaved(isToolSaved(tool.slug));

    const handleUpdate = () => {
      setSaved(isToolSaved(tool.slug));
    };

    window.addEventListener('bookmarks-updated', handleUpdate);
    return () => window.removeEventListener('bookmarks-updated', handleUpdate);
  }, [tool.slug]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSaveTool(tool.slug);
    setSaved(newState);
  };

  // First letter avatar fallback
  const fallbackLetter = tool.name.charAt(0).toUpperCase();

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-5 shadow-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 card-3d-hover flex flex-col justify-between h-full transition-all duration-300">
      <div>
        {/* Header: Logo, Name, Badges, Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {tool.logo_url && !imageError ? (
                <img
                  src={tool.logo_url}
                  alt={`${tool.name} logo`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-lg font-bold font-display text-blue-400">
                  {fallbackLetter}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={`/tools/${tool.slug}`}
                  className="font-bold text-white hover:text-blue-400 transition truncate text-base"
                >
                  {tool.name}
                </Link>
                {tool.verified && <VerifiedBadge size="sm" />}
              </div>
              <Link
                to={`/category/${tool.category_slug || tool.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs text-slate-400 hover:text-slate-200 block truncate mt-0.5"
              >
                {tool.category}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <PricingBadge pricing={tool.pricing} size="sm" />
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                saved
                  ? 'text-blue-400 bg-blue-500/20 border border-blue-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
              title={saved ? 'Remove from saved' : 'Save tool to bookmarks'}
              aria-label="Save tool"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {tool.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/5 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Rating and Actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
        <Rating rating={tool.rating} reviewCount={tool.review_count} size="sm" />

        <div className="flex items-center gap-1.5">
          <Link
            to={`/tools/${tool.slug}`}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
          >
            Details
          </Link>
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition"
            title="Visit official website"
            aria-label={`Visit official website for ${tool.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
