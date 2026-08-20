import React from 'react';
import { Link } from 'react-router-dom';
import {
  PenTool,
  Image as ImageIcon,
  Video,
  Code2,
  Zap,
  Mic,
  Megaphone,
  GraduationCap,
  Search,
  Palette,
  Briefcase,
  Cpu,
  MessageSquare,
  Presentation,
  Folder,
  ArrowRight
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
  limit?: number;
}

// Icon mapper helper
export function getCategoryIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Image':
      return <ImageIcon className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'Presentation':
      return <Presentation className={className} />;
    default:
      return <Folder className={className} />;
  }
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, limit }) => {
  const displayCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayCategories.map(cat => (
        <Link
          key={cat.id}
          to={`/category/${cat.slug}`}
          className="group relative rounded-2xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-5 shadow-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 card-3d-hover transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/10">
              {getCategoryIcon(cat.icon)}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white group-hover:text-cyan-300 transition truncate text-sm sm:text-base">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-cyan-300 transition">
            <span className="font-mono">{cat.tool_count || 1} Tools</span>
            <div className="flex items-center gap-1">
              <span>Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
