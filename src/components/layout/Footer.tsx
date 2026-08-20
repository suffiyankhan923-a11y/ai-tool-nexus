import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, CheckCircle2, ShieldAlert, ArrowRight, Heart } from 'lucide-react';
import { subscribeNewsletter } from '../../lib/services/interactionService';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const res = await subscribeNewsletter(email);
    setMessage(res.message);
    if (res.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <footer className="mt-20 border-t border-white/5 bg-black/40 backdrop-blur-xl pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                AI Nexus
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover the AI tools shaping the future. An independent, curated directory and intelligence hub empowering creators, engineers, and businesses.
            </p>

            {/* Newsletter input */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Join the AI Nexus Weekly Digest
              </div>
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 focus:bg-black/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-slate-500 outline-hidden transition"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
              {status === 'error' && (
                <p className="text-[11px] text-rose-400 mt-1">{message}</p>
              )}
            </div>
          </div>

          {/* Explore Col */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Directory
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/tools" className="hover:text-white transition">
                  All AI Tools
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Tool Categories
                </Link>
              </li>
              <li>
                <Link to="/tools?featured=true" className="hover:text-white transition">
                  Featured AI Softwares
                </Link>
              </li>
              <li>
                <Link to="/tools?trending=true" className="hover:text-white transition">
                  Trending Releases
                </Link>
              </li>
              <li>
                <Link to="/tools?pricing=Free" className="hover:text-white transition">
                  100% Free AI Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources & Insights
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/blog" className="hover:text-white transition">
                  AI Blog & Tutorials
                </Link>
              </li>
              <li>
                <Link to="/blog/best-ai-writing-tools-2026" className="hover:text-white transition">
                  AI Writing Software
                </Link>
              </li>
              <li>
                <Link to="/blog/best-ai-coding-tools-for-developers" className="hover:text-white transition">
                  Coding Tools Benchmark
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/supabase-setup" className="hover:text-cyan-300 transition text-blue-400 font-semibold">
                  Supabase Setup Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Col */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Trust
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition">
                  Editorial Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sleek Live Telemetry Status Bar */}
        <div className="py-6 border-y border-white/5 flex flex-wrap items-center justify-between gap-6 text-xs font-mono mb-8">
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Directory Sync</div>
              <div className="text-sm font-semibold text-slate-200">0.2ms <span className="text-emerald-400 text-xs font-normal">Realtime</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Indexed Tools</div>
              <div className="text-sm font-semibold text-slate-200">500+ <span className="text-blue-400 text-xs font-normal">Active</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Global Nodes</div>
              <div className="text-sm font-semibold text-slate-200">24 <span className="text-emerald-400 text-xs font-normal">Live</span></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs">System Status:</span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AI Nexus. All rights reserved. Built for creators & developers.
          </div>

          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-300 transition">
              Terms
            </Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-slate-300 transition">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
