import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScripts } from "@/components/JsonLdScripts";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";
import {
  fetchAllTechblogSlugs,
  fetchEmbedArticle,
  sanitizeArticleHtml,
} from "@/lib/techblog";

const SITE_ORG = {
  "@type": "Organization" as const,
  name: "ZEN GSM",
  url: "https://zengsm.ro/",
  logo: {
    "@type": "ImageObject" as const,
    url: "https://zengsm.ro/images/IMG_7712.PNG",
  },
};

function formatDateRo(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function articlePath(slug: string) {
  return (
    "/blog/" +
    String(slug)
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/")
  );
}

export async function generateStaticParams() {
  const slugs = await fetchAllTechblogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await fetchEmbedArticle(slug);
  if (!a) return { title: "Articol | Blog ZEN GSM" };

  const base = getSiteUrl();
  const canonical = base + articlePath(a.slug);
  const titlePlain = String(a.seoTitle || a.title || "Articol");
  const desc = a.metaDescription || a.excerpt || "";

  return {
    title: `${titlePlain} | Blog ZEN GSM`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: titlePlain,
      description: desc,
      url: canonical,
      images: a.coverImage ? [a.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: titlePlain,
      description: desc,
      images: a.coverImage ? [a.coverImage] : ["/images/IMG_7712.PNG"],
    },
  };
}

export default async function TechblogArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await fetchEmbedArticle(slug);
  if (!a) notFound();

  const base = getSiteUrl();
  const canonicalUrl = base + articlePath(a.slug);
  const html = sanitizeArticleHtml(a.contentHtml || "");

  const metaParts: string[] = [];
  if (a.author?.name) metaParts.push(`✍️ ${a.author.name}`);
  if (a.category?.name) metaParts.push(`📁 ${a.category.name}`);
  const ds = formatDateRo(a.publishedAt);
  if (ds) metaParts.push(`📅 ${ds}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.metaDescription || a.excerpt || "",
    datePublished: a.publishedAt || undefined,
    dateModified: a.updatedAt || a.publishedAt || undefined,
    publisher: SITE_ORG,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
    ...(a.author?.name ? { author: { "@type": "Person", name: a.author.name } } : {}),
    ...(a.coverImage ? { image: [a.coverImage] } : {}),
  };

  return (
    <>
      <JsonLdScripts blocks={[JSON.stringify(jsonLd)]} />
      <section className="blog-article-section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <Link href="/blog" className="blog-back-link" prefetch={false}>
            ← Înapoi la blog
          </Link>

          {a.coverImage ? (
            <div className="techblog-article-cover-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.coverImage}
                alt={a.title || ""}
                className="techblog-article-cover-img"
                width={1200}
                height={630}
                loading="eager"
                decoding="async"
              />
            </div>
          ) : null}

          <article
            className="blog-article"
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            <header className="blog-article-header">
              {metaParts.length ? (
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
