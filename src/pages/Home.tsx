import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Layers,
  BookOpen,
  CheckCircle2,
  Database,
  Flame,
  Zap
} from 'lucide-react';
import { Hero3DCanvas } from '../components/home/Hero3DCanvas';
import { ToolCard } from '../components/tools/ToolCard';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { BlogCard } from '../components/blog/BlogCard';
import { AdSlot } from '../components/common/AdSlot';
import { ToolCardSkeleton, CategoryCardSkeleton, BlogCardSkeleton } from '../components/common/LoadingSkeleton';
import { fetchFeaturedTools, fetchTrendingTools } from '../lib/services/toolsService';
import { fetchCategories } from '../lib/services/categoriesService';
import { fetchFeaturedBlogPosts, fetchBlogPosts } from '../lib/services/blogService';
import { updateSEO } from '../lib/seo';
import { Tool, Category, BlogPost } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO({
      title: 'AI Nexus — Discover the AI Tools Shaping the Future',
      description: 'Explore curated AI tools for writing, image generation, video, coding, productivity, and marketing with honest ratings, reviews, and guides.'
    });

    const loadData = async () => {
      setLoading(true);
      try {
        const [featured, trending, cats, blogs] = await Promise.all([
          fetchFeaturedTools(6),
          fetchTrendingTools(6),
          fetchCategories(),
          fetchBlogPosts({ limit: 3 })
        ]);

        setFeaturedTools(featured);
        setTrendingTools(trending);
        setCategories(cats.data);
        setBlogPosts(blogs.data);
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/tools?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/tools');
    }
  };

  const quickPills = ['ChatGPT', 'Claude', 'Cursor', 'Video', 'Coding', 'Midjourney', 'Free Tools'];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>v4.0 Spatial AI Directory</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-display">
                Next-Gen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                  AI Tools
                </span>{' '}
                for Spatial Productivity & Scale
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Explore curated, high-performance AI engines for generative writing, vision, coding IDEs, audio synthesis, and autonomous workflows.
              </p>

              {/* Hero Search Box */}
              <form
                onSubmit={handleHeroSearchSubmit}
                className="relative max-w-xl mx-auto lg:mx-0 shadow-2xl shadow-blue-600/10 rounded-2xl border border-white/10 bg-[#0c0d14]/90 backdrop-blur-xl p-2 flex items-center gap-2"
              >
                <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  placeholder="Search 500+ AI engines (e.g. Cursor, Midjourney, Claude)..."
                  className="w-full text-sm outline-hidden placeholder:text-slate-500 py-2 bg-transparent text-white font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xl shadow-blue-600/40 shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Quick Search Suggestions */}
              <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start text-xs text-slate-400">
                <span className="font-semibold text-slate-500">Quick:</span>
                {quickPills.map(pill => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      if (pill === 'Free Tools') {
                        navigate('/tools?pricing=Free');
                      } else {
                        navigate(`/tools?q=${encodeURIComponent(pill)}`);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-cyan-300 text-slate-400 border border-white/5 transition cursor-pointer font-medium"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 justify-center lg:justify-start">
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition shadow-2xl shadow-blue-600/40 hover:scale-[1.02]"
                >
                  <span>Launch Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition backdrop-blur-md"
                >
                  <span>Browse Matrix</span>
                </Link>
              </div>
            </div>

            {/* Right 3D Visual */}
            <div className="lg:col-span-5 relative">
              <Hero3DCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Placement 1: Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="horizontal" slotId="home-hero-bottom-ad" />
      </div>

      {/* 2. FEATURED AI TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Hand-Picked By Editors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Featured AI Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Industry standard solutions trusted by thousands of creators and engineers worldwide.
            </p>
          </div>

          <Link
            to="/tools?featured=true"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-cyan-300 transition"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <ToolCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Organized By Domain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Explore AI Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse through writing, generative imagery, coding IDEs, audio dubbing, and automation.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-cyan-300 transition"
          >
            <span>View All 14 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <CategoryCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <CategoryGrid categories={categories} limit={8} />
        )}
      </section>

      {/* 4. TRENDING AI TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0a0b12] border border-white/10 text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1">
                <Flame className="w-4 h-4" />
                <span>Fastest Growing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Trending AI Tools This Week
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Software gaining massive community adoption, high velocity GitHub stars, and viral growth.
              </p>
            </div>

            <Link
              to="/tools?trending=true"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 hover:text-white transition"
            >
              <span>Explore Trending</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {trendingTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Placement 2: Mid-page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="horizontal" slotId="home-mid-page-ad" />
      </div>

      {/* 5. LATEST BLOG & GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Knowledge & Benchmarks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Latest AI Guides & Insights
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              In-depth software comparisons, benchmarks, and actionable productivity playbooks.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-cyan-300 transition"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <BlogCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Supabase Dynamic Cloud Database Status Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-500/20 bg-[#0c0d14]/90 backdrop-blur-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/10">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Scalable PostgreSQL Persistence Powered by Supabase
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add and manage new tools, blogs, categories, reviews, and newsletter subscribers directly via your Supabase dashboard without changing code.
              </p>
            </div>
          </div>

          <Link
            to="/supabase-setup"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-white font-semibold text-xs transition shrink-0 shadow-xs"
          >
            View SQL Setup Guide →
          </Link>
        </div>
      </section>
    </div>
  );
};
