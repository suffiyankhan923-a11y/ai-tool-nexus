import { supabase, isSupabaseConfigured } from '../supabase';
import { SAMPLE_TOOLS } from '../../data/sampleData';
import { Tool, FilterState, ToolReview } from '../../types';

// In-memory reviews fallback store for offline/local mode
const localReviewsStore: Record<string, ToolReview[]> = {
  chatgpt: [
    {
      id: 'rev-1',
      tool_slug: 'chatgpt',
      author_name: 'Alex Rivera',
      rating: 5,
      comment: 'Essential tool for daily brainstorming and drafting. GPT-4o voice is unbelievable.',
      created_at: '2026-02-01T10:00:00Z'
    },
    {
      id: 'rev-2',
      tool_slug: 'chatgpt',
      author_name: 'Samantha Wu',
      rating: 5,
      comment: 'Code interpreter saves me hours of python data cleansing every week.',
      created_at: '2026-02-10T14:30:00Z'
    }
  ],
  cursor: [
    {
      id: 'rev-3',
      tool_slug: 'cursor',
      author_name: 'Devin Thorne',
      rating: 5,
      comment: 'Composer completely transformed how our team ships full-stack PRs. Cannot go back to standard VS Code.',
      created_at: '2026-02-12T09:15:00Z'
    }
  ]
};

/**
 * Fetches all tools with optional filtering, sorting, and search.
 */
