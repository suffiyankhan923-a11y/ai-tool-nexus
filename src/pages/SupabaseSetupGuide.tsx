import React, { useState, useEffect } from 'react';
import {
  Database,
  Check,
  Copy,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Cloud,
  Download,
  ExternalLink,
  RefreshCw,
  Zap,
  Key,
  Globe,
  Settings2,
  Code,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode2,
  Trash2
} from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import {
  getActiveSupabaseCredentials,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  SUPABASE_SCHEMA_SQL,
  generateSeedDataSQL,
  getFullSupabaseMigrationSQL
} from '../lib/supabase';
import { DEFAULT_SUPABASE_CONFIG, CLOUDFLARE_DEPLOYMENT_INFO } from '../config/supabase';
import { updateSEO } from '../lib/seo';

export const SupabaseSetupGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connect' | 'cloudflare' | 'sql'>('connect');
  const [sqlTab, setSqlTab] = useState<'full' | 'schema' | 'seed'>('full');

  // Form state
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    hasTables?: boolean;
    toolCount?: number;
  } | null>(null);

  // Connection source state
  const [activeCreds, setActiveCreds] = useState(getActiveSupabaseCredentials());
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    updateSEO({
      title: 'Connect Supabase & Cloudflare Deployment Hub — AI Nexus',
      description: 'Zero-configuration database setup, Cloudflare Pages live deployment, and SQL schema synchronization for AI Nexus.'
    });

    const creds = getActiveSupabaseCredentials();
    setActiveCreds(creds);
    setInputUrl(creds.url);
    setInputKey(creds.anonKey);

    const handleConfigChange = () => {
      setActiveCreds(getActiveSupabaseCredentials());
    };
    window.addEventListener('supabase-config-changed', handleConfigChange);
    return () => window.removeEventListener('supabase-config-changed', handleConfigChange);
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTestAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter both your Supabase Project URL and Public Anon Key.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection(inputUrl, inputKey);
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      saveSupabaseCredentials(inputUrl, inputKey);
      setActiveCreds(getActiveSupabaseCredentials());
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setInputUrl('');
    setInputKey('');
    setTestResult(null);
    setActiveCreds(getActiveSupabaseCredentials());
  };

  const handleDownloadEnv = () => {
    const url = inputUrl.trim() || activeCreds.url || 'https://your-project-ref.supabase.co';
    const key = inputKey.trim() || activeCreds.anonKey || 'your-supabase-anon-key';

    const envContent = `# AI Nexus Supabase Environment Configuration
# Automatically loaded in local development & Cloudflare Pages builds

VITE_SUPABASE_URL=${url}
VITE_SUPABASE_ANON_KEY=${key}
`;

    const blob = new Blob([envContent], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = '.env';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const getSQLToDisplay = () => {
    if (sqlTab === 'schema') return SUPABASE_SCHEMA_SQL;
    if (sqlTab === 'seed') return generateSeedDataSQL();
    return getFullSupabaseMigrationSQL();
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 text-slate-100">
      <Breadcrumbs items={[{ name: 'Supabase & Cloudflare Connection' }]} />

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Database className="w-3.5 h-3.5" />
          <span>Cloud Database & Deployment Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
          Supabase & Cloudflare Live Connection
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Connect your live Supabase project to power dynamic tools, user reviews, bookmark sync, and contact forms. Download ready-to-deploy files for <strong className="text-white">Cloudflare Pages</strong> with zero reconnections required.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div
        className={`p-6 rounded-3xl border mb-8 backdrop-blur-xl shadow-2xl transition-all ${
          isConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                isConnected
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}
            >
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="font-bold text-base text-white flex items-center gap-2">
                {isConnected
                  ? 'Supabase Cloud Database Connected'
                  : 'Operating on Local High-Speed Fallback Engine'}
                <span
                  className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold ${
                    isConnected
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {activeCreds.source === 'env'
                    ? 'via .env'
                    : activeCreds.source === 'storage'
                    ? 'via browser storage'
                    : activeCreds.source === 'hardcoded'
                    ? 'via config fallback'
                    : 'Local Mock'}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-300/80 leading-relaxed max-w-2xl">
                {isConnected
                  ? `Active Endpoint: ${activeCreds.url} — Real-time live syncing is active for tools, categories, reviews, and newsletter subscriptions.`
                  : 'Zero-configuration mode: All search, filtering, and reviews work instantly client-side. Connect your Supabase project below for persistent multi-device cloud storage.'}
              </p>
            </div>
          </div>

          {isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('connect')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'connect'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>1. Connect Supabase Project</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cloudflare')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'cloudflare'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>2. Cloudflare Zero-Config Deployment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'sql'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>3. Database SQL & 20+ AI Tools Seed</span>
        </button>
      </div>

      {/* Tab 1: Connect Supabase */}
      {activeTab === 'connect' && (
        <div className="space-y-8 animate-fade-in">
          {/* Connector Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Enter Supabase Credentials
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Find your Project URL and Anon/Public Key in your Supabase Dashboard under <strong className="text-slate-200">Project Settings → API</strong>.
              </p>
            </div>

            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    Supabase Project URL
                  </span>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://your-project-id.supabase.co"
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden font-mono text-xs shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  Supabase Project Anon / Public API Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden font-mono text-xs shadow-inner"
                />
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-medium ${
                    testResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.success && testResult.hasTables === false && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                      <span>Ready to initialize tables?</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('sql')}
                        className="text-xs font-bold text-white underline hover:text-emerald-300 cursor-pointer"
                      >
                        Copy SQL Migration →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isTesting}
                  className="flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing & Verifying Connection...' : 'Save & Connect to Live Website'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadEnv}
                  className="py-3 px-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2"
                  title="Download .env file with your credentials pre-filled"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download .env File</span>
                </button>
              </div>
            </form>
          </div>

          {/* Setup Walkthrough Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-white text-sm">Create Free Project</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create a database on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">supabase.com</a>. Free tier includes 500MB storage and unlimited API calls.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-white text-sm">Run Schema & 20+ Tools</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open Supabase <strong>SQL Editor</strong>, paste our complete migration script from tab 3, and press <strong>Run</strong>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-white text-sm">Deploy to Cloudflare</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy directly via Cloudflare Pages with zero server infrastructure. Fully reactive client with instant SPA routing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cloudflare Zero-Config Deployment */}
      {activeTab === 'cloudflare' && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Cloudflare Guide Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  Cloudflare Pages Zero-Config Deployment
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  How your downloaded website connects to Supabase automatically when deployed live on Cloudflare
                </p>
              </div>
            </div>

            {/* Option A & Option B */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option A: Hardcoded Pre-Connection */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Method A: Hardcoded Embed (Zero Setup)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To have your downloaded files <strong>already connected</strong> so you don't even have to add environment variables in Cloudflare, paste your credentials into <code className="text-slate-200 font-mono">/src/config/supabase.ts</code>:
                </p>

                <div className="relative rounded-xl bg-black/60 border border-white/10 p-3 text-[11px] font-mono text-slate-300">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `export const DEFAULT_SUPABASE_CONFIG = {\n  url: '${inputUrl || 'YOUR_SUPABASE_URL'}',\n  anonKey: '${inputKey || 'YOUR_SUPABASE_ANON_KEY'}',\n};`,
                        'embed'
                      )
                    }
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'embed' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="overflow-x-auto pr-14 leading-relaxed text-blue-300">
{`// src/config/supabase.ts
export const DEFAULT_SUPABASE_CONFIG = {
  url: '${inputUrl || 'YOUR_SUPABASE_URL'}',
  anonKey: '${inputKey || 'YOUR_SUPABASE_ANON_KEY'}',
};`}
                  </pre>
                </div>
              </div>

              {/* Option B: Cloudflare Environment Variables */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                    Method B: Cloudflare Env Variables
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Production Standard
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In Cloudflare Pages Dashboard, navigate to <strong>Settings → Environment variables</strong> and add:
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">VITE_SUPABASE_URL</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('VITE_SUPABASE_URL', 'env-url')}
                      className="text-blue-400 hover:text-white text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedType === 'env-url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Name</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">VITE_SUPABASE_ANON_KEY</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('VITE_SUPABASE_ANON_KEY', 'env-key')}
                      className="text-blue-400 hover:text-white text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedType === 'env-key' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Name</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Cloudflare Pages Build Settings */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-400" />
                <span>Cloudflare Pages Build Configuration</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-slate-400 mb-1">Framework Preset</div>
                  <div className="text-white font-bold text-sm">Vite</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-slate-400 mb-1">Build Command</div>
                  <div className="text-cyan-400 font-bold text-sm">npm run build</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-slate-400 mb-1">Build Output Directory</div>
                  <div className="text-emerald-400 font-bold text-sm">dist</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cloudflare SPA Redirects Included:</strong> AI Nexus comes pre-packaged with <code className="text-white font-mono">public/_redirects</code> (<code className="text-cyan-300 font-mono">/* /index.html 200</code>) so all dynamic direct routes like <code className="text-white font-mono">/tools/chatgpt</code> and <code className="text-white font-mono">/category/ai-writing</code> work seamlessly when refreshed!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SQL Migration & 20+ AI Tools Seeding */}
      {activeTab === 'sql' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-[#0c0d14]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-display">
                  Supabase SQL Database Migration
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute this SQL in your Supabase SQL Editor to initialize all 7 tables and seed 20+ top AI tools.
                </p>
              </div>

              {/* SQL sub-tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSqlTab('full')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                    sqlTab === 'full'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Full (Schema + Seed)
                </button>
                <button
                  type="button"
                  onClick={() => setSqlTab('schema')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                    sqlTab === 'schema'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Schema Only
                </button>
                <button
                  type="button"
                  onClick={() => setSqlTab('seed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                    sqlTab === 'seed'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Seed Data Only
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="rounded-2xl bg-black/80 border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {sqlTab === 'full'
                      ? 'supabase_full_migration.sql (Tables + 20+ AI Tools)'
                      : sqlTab === 'schema'
                      ? 'supabase_schema.sql (Tables & RLS)'
                      : 'supabase_seed_data.sql (Sample Catalog)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(getSQLToDisplay(), 'sql')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {copiedType === 'sql' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[460px] text-slate-300 leading-relaxed">
                {getSQLToDisplay()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
