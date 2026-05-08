import { rewriteArticleHtmlInner } from "./html-rewrite";

const API_BASE = (
  process.env.TECHBLOG_API_BASE || "https://www.e-gsm.ro"
).replace(/\/+$/, "");
const BLOGGER_SLUG = process.env.TECHBLOG_BLOGGER_SLUG || "andreea";

type EmbedArticleOk = {
  ok: true;
  article: {
    title: string;
    slug: string;
    seoTitle?: string;
    excerpt?: string;
    metaDescription?: string;
    contentHtml: string;
    coverImage?: string;
    publishedAt?: string;
    updatedAt?: string;
    author?: { name?: string };
    category?: { name?: string; slug?: string };
  };
};

type EmbedArticleErr = { ok: false; error?: string };

export async function fetchEmbedArticle(slug: string): Promise<EmbedArticleOk["article"] | null> {
  const url = `${API_BASE}/api/embed/article/${encodeURIComponent(slug)}?bloggerSlug=${encodeURIComponent(BLOGGER_SLUG)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const body = (await res.json()) as EmbedArticleOk | EmbedArticleErr;
  if (!res.ok || !body.ok || !("article" in body)) return null;
  return body.article;
}

export async function fetchAllTechblogSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let pages = 1;
  while (page <= pages) {
    const url = `${API_BASE}/api/embed/blogger/${encodeURIComponent(BLOGGER_SLUG)}?page=${page}&limit=50`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const data = (await res.json()) as {
      ok?: boolean;
      pages?: number;
      articles?: { slug: string }[];
    };
    if (!res.ok || !data.ok) break;
    pages = Math.max(1, data.pages || 1);
    for (const a of data.articles || []) {
      if (a.slug) slugs.push(a.slug);
    }
    page += 1;
  }
  return slugs;
}

export function sanitizeArticleHtml(html: string): string {
  return rewriteArticleHtmlInner(html || "");
}

export { BLOGGER_SLUG, API_BASE };
