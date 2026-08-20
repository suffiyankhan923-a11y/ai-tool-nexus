import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { formatDate } from '../../lib/utils';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  if (featured) {
    return (
      <div className="group relative rounded-3xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl overflow-hidden shadow-2xl hover:border-blue-500/40 hover:shadow-blue-500/10 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 card-3d-hover">
        <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden bg-white/5">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0c0d14]/90 backdrop-blur-md text-blue-300 border border-white/10 shadow-lg">
              {post.category}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.created_at)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {post.read_time}
              </span>
            </div>

            <Link to={`/blog/${post.slug}`} className="block">
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition mb-3 leading-snug">
                {post.title}
              </h3>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
              <div>
                <div className="text-xs font-bold text-white">{post.author_name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{post.author_role}</div>
              </div>
            </div>

            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-cyan-300 group-hover:translate-x-1 transition"
            >
              <span>Read Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl overflow-hidden shadow-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between card-3d-hover h-full">
      <div>
        <div className="relative h-48 overflow-hidden bg-white/5">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#0c0d14]/90 backdrop-blur-md text-blue-300 border border-white/10 shadow-lg">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              {formatDate(post.created_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              {post.read_time}
            </span>
          </div>

          <Link to={`/blog/${post.slug}`}>
            <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition mb-2 leading-snug line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between mt-auto pt-3">
        <div className="flex items-center gap-2">
          <img
            src={post.author_avatar}
            alt={post.author_name}
            className="w-6 h-6 rounded-full object-cover border border-white/10"
          />
          <span className="text-xs font-semibold text-slate-300">{post.author_name}</span>
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-cyan-300"
        >
          <span>Read</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
