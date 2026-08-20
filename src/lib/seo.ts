import { Tool, BlogPost } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, unknown>;
}

export function updateSEO({
  title = 'AI Nexus — Discover the AI Tools Shaping the Future',
  description = 'Explore the premier directory of curated AI tools, software reviews, categories, and educational guides for creators, developers, and businesses.',
  canonical = window.location.href,
  image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
  schema
}: SEOProps) {
  // Update Title
  document.title = title.includes('AI Nexus') ? title : `${title} | AI Nexus`;

  // Helper to update or create meta tags
  const setMetaTag = (selector: string, attribute: string, value: string) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      if (selector.startsWith('meta[name=')) {
        const name = selector.match(/name="([^"]+)"/)?.[1];
        if (name) element.setAttribute('name', name);
      } else if (selector.startsWith('meta[property=')) {
        const prop = selector.match(/property="([^"]+)"/)?.[1];
        if (prop) element.setAttribute('property', prop);
      }
      document.head.appendChild(element);
    }
    element.setAttribute(attribute, value);
  };

  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('meta[property="og:title"]', 'content', document.title);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:type"]', 'content', type);
  setMetaTag('meta[property="og:image"]', 'content', image);
  setMetaTag('meta[property="og:url"]', 'content', canonical);
  setMetaTag('meta[name="twitter:title"]', 'content', document.title);
  setMetaTag('meta[name="twitter:description"]', 'content', description);
  setMetaTag('meta[name="twitter:image"]', 'content', image);

  // Canonical Link
  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonical);

  // Structured Data (JSON-LD)
  let scriptSchema = document.getElementById('nexus-schema-jsonld') as HTMLScriptElement;
  if (!scriptSchema) {
    scriptSchema = document.createElement('script');
    scriptSchema.id = 'nexus-schema-jsonld';
    scriptSchema.type = 'application/ld+json';
    document.head.appendChild(scriptSchema);
  }

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Nexus',
    url: 'https://ai-nexus.pages.dev',
    description: 'Premier AI software directory and learning center.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ai-nexus.pages.dev/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  scriptSchema.textContent = JSON.stringify(schema || defaultSchema);
}

/**
 * Generate Tool JSON-LD Schema (SoftwareApplication)
 */
export function generateToolSchema(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All Web Browsers',
    applicationCategory: tool.category,
    description: tool.description,
    offers: {
      '@type': 'Offer',
      price: tool.pricing === 'Free' ? '0' : '9.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: tool.review_count,
      bestRating: '5',
      worstRating: '1'
    }
  };
}

/**
 * Generate Article JSON-LD Schema (Article)
 */
export function generateArticleSchema(article: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: [article.featured_image],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: article.author_name,
      jobTitle: article.author_role
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Nexus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80'
      }
    },
    description: article.excerpt
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url
    }))
  };
}
