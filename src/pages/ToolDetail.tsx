import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Bookmark,
  CheckCircle2,
  XCircle,
  Sparkles,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquarePlus,
  Share2
} from 'lucide-react';
import { fetchToolBySlug, fetchRelatedTools, fetchToolReviews, submitToolReview, isToolSaved, toggleSaveTool } from '../lib/services/toolsService';
import { PricingBadge, VerifiedBadge, FeaturedBadge, TrendingBadge } from '../components/common/Badge';
import { Rating } from '../components/common/Rating';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ToolCard } from '../components/tools/ToolCard';
import { AdSlot } from '../components/common/AdSlot';
import { ShareButtons } from '../components/common/ShareButtons';
import { updateSEO, generateToolSchema } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { Tool, ToolReview } from '../types';

export const ToolDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [reviews, setReviews] = useState<ToolReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (!slug) return;

    const loadToolData = async () => {
      setLoading(true);
      const res = await fetchToolBySlug(slug);

      if (!res.data) {
        setTool(null);
        setLoading(false);
        return;
      }

      setTool(res.data);
      setSaved(isToolSaved(res.data.slug));

      // SEO & Structured Data
      updateSEO({
        title: `${res.data.name} — Review, Pricing & Features (2026)`,
        description: res.data.description,
        type: 'product',
        schema: generateToolSchema(res.data)
      });

      // Load related and reviews
      const [related, revs] = await Promise.all([
        fetchRelatedTools(res.data.slug, res.data.category, 3),
        fetchToolReviews(res.data.slug)
      ]);

      setRelatedTools(related);
      setReviews(revs);
      setLoading(false);
    };

    loadToolData();
  }, [slug]);

  const handleBookmarkToggle = () => {
    if (!tool) return;
    const newState = toggleSaveTool(tool.slug);
    setSaved(newState);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool || !authorName.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    const res = await submitToolReview({
      tool_slug: tool.slug,
      author_name: authorName.trim(),
      rating: ratingScore,
      comment: reviewComment.trim()
    });
    setReviewSubmitting(false);

    if (res.success) {
      setReviewSuccess('Your review has been posted!');
      const updatedRevs = await fetchToolReviews(tool.slug);
      setReviews(updatedRevs);
      setAuthorName('');
      setReviewComment('');
      setTimeout(() => setReviewSuccess(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 animate-pulse">
        <div className="w-48 h-4 bg-slate-200 rounded mb-6" />
        <div className="h-40 bg-slate-200 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl" />
          <div className="h-96 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Tool Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The tool you are looking for does not exist in our directory or has been renamed.
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
        >
          <span>Browse All AI Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'AI Tools', url: '/tools' },
    { name: tool.category, url: `/category/${tool.category_slug || tool.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: tool.name }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Main Tool Hero Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl mb-10 text-slate-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Logo and info */}
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={`${tool.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-extrabold font-display text-blue-400">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
                  {tool.name}
                </h1>
                {tool.verified && <VerifiedBadge size="md" />}
                {tool.featured && <FeaturedBadge />}
                {tool.trending && <TrendingBadge />}
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 flex-wrap">
                <Link
                  to={`/category/${tool.category_slug || tool.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-semibold text-blue-400 hover:text-cyan-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md"
                >
                  {tool.category}
                </Link>
                <span>•</span>
                <PricingBadge pricing={tool.pricing} size="md" />
                <span>•</span>
                <Rating rating={tool.rating} reviewCount={tool.review_count} size="md" />
              </div>

              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer border ${
                saved
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-400 text-blue-400' : ''}`} />
              <span>{saved ? 'Saved to Bookmarks' : 'Bookmark'}</span>
            </button>

            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left Details & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Overview */}
          <section className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 font-display">
              About {tool.name}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line mb-6">
              {tool.long_description || tool.description}
            </p>

            {/* Key Features */}
            {tool.features && tool.features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Key Capabilities & Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Pros & Cons */}
          {(tool.pros || tool.cons) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Pros */}
              {tool.pros && (
                <div className="bg-emerald-950/20 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-6 shadow-xl">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 mb-4 text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Key Advantages</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-emerald-200 font-medium">
                    {tool.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {tool.cons && (
                <div className="bg-rose-950/10 backdrop-blur-xl rounded-3xl border border-rose-500/20 p-6 shadow-xl">
                  <div className="flex items-center gap-2 font-bold text-slate-300 mb-4 text-base">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Considerations & Limits</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    {tool.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* AdSense Placement Inside Tool Profile */}
          <AdSlot placement="horizontal" slotId="tool-detail-mid-ad" />

          {/* Pricing Details */}
          {tool.pricing_tier_details && (
            <section className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2 font-display">
                Pricing & Subscription Model
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {tool.pricing_tier_details}
              </p>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Primary Tier: {tool.pricing}</span>
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Check Current Pricing</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>
          )}

          {/* Community Reviews & Feedback */}
          <section className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-8">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-white font-display">
                  Community Reviews & Ratings
                </h3>
                <Rating rating={tool.rating} reviewCount={tool.review_count} size="md" />
              </div>
              <p className="text-xs text-slate-500">
                Honest feedback from real creators and developers using {tool.name} daily.
              </p>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map(rev => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center justify-center">
                          {rev.author_name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.author_name}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <div className="text-[10px] text-slate-500 font-mono">{formatDate(rev.created_at)}</div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 font-mono">
                  No written reviews yet. Be the first to share your experience with {tool.name}!
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-3">
                <MessageSquarePlus className="w-4 h-4 text-blue-400" />
                <span>Write a Review</span>
              </div>

              {reviewSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {reviewSuccess}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                        placeholder="Alex R."
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 text-white placeholder:text-slate-500 outline-hidden text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
                        Rating (1 - 5 Stars)
                      </label>
                      <select
                        value={ratingScore}
                        onChange={e => setRatingScore(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#0e0f18] border border-white/10 focus:border-blue-500 text-white outline-hidden text-xs font-medium"
                      >
                        <option value={5} className="bg-[#0e0f18]">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value={4} className="bg-[#0e0f18]">⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value={3} className="bg-[#0e0f18]">⭐⭐⭐ (3 - Average)</option>
                        <option value={2} className="bg-[#0e0f18]">⭐⭐ (2 - Needs Improvement)</option>
                        <option value={1} className="bg-[#0e0f18]">⭐ (1 - Not Recommended)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
                      Your Review / Experience
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder={`How has ${tool.name} helped your workflow? What could be better?`}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 text-white placeholder:text-slate-500 outline-hidden text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{reviewSubmitting ? 'Posting Review...' : 'Submit Review'}</span>
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fast Facts Card */}
          <div className="bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Tool Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Official Website</span>
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-cyan-300 hover:underline truncate max-w-[160px]"
                >
                  {tool.website_url.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-white">{tool.category}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Pricing Model</span>
                <PricingBadge pricing={tool.pricing} size="sm" />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Verification</span>
                <span className="inline-flex items-center gap-1 text-blue-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Directory Added</span>
                <span className="text-slate-300 font-mono">{formatDate(tool.created_at)}</span>
              </div>
            </div>

            {/* Tags */}
            {tool.tags && (
              <div className="pt-2">
                <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Tags & Taxonomy
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tool.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      to={`/tools?q=${encodeURIComponent(tag)}`}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-blue-500/20 hover:text-blue-300 border border-white/5 text-slate-400 font-mono transition"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className="pt-4 border-t border-white/5">
              <ShareButtons
                title={`Check out ${tool.name} on AI Nexus — ${tool.description}`}
              />
            </div>
          </div>

          {/* Sidebar AdSense Placement */}
          <AdSlot placement="rectangle" slotId="tool-detail-sidebar-ad" />
        </div>
      </div>

      {/* Related AI Tools Section */}
      {relatedTools.length > 0 && (
        <section className="mt-16 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-white font-display">
                Related AI Tools in {tool.category}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore popular alternatives and companion software.
              </p>
            </div>

            <Link
              to={`/category/${tool.category_slug || tool.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-semibold text-blue-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Category</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTools.map(rel => (
              <ToolCard key={rel.id} tool={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
