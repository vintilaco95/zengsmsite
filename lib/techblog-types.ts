/** Rezumat din GET /api/embed/blogger/:slug */
export type TechblogArticleSummary = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string | null;
  category: { name: string; slug: string } | null;
};

/** Articol complet din GET /api/embed/article/:slug */
export type TechblogArticleRecord = {
  title: string;
  slug: string;
  seoTitle: string;
  excerpt: string;
  metaDescription: string;
  contentHtml: string;
  coverImage: string;
  publishedAt: string | null;
  updatedAt: string | null;
  category: { name: string; slug: string } | null;
  author: { name: string; slug: string };
};

export type TechblogManifest = {
  fetchedAt: string | null;
  apiBase: string;
  bloggerSlug: string;
  blogger: {
    name: string;
    slug: string;
    avatar: string;
    bio: string;
  } | null;
  articles: TechblogArticleSummary[];
};
