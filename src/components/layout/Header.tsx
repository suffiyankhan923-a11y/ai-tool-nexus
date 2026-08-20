import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Bookmark,
  PlusCircle,
  Menu,
  X,
  Compass,
  Layers,
  BookOpen,
  Info,
  Mail,
  Database
} from 'lucide-react';
import { getSavedToolSlugs, searchTools } from '../../lib/services/toolsService';
import { SubmitToolModal } from '../tools/SubmitToolModal';
import { fetchCategories } from '../../lib/services/categoriesService';
import { Category, Tool } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Update bookmarks count
  useEffect(() => {
    const updateCount = () => {
      setSavedCount(getSavedToolSlugs().length);
    };
    updateCount();
    window.addEventListener('bookmarks-updated', updateCount);
    return () => window.removeEventListener('bookmarks-updated', updateCount);
  }, []);

  // Fetch categories for submit modal
  useEffect(() => {
    fetchCategories().then(res => setCategories(res.data));
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Live search handler
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      searchTools(searchQuery, 6).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Tools', path: '/tools' },
    { name: 'Categories', path: '/categories' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/40 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display flex items-center gap-1">
                AI Nexus
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-white bg-white/5 border border-white/10 shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action buttons (Right) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick search button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium transition cursor-pointer border border-white/10 shadow-2xs"
              title="Search AI Tools (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Saved Bookmarks */}
            <Link
              to="/bookmarks"
              className="relative p-2.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-white/5 transition"
              title="Saved AI Tools"
              aria-label="Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center animate-scale-in shadow-xs shadow-blue-500/50">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Submit Tool Button */}
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Tool</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/5 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#08090f]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'text-white bg-white/10 border border-white/10 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/bookmarks"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-400" />
                  <span>Saved Bookmarks</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {savedCount}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubmitModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit an AI Tool</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0c0d14] shadow-2xl border border-white/10 overflow-hidden text-slate-200">
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
              <Search className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search AI tools (e.g. ChatGPT, Cursor, Midjourney)..."
                className="w-full text-base outline-hidden placeholder:text-slate-500 font-medium bg-transparent text-white"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto p-3">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
                    Matching AI Tools
                  </div>
                  {searchResults.map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setSearchModalOpen(false);
                        setSearchQuery('');
                        navigate(`/tools/${tool.slug}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/20 border border-transparent transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-blue-400 text-sm overflow-hidden shrink-0">
                          {tool.logo_url ? (
                            <img src={tool.logo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            tool.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-400">{tool.category} • {tool.pricing}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition">
                        View →
                      </span>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim().length > 1 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No tools found for "{searchQuery}".
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  Type tool name, function, or keywords to search directory...
                </div>
              )}
            </div>

            <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-slate-300">ESC</kbd> to close</span>
              <Link
                to={`/tools?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchModalOpen(false)}
                className="font-semibold text-blue-400 hover:text-cyan-300 transition"
              >
                Open Full Directory Filters →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Submit Tool Modal */}
      <SubmitToolModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        categories={categories}
      />
    </>
  );
};
