import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { fetchBlogPostBySlug, fetchRelatedBlogPosts } from '../lib/services/blogService';
import { fetchRelatedTools } from '../lib/services/toolsService';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { BlogCard } from '../components/blog/BlogCard';
import { ToolCard } from '../components/tools/ToolCard';
import { TableOfContents } from '../components/blog/TableOfContents';
import { AdSlot } from '../components/common/AdSlot';
import { ShareButtons } from '../components/common/ShareButtons';
import { updateSEO, generateArticleSchema } from '../lib/seo';
import { formatDate } from '../lib/utils';
import { BlogPost as IBlogPost, Tool } from '../types';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<IBlogPost[]>([]);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  // Track scroll progress for article reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress((window.pageYOffset / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;

    const loadPostData = async () => {
      setLoading(true);
      const res = await fetchBlogPostBySlug(slug);

      if (!res.data) {
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(res.data);

      updateSEO({
        title: res.data.seo_title || `${res.data.title} — AI Nexus`,
        description: res.data.seo_description || res.data.excerpt,
        image: res.data.featured_image,
        type: 'article',
        schema: generateArticleSchema(res.data)
      });

      const [relPosts, relTools] = await Promise.all([
        fetchRelatedBlogPosts(res.data.slug, res.data.category, 2),
        fetchRelatedTools('', 'AI Writing', 2)
      ]);

      setRelatedPosts(relPosts);
      setRelatedTools(relTools);
      setLoading(false);
    };

    loadPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
        <div className="h-96 w-full bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested guide could not be found or has moved.
        </p>
        <Link
          to="/blog"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Blog', url: '/blog' },
    { name: post.category, url: `/blog` },
    { name: post.title }
  ];

  return (
    <>
      {/* Top Reading Progress Line */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 z-50 transition-all duration-150 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Breadcrumbs items={breadcrumbs} />

        <div className="max-w-4xl mx-auto mb-10">
          {/* Category Pill & Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 flex-wrap font-mono">
            <span className="px-3 py-1 rounded-full font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.created_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.read_time}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 font-display">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-lg text-slate-300 leading-relaxed mb-6 font-normal">
            {post.excerpt}
          </p>

          {/* Author Card & Social Share */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-11 h-11 rounded-full object-cover border border-white/10"
              />
              <div>
                <div className="font-bold text-sm text-white">{post.author_name}</div>
                <div className="text-xs text-slate-400">{post.author_role}</div>
              </div>
            </div>

            <ShareButtons title={post.title} />
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>

        {/* Article Body & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 bg-[#0c0d14]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
            <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 text-sm sm:text-base space-y-4">
              {post.content.split('\n\n').map((block, idx) => {
                const trimmed = block.trim();
                if (trimmed.startsWith('### ')) {
                  const heading = trimmed.replace('### ', '');
                  const id = heading.toLowerCase().replace(/[^\w]+/g, '-');
                  return (
                    <h3 key={idx} id={id} className="text-xl font-bold text-white pt-4 mb-2">
                      {heading}
                    </h3>
                  );
                }
                if (trimmed.startsWith('#### ')) {
                  const heading = trimmed.replace('#### ', '');
                  return (
                    <h4 key={idx} className="text-lg font-bold text-slate-200 pt-2 mb-1">
                      {heading}
                    </h4>
                  );
                }
                if (trimmed.startsWith('---')) {
                  return <hr key={idx} className="my-6 border-white/10" />;
                }
                return (
                  <p key={idx} className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* AdSense In-Article Slot */}
            <AdSlot placement="inArticle" slotId="blog-post-middle-ad" />

            {/* Tags footer */}
            {post.tags && (
              <div className="pt-8 mt-8 border-t border-white/5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Topics:
                </span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <TableOfContents content={post.content} />
            <AdSlot placement="sidebar" slotId="blog-post-sidebar-ad" />
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/5 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-extrabold text-white font-display">
                Related Reading & Guides
              </h3>
              <Link
                to="/blog"
                className="text-sm font-semibold text-blue-400 hover:text-cyan-300"
              >
                View All Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(rel => (
                <BlogCard key={rel.id} post={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
