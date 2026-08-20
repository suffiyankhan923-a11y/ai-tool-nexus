/**
 * Supabase Project Configuration for AI Nexus
 * 
 * You can configure your Supabase connection in 3 ways:
 * 1. Environment variables: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Cloudflare Pages Dashboard.
 * 2. Hardcoded fallback: Paste your Supabase URL & Anon Key directly into DEFAULT_SUPABASE_CONFIG below.
 *    When you download the project files and deploy to Cloudflare, it will automatically connect with zero extra setup!
 * 3. In-App Setup Guide: Use the /supabase-setup page in the browser to enter and test your credentials with 1 click.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  // If you want your downloaded files to be permanently connected out-of-the-box without needing .env setup on Cloudflare:
  // Paste your Supabase Project URL here (e.g. 'https://your-project-ref.supabase.co')
  url: '',
  
  // Paste your Supabase anon/public key here (e.g. 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  anonKey: '',
};

export const CLOUDFLARE_DEPLOYMENT_INFO = {
  framework: 'Vite',
  buildCommand: 'npm run build',
  buildOutputDirectory: 'dist',
  nodeVersion: '18 or 20',
  envVariables: [
    { key: 'VITE_SUPABASE_URL', description: 'Your Supabase Project URL (e.g. https://xyz.supabase.co)' },
    { key: 'VITE_SUPABASE_ANON_KEY', description: 'Your Supabase Anon / Public API Key' }
  ]
};
