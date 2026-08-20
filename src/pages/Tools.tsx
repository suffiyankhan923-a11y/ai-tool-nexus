import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolFilterBar } from '../components/tools/ToolFilterBar';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { AdSlot } from '../components/common/AdSlot';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { fetchTools } from '../lib/services/toolsService';
import { fetchCategories } from '../lib/services/categoriesService';
import { updateSEO } from '../lib/seo';
import { Tool, Category, FilterState } from '../types';

const ITEMS_PER_PAGE = 12;

export const Tools: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL search params
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    pricing: searchParams.get('pricing') || 'all',
    sort: (searchParams.get('sort') as FilterState['sort']) || 'popular',
    featuredOnly: searchParams.get('featured') === 'true',
    trendingOnly: searchParams.get('trending') === 'true',
    verifiedOnly: searchParams.get('verified') === 'true'
  });

  useEffect(() => {
    updateSEO({
      title: 'Explore AI Tools Directory — AI Nexus',
      description: 'Search and filter hundreds of verified AI tools across writing, coding, image generation, video, and automation.'
    });

    fetchCategories().then(res => setCategories(res.data));
  }, []);

  // Update data whenever filters change
  useEffect(() => {
    const loadTools = async () => {
      setLoading(true);
      const res = await fetchTools(filters);
      setTools(res.data);
      setLoading(false);
      setCurrentPage(1);
    };

    loadTools();

    // Sync filters with URL query parameters
    const params: Record<string, string> = {};
    if (filters.search) params.q = filters.search;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.pricing && filters.pricing !== 'all') params.pricing = filters.pricing;
    if (filters.sort !== 'popular') params.sort = filters.sort;
    if (filters.featuredOnly) params.featured = 'true';
    if (filters.trendingOnly) params.trending = 'true';
    if (filters.verifiedOnly) params.verified = 'true';

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      pricing: 'all',
      sort: 'popular',
      featuredOnly: false,
      trendingOnly: false,
      verifiedOnly: false
    });
  };

  // Pagination calculation
  const totalPages = Math.ceil(tools.length / ITEMS_PER_PAGE);
  const displayedTools = tools.slice(0, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <Breadcrumbs items={[{ name: 'AI Tools' }]} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Explore AI Tools
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Discover vetted artificial intelligence software. Filter by capabilities, pricing model, community rating, and popularity.
        </p>
      </div>

      {/* Filter Matrix */}
      <ToolFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        totalResults={tools.length}
      />

      {/* Tool Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <ToolCardSkeleton key={n} />
          ))}
        </div>
      ) : tools.length === 0 ? (
        <EmptyState
          title="No AI tools matched your filters"
          description="We couldn't find tools matching your current filter combination. Try resetting your search or exploring our categories."
          actionText="Reset All Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedTools.map((tool, index) => (
              <React.Fragment key={tool.id}>
                <ToolCard tool={tool} />
                {/* Insert AdSense between rows after the 8th item */}
                {index === 7 && displayedTools.length > 8 && (
                  <div className="col-span-full py-2">
                    <AdSlot placement="horizontal" slotId="tools-directory-grid-ad" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Load More Pagination */}
          {displayedTools.length < tools.length && (
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Load More Tools ({tools.length - displayedTools.length} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom AdSense placement */}
      <div className="mt-16">
        <AdSlot placement="horizontal" slotId="tools-directory-bottom-ad" />
      </div>
    </div>
  );
};
