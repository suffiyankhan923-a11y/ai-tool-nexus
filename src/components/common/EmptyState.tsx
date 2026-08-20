import React from 'react';
import { SearchX, ArrowRight, RefreshCw, FolderSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
  icon?: 'search' | 'folder' | 'tools';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No AI tools found',
  description = 'Try adjusting your search terms or clearing some category and pricing filters.',
  actionText = 'Clear All Filters',
  actionLink,
  onActionClick,
  icon = 'search'
}) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0c0d14]/90 backdrop-blur-xl p-12 text-center max-w-lg mx-auto my-8 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 text-blue-400 shadow-lg shadow-blue-500/10">
        {icon === 'search' ? (
          <SearchX className="w-8 h-8" />
        ) : (
          <FolderSearch className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>

      <div className="flex items-center justify-center gap-3">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : onActionClick ? (
          <button
            type="button"
            onClick={onActionClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <span>{actionText}</span>
            <RefreshCw className="w-4 h-4" />
          </button>
        ) : null}

        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:text-white transition"
        >
          <span>Browse Matrix</span>
        </Link>
      </div>
    </div>
  );
};
