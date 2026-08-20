import React, { useState, useEffect } from 'react';
import { Database, Check, Copy, Sparkles, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { updateSEO } from '../lib/seo';

export const SupabaseSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Supabase Cloud Database Setup Guide — AI Nexus',
      description: 'Step-by-step documentation and SQL migration script to connect your Supabase database with AI Nexus.'
    });

    setConnected(isSupabaseConfigured());
  }, []);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <Breadcrumbs items={[{ name: 'Supabase Setup' }]} />

      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-3">
            <Database className="w-3.5 h-3.5" />
            <span>Database Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Supabase Cloud Database Setup
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            AI Nexus includes zero-configuration local dataset fallback so it works instantly in any environment. If you want full cloud persistence where you can add/edit tools and blog posts in real-time from the Supabase dashboard, follow the quick steps below.
          </p>
        </div>

        {/* Current status banner */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            connected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {connected ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {connected
                  ? 'Connected to Live Supabase Project!'
                  : 'Currently Operating on High-Speed Local Dataset Fallback'}
              </div>
              <p className="text-xs mt-0.5 opacity-80">
                {connected
                  ? 'All tools, reviews, categories, and submissions sync directly with your PostgreSQL database.'
                  : 'All features (search, filtering, reviews, bookmarks, submissions) are fully working via client-side storage.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Simple Setup Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Create Supabase Project</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign up for free at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">supabase.com</a> and create a new project.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Run the SQL Schema</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Navigate to the <strong>SQL Editor</strong> in Supabase, paste the SQL schema below, and click <strong>Run</strong>.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Set Environment Variables</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add <code className="text-indigo-600 font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="text-indigo-600 font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code> to your environment.
            </p>
          </div>
        </div>

        {/* Copyable SQL Schema */}
        <div className="rounded-3xl bg-slate-900 text-slate-100 overflow-hidden shadow-lg border border-slate-800">
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Full Supabase Database SQL Migration</span>
            </div>

            <button
              type="button"
              onClick={handleCopySQL}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 text-xs font-mono overflow-x-auto max-h-96 text-slate-300 leading-relaxed">
            {SUPABASE_SCHEMA_SQL}
          </pre>
        </div>
      </div>
    </div>
  );
};
