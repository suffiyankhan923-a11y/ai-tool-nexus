import { supabase, isSupabaseConfigured } from '../supabase';
import { SAMPLE_CATEGORIES, SAMPLE_TOOLS } from '../../data/sampleData';
import { Category } from '../../types';

/**
 * Fetches all categories, calculating real-time tool counts.
 */
export async function fetchCategories(): Promise<{ data: Category[]; error: Error | null }> {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return { data: data as Category[], error: null };
      }
    }

    // Return sample categories enriched with tool counts from SAMPLE_TOOLS
    const enriched = SAMPLE_CATEGORIES.map(cat => {
      const count = SAMPLE_TOOLS.filter(
        t =>
          t.category.toLowerCase().includes(cat.name.toLowerCase()) ||
          (t.category_slug && t.category_slug.toLowerCase() === cat.slug.toLowerCase())
      ).length;
      return {
        ...cat,
        tool_count: count > 0 ? count : cat.tool_count || 1
      };
    });

    return { data: enriched, error: null };
  } catch (err) {
    console.warn('Error fetching categories:', err);
    return { data: SAMPLE_CATEGORIES, error: null };
  }
}

/**
 * Fetches a single category by slug.
 */
export async function fetchCategoryBySlug(slug: string): Promise<{ data: Category | null; error: Error | null }> {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return { data: data as Category, error: null };
      }
    }

    const localCat = SAMPLE_CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    return { data: localCat || null, error: localCat ? null : new Error('Category not found') };
  } catch {
    const localCat = SAMPLE_CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    return { data: localCat || null, error: null };
  }
}
