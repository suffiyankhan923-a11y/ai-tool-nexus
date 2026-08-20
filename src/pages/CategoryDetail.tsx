import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { AdSlot } from '../components/common/AdSlot';
import { getCategoryIcon } from '../components/home/CategoryGrid';
import { fetchCategoryBySlug } from '../lib/services/categoriesService';
import { fetchToolsByCategory } from '../lib/services/toolsService';
import { updateSEO } from '../lib/seo';
import { Tool, Category } from '../types';

export const CategoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [pricingFilter, setPricingFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadCategory = async () => {
      setLoading(true);
      const [catRes, toolsData] = await Promise.all([
        fetchCategoryBySlug(slug),
        fetchToolsByCategory(slug)
      ]);

      if (catRes.data) {
        setCategory(catRes.data);
        updateSEO({
          title: `Best ${catRes.data.name} Tools (2026) — AI Nexus`,
          description: `Discover and compare top ${catRes.data.name} software. ${catRes.data.description}`
        });
      }

      setTools(toolsData);
      setLoading(false);
    };

    loadCategory();
  }, [slug]);

  // Apply local pricing filter and sort
  const filteredTools = tools
    .filter(t => pricingFilter === 'all' || t.pricing.toLowerCase() === pricingFilter.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return b.review_count - a.review_count;
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="h-28 bg-slate-200 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <ToolCardSkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Category Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The category you requested does not exist.
        </p>
        <Link
          to="/categories"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <Breadcrumbs
        items={[
          { name: 'Categories', url: '/categories' },
          { name: category.name }
        ]}
      />

      {/* Category Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
            {getCategoryIcon(category.icon, 'w-7 h-7')}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300 shrink-0">
          {tools.length} {tools.length === 1 ? 'AI Tool' : 'AI Tools'} Listed
        </div>
      </div>

      {/* Filter and Sort Row */}
      <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pricing pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">Pricing:</span>
          {['all', 'Free', 'Freemium', 'Paid', 'Free Trial'].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPricingFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                pricingFilter === p
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-lg bg-[#0e0f18] border border-white/10 text-xs font-medium text-slate-200 outline-hidden focus:border-blue-500"
          >
            <option value="popular" className="bg-[#0e0f18]">Most Popular</option>
            <option value="rating" className="bg-[#0e0f18]">Highest Rated</option>
            <option value="newest" className="bg-[#0e0f18]">Newest</option>
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <EmptyState
          title={`No ${pricingFilter !== 'all' ? pricingFilter : ''} tools found in ${category.name}`}
          description="Try selecting a different pricing filter or explore our other tool categories."
          actionText="Show All Pricing"
          onActionClick={() => setPricingFilter('all')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {/* AdSense bottom */}
      <div className="mt-16">
        <AdSlot placement="horizontal" slotId="category-detail-bottom-ad" />
      </div>
    </div>
  );
};
