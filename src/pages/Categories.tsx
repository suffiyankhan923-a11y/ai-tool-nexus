import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { CategoryCardSkeleton } from '../components/common/LoadingSkeleton';
import { AdSlot } from '../components/common/AdSlot';
import { fetchCategories } from '../lib/services/categoriesService';
import { updateSEO } from '../lib/seo';
import { Category } from '../types';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO({
      title: 'AI Tool Categories — AI Nexus',
      description: 'Explore all AI tool categories including writing, coding, image synthesis, video, music, marketing, and business automation.'
    });

    fetchCategories().then(res => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  const filteredCategories = categories.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <Breadcrumbs items={[{ name: 'Categories' }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            AI Tool Categories
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Browse our taxonomy of specialized generative AI disciplines and enterprise productivity suites.
          </p>
        </div>

        {/* Search input for categories */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden text-sm shadow-inner"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <CategoryCardSkeleton key={n} />
          ))}
        </div>
      ) : (
        <CategoryGrid categories={filteredCategories} />
      )}

      <div className="mt-16">
        <AdSlot placement="horizontal" slotId="categories-bottom-ad" />
      </div>
    </div>
  );
};
