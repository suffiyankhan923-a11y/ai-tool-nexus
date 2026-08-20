import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DEFAULT_SUPABASE_CONFIG } from '../config/supabase';
import { SAMPLE_CATEGORIES, SAMPLE_TOOLS, SAMPLE_BLOG_POSTS, SAMPLE_BLOG_CATEGORIES } from '../data/sampleData';

const LOCAL_STORAGE_URL_KEY = 'ai_nexus_supabase_url';
const LOCAL_STORAGE_KEY_KEY = 'ai_nexus_supabase_anon_key';

/**
 * Resolves Supabase credentials using prioritized fallback order:
 * 1. Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 * 2. Browser LocalStorage (set via UI in /supabase-setup)
 * 3. Default hardcoded config in /src/config/supabase.ts (for offline/instant deployment)
 */
export function getActiveSupabaseCredentials(): { url: string; anonKey: string; source: 'env' | 'storage' | 'hardcoded' | 'none' } {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  
  const envUrl = metaEnv.VITE_SUPABASE_URL?.trim();
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY?.trim();

  if (envUrl && envKey && !envUrl.includes('placeholder') && envUrl.startsWith('http')) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  // Check LocalStorage
  try {
    const storedUrl = localStorage.getItem(LOCAL_STORAGE_URL_KEY)?.trim();
    const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY_KEY)?.trim();

    if (storedUrl && storedKey && storedUrl.startsWith('http')) {
      return { url: storedUrl, anonKey: storedKey, source: 'storage' };
    }
  } catch {
    // Ignore storage access errors
  }

  // Check hardcoded config in /src/config/supabase.ts
  const hardcodedUrl = DEFAULT_SUPABASE_CONFIG.url?.trim();
  const hardcodedKey = DEFAULT_SUPABASE_CONFIG.anonKey?.trim();

  if (hardcodedUrl && hardcodedKey && !hardcodedUrl.includes('placeholder') && hardcodedUrl.startsWith('http')) {
    return { url: hardcodedUrl, anonKey: hardcodedKey, source: 'hardcoded' };
  }

  return { url: '', anonKey: '', source: 'none' };
}

export const isSupabaseConfigured = (): boolean => {
  const creds = getActiveSupabaseCredentials();
  return Boolean(
    creds.url &&
    creds.anonKey &&
    creds.url.trim() !== '' &&
    creds.anonKey.trim() !== '' &&
    !creds.url.includes('placeholder') &&
    creds.url.startsWith('http')
  );
};

let currentClient: SupabaseClient | null = null;

function initClient(): SupabaseClient | null {
  const creds = getActiveSupabaseCredentials();
  if (creds.url && creds.anonKey && creds.url.startsWith('http')) {
    try {
      return createClient(creds.url, creds.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (error) {
      console.warn('Failed to initialize Supabase client:', error);
      return null;
    }
  }
  return null;
}

currentClient = initClient();

export function getSupabase(): SupabaseClient | null {
  if (!currentClient && isSupabaseConfigured()) {
    currentClient = initClient();
  }
  return currentClient;
}

// Proxy export so `supabase.from(...)` always calls the latest active client dynamically
export const supabase = new Proxy({} as unknown as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return undefined;
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

/**
 * Dynamically save new Supabase credentials and re-initialize the client.
 */
export function saveSupabaseCredentials(url: string, anonKey: string): boolean {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('http')) {
      throw new Error('Supabase URL must start with https:// or http://');
    }

    localStorage.setItem(LOCAL_STORAGE_URL_KEY, cleanUrl);
    localStorage.setItem(LOCAL_STORAGE_KEY_KEY, cleanKey);

    currentClient = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    window.dispatchEvent(new CustomEvent('supabase-config-changed', {
      detail: { url: cleanUrl, configured: true }
    }));

    return true;
  } catch (err) {
    console.error('Failed to save Supabase credentials:', err);
    return false;
  }
}

/**
 * Clear stored Supabase credentials.
 */
export function clearSupabaseCredentials(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY_KEY);
    currentClient = initClient();
    window.dispatchEvent(new CustomEvent('supabase-config-changed', {
      detail: { configured: isSupabaseConfigured() }
    }));
  } catch (err) {
    console.error('Failed to clear Supabase credentials:', err);
  }
}