export async function fetchTools(filters?: Partial<FilterState>): Promise<{ data: Tool[]; error: Error | null }> {
  try {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('tools').select('*');

      if (filters?.category && filters.category !== 'all') {
        query = query.or(`category.ilike.%${filters.category}%,category_slug.eq.${filters.category}`);
      }

      if (filters?.pricing && filters.pricing !== 'all') {
        query = query.eq('pricing', filters.pricing);
      }

      if (filters?.featuredOnly) {
        query = query.eq('featured', true);
      }

      if (filters?.trendingOnly) {
        query = query.eq('trending', true);
      }

      if (filters?.verifiedOnly) {
        query = query.eq('verified', true);
      }

      if (filters?.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`);
      }

      // Sorting
      if (filters?.sort === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (filters?.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters?.sort === 'alphabetical') {
        query = query.order('name', { ascending: true });
      } else {
        // default: most popular
        query = query.order('review_count', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase query error, falling back to local dataset:', error.message);
        return { data: filterLocalTools(SAMPLE_TOOLS, filters), error: null };
      }

      if (data && data.length > 0) {
        return { data: data as Tool[], error: null };
      }
    }

    // Fallback to local sample dataset
    return { data: filterLocalTools(SAMPLE_TOOLS, filters), error: null };
  } catch (err) {
    console.warn('Error fetching tools:', err);
    return { data: filterLocalTools(SAMPLE_TOOLS, filters), error: null };
  }
}

/**
 * Filter and sort local tools dataset.
 */
function filterLocalTools(tools: Tool[], filters?: Partial<FilterState>): Tool[] {
  let result = [...tools];

  if (!filters) return result;

  if (filters.category && filters.category !== 'all') {
    const catLower = filters.category.toLowerCase();
    result = result.filter(
      t =>
        t.category.toLowerCase().includes(catLower) ||
        (t.category_slug && t.category_slug.toLowerCase() === catLower)
    );
  }

  if (filters.pricing && filters.pricing !== 'all') {
    result = result.filter(t => t.pricing.toLowerCase() === filters.pricing?.toLowerCase());
  }

  if (filters.featuredOnly) {
    result = result.filter(t => t.featured);
  }

  if (filters.trendingOnly) {
    result = result.filter(t => t.trending);
  }

  if (filters.verifiedOnly) {
    result = result.filter(t => t.verified);
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (filters.sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (filters.sort === 'newest') {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (filters.sort === 'alphabetical') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // popular
    result.sort((a, b) => b.review_count - a.review_count);
  }

  return result;
}

/**
 * Fetches a single tool by its unique slug.
 */
export async function fetchToolBySlug(slug: string): Promise<{ data: Tool | null; error: Error | null }> {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return { data: data as Tool, error: null };
      }
    }

    const localTool = SAMPLE_TOOLS.find(t => t.slug.toLowerCase() === slug.toLowerCase());
    return { data: localTool || null, error: localTool ? null : new Error('Tool not found') };
  } catch (err) {
    console.warn('Error fetching tool by slug:', err);
    const localTool = SAMPLE_TOOLS.find(t => t.slug.toLowerCase() === slug.toLowerCase());
    return { data: localTool || null, error: null };
  }
}

/**
 * Fetches featured tools for home/highlights.
 */
export async function fetchFeaturedTools(limit = 6): Promise<Tool[]> {
  const res = await fetchTools({ featuredOnly: true });
  return res.data.slice(0, limit);
}

/**
 * Fetches trending tools for spotlight cards.
 */
export async function fetchTrendingTools(limit = 6): Promise<Tool[]> {
  const res = await fetchTools({ trendingOnly: true });
  return res.data.slice(0, limit);
}

/**
 * Fetches tools belonging to a category slug.
 */
export async function fetchToolsByCategory(categorySlug: string): Promise<Tool[]> {
  const res = await fetchTools({ category: categorySlug });
  return res.data;
}

/**
 * Searches tools by query text.
 */
export async function searchTools(query: string, limit = 8): Promise<Tool[]> {
  if (!query.trim()) return [];
  const res = await fetchTools({ search: query });
  return res.data.slice(0, limit);
}

/**
 * Fetches related tools based on category, excluding current tool.
 */
export async function fetchRelatedTools(currentSlug: string, category: string, limit = 3): Promise<Tool[]> {
  const res = await fetchTools({ category });
  return res.data.filter(t => t.slug !== currentSlug).slice(0, limit);
}

/**
 * Fetches reviews for a tool.
 */
export async function fetchToolReviews(toolSlug: string): Promise<ToolReview[]> {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('tool_reviews')
        .select('*')
        .eq('tool_slug', toolSlug)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ToolReview[];
      }
    }

    return localReviewsStore[toolSlug] || [];
  } catch {
    return localReviewsStore[toolSlug] || [];
  }
}

/**
 * Submits a new user review for a tool.
 */
export async function submitToolReview(review: Omit<ToolReview, 'id' | 'created_at'>): Promise<{ success: boolean; message: string }> {
  try {
    const newReview: ToolReview = {
      ...review,
      id: 'rev-' + Date.now(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('tool_reviews').insert({
        tool_slug: review.tool_slug,
        author_name: review.author_name,
        rating: review.rating,
        comment: review.comment
      });

      if (!error) {
        return { success: true, message: 'Thank you! Your review has been submitted.' };
      }
    }

    // Local fallback
    if (!localReviewsStore[review.tool_slug]) {
      localReviewsStore[review.tool_slug] = [];
    }
    localReviewsStore[review.tool_slug].unshift(newReview);

    return { success: true, message: 'Review posted successfully!' };
  } catch (err) {
    return { success: false, message: (err as Error).message || 'Failed to submit review.' };
  }
}

/**
 * Local Storage Bookmark Management
 */
const BOOKMARKS_KEY = 'ai_nexus_saved_tools';

export function getSavedToolSlugs(): string[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleSaveTool(slug: string): boolean {
  try {
    const saved = getSavedToolSlugs();
    let updated: string[];
    let isSaved = false;

    if (saved.includes(slug)) {
      updated = saved.filter(s => s !== slug);
      isSaved = false;
    } else {
      updated = [...saved, slug];
      isSaved = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('bookmarks-updated'));
    return isSaved;
  } catch {
    return false;
  }
}

export function isToolSaved(slug: string): boolean {
  return getSavedToolSlugs().includes(slug);
}
