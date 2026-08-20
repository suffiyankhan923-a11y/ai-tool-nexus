import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Check, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { FilterState, Category } from '../../types';

interface ToolFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  categories: Category[];
  totalResults: number;
}

export const ToolFilterBar: React.FC<ToolFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories,
  totalResults
}) => {
  const pricingOptions = ['all', 'Free', 'Freemium', 'Paid', 'Free Trial'];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.pricing !== 'all' ||
    filters.featuredOnly ||
    filters.trendingOnly ||
    filters.verifiedOnly;

  return (
    <div className="bg-[#0c0d14]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl mb-8 space-y-4 text-slate-200">
      {/* Top row: Search input and Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => onFilterChange({ search: e.target.value })}
            placeholder="Search AI tools by name, description, tags (e.g. video, coding, GPT)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden text-sm transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Select & Sort Select */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Category Dropdown */}
          <select
            value={filters.category}
            onChange={e => onFilterChange({ category: e.target.value })}
            className="px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-sm font-medium text-slate-200 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            aria-label="Select Category"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug} className="bg-[#0e0f18]">
                {cat.name} ({cat.tool_count || 0})
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={e => onFilterChange({ sort: e.target.value as FilterState['sort'] })}
              className="pl-8 pr-8 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-sm font-medium text-slate-200 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
              aria-label="Sort options"
            >
              <option value="popular" className="bg-[#0e0f18]">Most Popular</option>
              <option value="rating" className="bg-[#0e0f18]">Highest Rated</option>
              <option value="newest" className="bg-[#0e0f18]">Newest Added</option>
              <option value="alphabetical" className="bg-[#0e0f18]">Name (A-Z)</option>
            </select>
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom row: Pricing pills and Quick Toggles */}
      <div className="pt-3 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 flex-wrap">
        {/* Pricing filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
            Pricing:
          </span>
          {pricingOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onFilterChange({ pricing: option })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer font-mono ${
                filters.pricing === option
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {option === 'all' ? 'All Pricing' : option}
            </button>
          ))}
        </div>

        {/* Feature / Trending / Verified toggles & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onFilterChange({ featuredOnly: !filters.featuredOnly })}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
              filters.featuredOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Featured</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ trendingOnly: !filters.trendingOnly })}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
              filters.trendingOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-rose-400" />
            <span>Trending</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
              filters.verifiedOnly
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-xs'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>Verified Only</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <span className="text-xs text-slate-500 ml-auto font-mono">
            {totalResults} {totalResults === 1 ? 'tool' : 'tools'}
          </span>
        </div>
      </div>
    </div>
  );
};