/**
 * Live connection tester
 */
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{
  success: boolean;
  message: string;
  hasTables?: boolean;
  toolCount?: number;
}> {
  try {
    let clientToTest = currentClient;

    if (customUrl && customKey) {
      const cleanUrl = customUrl.trim();
      const cleanKey = customKey.trim();
      if (!cleanUrl.startsWith('http')) {
        return { success: false, message: 'Invalid URL format. URL must start with https://' };
      }
      clientToTest = createClient(cleanUrl, cleanKey);
    }

    if (!clientToTest) {
      return { success: false, message: 'Supabase credentials are missing or invalid.' };
    }

    // Attempt to read from the tools table
    const { data, error, count } = await clientToTest
      .from('tools')
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.tools" does not exist')) {
        return {
          success: true,
          hasTables: false,
          message: 'Connected to Supabase project, but database tables are not created yet. Run the SQL schema script below to initialize them!'
        };
      }
      if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        return {
          success: false,
          message: 'Authentication failed. Please verify your Supabase anon/public key.'
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message}`
      };
    }

    const { count: totalTools } = await clientToTest
      .from('tools')
      .select('*', { count: 'exact', head: true });

    return {
      success: true,
      hasTables: true,
      toolCount: totalTools || (data ? data.length : 0),
      message: `Successfully connected to Supabase! Found ${totalTools ?? (data ? data.length : 0)} tools in live database.`
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'Network error connecting to Supabase host.'
    };
  }
}

/**
 * 1. Base SQL Schema Script
 */
export const SUPABASE_SCHEMA_SQL = `-- ========================================================
-- AI NEXUS — COMPLETE SUPABASE DATABASE SCHEMA
-- Execute this script in Supabase SQL Editor (supabase.com -> SQL Editor -> New Query)
-- ========================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image_url TEXT,
  tool_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tools Table
CREATE TABLE IF NOT EXISTS public.tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  category_slug TEXT,
  pricing TEXT NOT NULL CHECK (pricing IN ('Free', 'Freemium', 'Paid', 'Free Trial')),
  website_url TEXT NOT NULL,
  logo_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3, 1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  pricing_tier_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blog Categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_avatar TEXT,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  read_time TEXT DEFAULT '5 min read',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tool Reviews
CREATE TABLE IF NOT EXISTS public.tool_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_slug TEXT NOT NULL REFERENCES public.tools(slug) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Public tools are viewable by everyone" ON public.tools;
DROP POLICY IF EXISTS "Public blog categories are viewable by everyone" ON public.blog_categories;
DROP POLICY IF EXISTS "Public blogs are viewable by everyone" ON public.blogs;
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON public.tool_reviews;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can send a contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.tool_reviews;
DROP POLICY IF EXISTS "Anyone can submit a tool" ON public.tools;

-- Public Read Policies
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public tools are viewable by everyone" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Public blog categories are viewable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Public blogs are viewable by everyone" ON public.blogs FOR SELECT USING (published = true);
CREATE POLICY "Public reviews are viewable by everyone" ON public.tool_reviews FOR SELECT USING (true);

-- Public Insert Policies for Forms
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit a review" ON public.tool_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit a tool" ON public.tools FOR INSERT WITH CHECK (true);
`;

/**
 * Helper to escape SQL string values
 */
function sqlStr(str: string | undefined | null): string {
  if (str === undefined || str === null) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

/**
 * Helper to format Postgres array literal
 */
function sqlArray(arr: string[] | undefined | null): string {
  if (!arr || arr.length === 0) return "'{}'";
  const escaped = arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',');
  return `'{${escaped}}'`;
}

/**
 * Generates ready-to-run Seed SQL for all categories, tools, and blog posts!
 */
export function generateSeedDataSQL(): string {
  const catQueries = SAMPLE_CATEGORIES.map(c => 
    `INSERT INTO public.categories (id, name, slug, description, icon, image_url, tool_count)
VALUES (${sqlStr(c.id)}, ${sqlStr(c.name)}, ${sqlStr(c.slug)}, ${sqlStr(c.description)}, ${sqlStr(c.icon)}, ${sqlStr(c.image_url)}, ${c.tool_count})
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, tool_count = EXCLUDED.tool_count;`
  ).join('\n');

  const toolQueries = SAMPLE_TOOLS.map(t =>
    `INSERT INTO public.tools (id, name, slug, description, long_description, category, category_slug, pricing, website_url, logo_url, image_url, featured, trending, verified, rating, review_count, tags, features, pros, cons, pricing_tier_details)
VALUES (${sqlStr(t.id)}, ${sqlStr(t.name)}, ${sqlStr(t.slug)}, ${sqlStr(t.description)}, ${sqlStr(t.long_description)}, ${sqlStr(t.category)}, ${sqlStr(t.category_slug)}, ${sqlStr(t.pricing)}, ${sqlStr(t.website_url)}, ${sqlStr(t.logo_url)}, ${sqlStr(t.image_url)}, ${t.featured ? 'TRUE' : 'FALSE'}, ${t.trending ? 'TRUE' : 'FALSE'}, ${t.verified ? 'TRUE' : 'FALSE'}, ${t.rating}, ${t.review_count}, ${sqlArray(t.tags)}, ${sqlArray(t.features)}, ${sqlArray(t.pros)}, ${sqlArray(t.cons)}, ${sqlStr(t.pricing_tier_details)})
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count;`
  ).join('\n');

  const blogCatQueries = SAMPLE_BLOG_CATEGORIES.map(bc =>
    `INSERT INTO public.blog_categories (id, name, slug, description)
VALUES (${sqlStr(bc.id)}, ${sqlStr(bc.name)}, ${sqlStr(bc.slug)}, ${sqlStr(bc.description)})
ON CONFLICT (id) DO NOTHING;`
  ).join('\n');

  const blogQueries = SAMPLE_BLOG_POSTS.map(b =>
    `INSERT INTO public.blogs (id, slug, title, excerpt, content, category, category_slug, author_name, author_role, author_avatar, featured_image, tags, published, featured, read_time, seo_title, seo_description)
VALUES (${sqlStr(b.id)}, ${sqlStr(b.slug)}, ${sqlStr(b.title)}, ${sqlStr(b.excerpt)}, ${sqlStr(b.content)}, ${sqlStr(b.category)}, ${sqlStr(b.category_slug)}, ${sqlStr(b.author_name)}, ${sqlStr(b.author_role)}, ${sqlStr(b.author_avatar)}, ${sqlStr(b.featured_image)}, ${sqlArray(b.tags)}, ${b.published ? 'TRUE' : 'FALSE'}, ${b.featured ? 'TRUE' : 'FALSE'}, ${sqlStr(b.read_time)}, ${sqlStr(b.seo_title)}, ${sqlStr(b.seo_description)})
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;`
  ).join('\n');

  return `-- ========================================================
-- AI NEXUS — SEED DATA INITIALIZATION
-- ========================================================

-- Categories Seed Data
${catQueries}

-- Blog Categories Seed Data
${blogCatQueries}

-- Tools Catalog Seed Data (20+ Top AI Tools)
${toolQueries}

-- Blog Posts Seed Data
${blogQueries}
`;
}

/**
 * Full combined schema + seed SQL migration script
 */
export function getFullSupabaseMigrationSQL(): string {
  return `${SUPABASE_SCHEMA_SQL}

${generateSeedDataSQL()}
`;
}
