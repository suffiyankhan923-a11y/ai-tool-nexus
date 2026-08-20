export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  category: string;
  category_slug?: string;
  pricing: PricingType;
  website_url: string;
  logo_url?: string;
  image_url?: string;
  featured: boolean;
  trending: boolean;
  verified: boolean;
  rating: number;
  review_count: number;
  tags: string[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  pricing_tier_details?: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url?: string;
  tool_count?: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  category_slug?: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  featured_image: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  read_time: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  created_at?: string;
}

export interface ToolReview {
  id: string;
  tool_slug: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type SortOption = 'popular' | 'rating' | 'newest' | 'alphabetical';

export interface FilterState {
  search: string;
  category: string;
  pricing: string;
  sort: SortOption;
  featuredOnly: boolean;
  trendingOnly: boolean;
  verifiedOnly: boolean;
}
