import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap" aria-label="Breadcrumb">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-400 transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            {item.url && !isLast ? (
              <Link
                to={item.url}
                className="text-slate-400 hover:text-blue-400 transition truncate max-w-[150px] sm:max-w-none"
              >
                {item.name}
              </Link>
            ) : (
              <span className="font-bold text-white truncate max-w-[200px] sm:max-w-none">
                {item.name}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
