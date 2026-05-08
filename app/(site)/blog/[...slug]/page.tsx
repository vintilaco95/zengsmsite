import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScripts } from "@/components/JsonLdScripts";
import { PageScripts } from "@/components/PageScripts";
import { rewriteArticleHtmlInner } from "@/lib/html-rewrite";
import {
  loadTechblogArticle,
  loadTechblogManifest,
  techblogArticleHref,
} from "@/lib/techblog-data";
import { getSiteUrl } from "@/lib/site-url";

export const dynamicParams = false;

const siteUrl = getSiteUrl();

export function generateStaticParams(): { slug: string[] }[] {
  const m = loadTechblogManifest();
  return m.articles.map((a) => ({
    slug: String(a.slug).split("/").filter(Boolean),
  }));
}

type Props = { params: Promise<{ slug: string[] }> };

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: segs } = await params;
  const articleSlug = segs.join("/");
  const a = loadTechblogArticle(articleSlug);
  if (!a) {
    return { title: "Articol | Blog ZEN GSM" };
  }
  const title = `${a.seoTitle || a.title} | Blog ZEN GSM`;
  const canonicalPath = techblogArticleHref(a.slug);
  return {
    title,
    description: a.metaDescription || a.excerpt || undefined,
    alternates: { canonical: `${siteUrl.replace(/\/+$/, "")}${canonicalPath}` },
    openGraph: {
      type: "article",
      title: a.seoTitle || a.title,
      description: a.metaDescription || a.excerpt || undefined,
      url: `${siteUrl.replace(/\/+$/, "")}${canonicalPath}`,
      images: a.coverImage ? [a.coverImage] : undefined,
    },
  };
}

export default async function TechblogArticlePage({ params }: Props) {
  const { slug: segs } = await params;
  const articleSlug = segs.join("/");
  const a = loadTechblogArticle(articleSlug);
  if (!a) notFound();

  const canonicalUrl = `${siteUrl.replace(/\/+$/, "")}${techblogArticleHref(a.slug)}`;
  const html = rewriteArticleHtmlInner(a.contentHtml || "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.metaDescription || a.excerpt || "",
    datePublished: a.publishedAt || undefined,
    dateModified: a.updatedAt || a.publishedAt || undefined,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "ZEN GSM",
      url: `${siteUrl}/`,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/IMG_7712.PNG` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    ...(a.author?.name
      ? { author: { "@type": "Person", name: a.author.name } }
      : {}),
    ...(a.coverImage ? { image: [a.coverImage] } : {}),
  };

  const metaParts: string[] = [];
  if (a.author?.name) metaParts.push(`✍️ ${a.author.name}`);
  if (a.category?.name) metaParts.push(`📁 ${a.category.name}`);
  const ds = formatDate(a.publishedAt);
  if (ds) metaParts.push(`📅 ${ds}`);

  return (
    <>
      <JsonLdScripts blocks={[JSON.stringify(jsonLd)]} />
      <section className="blog-article-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <Link href="/blog/" className="blog-back-link">
            ← Înapoi la blog
          </Link>

          {a.coverImage ? (
            <div className="techblog-article-cover-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- URL absolut de pe TechBlog la build */}
              <img
                src={a.coverImage}
                alt={a.title || ""}
                className="techblog-article-cover-img"
                width={1200}
                height={630}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          ) : null}

          <article
            className="blog-article"
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            <header className="blog-article-header">
              {metaParts.length > 0 ? (
                <p className="blog-article-meta">{metaParts.join(" · ")}</p>
              ) : null}
              <h1 className="blog-article-title" itemProp="headline">
                {a.title}
              </h1>
              {a.excerpt ? (
                <p className="blog-article-excerpt" itemProp="description">
                  {a.excerpt}
                </p>
              ) : null}
            </header>
            <div
              className="blog-article-content techblog-article-prose"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </div>
      </section>
      <PageScripts />
    </>
  );
}
