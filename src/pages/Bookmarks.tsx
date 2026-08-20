import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ToolCard } from '../components/tools/ToolCard';
import { EmptyState } from '../components/common/EmptyState';
import { fetchTools, getSavedToolSlugs } from '../lib/services/toolsService';
import { updateSEO } from '../lib/seo';
import { Tool } from '../types';

export const Bookmarks: React.FC = () => {
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    setLoading(true);
    const slugs = getSavedToolSlugs();
    if (slugs.length === 0) {
      setSavedTools([]);
      setLoading(false);
      return;
    }

    const allRes = await fetchTools();
    const filtered = allRes.data.filter(t => slugs.includes(t.slug));
    setSavedTools(filtered);
    setLoading(false);
  };

  useEffect(() => {
    updateSEO({
      title: 'Your Saved AI Tools — AI Nexus',
      description: 'Quickly access and organize the AI tools you have bookmarked for your projects.'
    });

    loadSaved();

    const handleUpdate = () => loadSaved();
    window.addEventListener('bookmarks-updated', handleUpdate);
    return () => window.removeEventListener('bookmarks-updated', handleUpdate);
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your saved bookmarks?')) {
      localStorage.removeItem('ainexus_saved_tools');
      window.dispatchEvent(new Event('bookmarks-updated'));
      setSavedTools([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      <Breadcrumbs items={[{ name: 'Bookmarks' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Saved AI Tools
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tools you have bookmarked for your workflows. Saved locally in your browser.
          </p>
        </div>

        {savedTools.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Bookmarks</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      ) : savedTools.length === 0 ? (
        <EmptyState
          title="No saved AI tools yet"
          description="Click the bookmark icon on any tool card in the directory to save it here for fast reference."
          actionText="Explore Directory"
          onActionClick={() => (window.location.href = '/tools')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};
