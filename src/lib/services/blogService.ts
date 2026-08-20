import { supabase, isSupabaseConfigured } from '../supabase';
import { SAMPLE_BLOG_POSTS, SAMPLE_BLOG_CATEGORIES } from '../../data/sampleData';
import { BlogPost, BlogCategory } from '../../types';

/**
 * Fetches published blog articles with optional category filter and search.
 */
export async function fetchBlogPosts(params?: { category?: string; search?: string; limit?: number }): Promise<{ data: BlogPost[]; error: Error | null }> {
  try {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (params?.category && params.category !== 'all') {
        query = query.or(`category.ilike.%${params.category}%,category_slug.eq.${params.category}`);
      }

      if (params?.search && params.search.trim()) {
        const term = `%${params.search.trim()}%`;
        query = query.or(`title.ilike.${term},excerpt.ilike.${term}`);
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return { data: data as BlogPost[], error: null };
      }
    }

    let localPosts = SAMPLE_BLOG_POSTS.filter(p => p.published);

    if (params?.category && params.category !== 'all') {
      const catLower = params.category.toLowerCase();
      localPosts = localPosts.filter(
        p =>
          p.category.toLowerCase().includes(catLower) ||
          (p.category_slug && p.category_slug.toLowerCase() === catLower)
      );
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      localPosts = localPosts.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (params?.limit) {
      localPosts = localPosts.slice(0, params.limit);
    }

    return { data: localPosts, error: null };
  } catch (err) {
    console.warn('Error fetching blog posts:', err);
    return { data: SAMPLE_BLOG_POSTS, error: null };
  }
}

/**
 * Fetches a single blog post by its URL slug.
 */
export async function fetchBlogPostBySlug(slug: string): Promise<{ data: BlogPost | null; error: Error | null }> {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return { data: data as BlogPost, error: null };
      }
    }

    const localPost = SAMPLE_BLOG_POSTS.find(p => p.slug.toLowerCase() === slug.toLowerCase());
    return { data: localPost || null, error: localPost ? null : new Error('Article not found') };
  } catch (err) {
    console.warn('Error fetching blog post by slug:', err);
    const localPost = SAMPLE_BLOG_POSTS.find(p => p.slug.toLowerCase() === slug.toLowerCase());
    return { data: localPost || null, error: null };
  }
}

/**
 * Fetches featured blog posts.
 */
export async function fetchFeaturedBlogPosts(limit = 2): Promise<BlogPost[]> {
  const res = await fetchBlogPosts();
  return res.data.filter(p => p.featured).slice(0, limit);
}

/**
 * Fetches related blog posts for a post.
 */
export async function fetchRelatedBlogPosts(currentSlug: string, category: string, limit = 3): Promise<BlogPost[]> {
  const res = await fetchBlogPosts({ category });
  return res.data.filter(p => p.slug !== currentSlug).slice(0, limit);
}

/**
 * Fetches blog category taxonomy.
 */
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as BlogCategory[];
      }
    }
    return SAMPLE_BLOG_CATEGORIES;
  } catch {
    return SAMPLE_BLOG_CATEGORIES;
  }
}
