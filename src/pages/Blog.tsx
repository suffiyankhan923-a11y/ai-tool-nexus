import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogCardSkeleton } from '../components/common/LoadingSkeleton';
import { AdSlot } from '../components/common/AdSlot';
import { fetchBlogPosts, fetchBlogCategories } from '../lib/services/blogService';
import { updateSEO } from '../lib/seo';
import { BlogPost, BlogCategory } from '../types';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO({
      title: 'AI Insights, Guides & Software Reviews — AI Nexus Blog',
      description: 'In-depth tutorials, benchmarks, and tactical guides to help you maximize generative AI software for coding, writing, and work.'
    });

    const loadBlogData = async () => {
      setLoading(true);
      const [postsRes, catsRes] = await Promise.all([
        fetchBlogPosts(),
        fetchBlogCategories()
      ]);

      setPosts(postsRes.data);
      setCategories(catsRes);
      setLoading(false);
    };

    loadBlogData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchCat =
      selectedCategory === 'all' ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (post.category_slug && post.category_slug.toLowerCase() === selectedCategory.toLowerCase());

    const matchSearch =
      !search.trim() ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    return matchCat && matchSearch;
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const remainingPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <Breadcrumbs items={[{ name: 'Blog & Insights' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            AI Guides & Editorial Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Tested benchmarks, workflow breakdowns, and honest tool reviews written by practitioners.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guides & topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden text-sm shadow-inner"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          All Topics
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.slug
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="h-72 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <BlogCardSkeleton key={n} />
            ))}
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-800">No articles matched your filter criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearch('');
            }}
            className="mt-3 text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Featured Hero Article */}
          {featuredPost && (
            <BlogCard post={featuredPost} featured={true} />
          )}

          {/* AdSense In-Feed */}
          <AdSlot placement="horizontal" slotId="blog-feed-mid-ad" />

          {/* Grid of articles */}
          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
