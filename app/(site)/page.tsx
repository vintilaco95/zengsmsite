import { JsonLdScripts } from "@/components/JsonLdScripts";
import { HomeBlogCarouselPortal } from "@/components/HomeBlogCarouselPortal";
import { LegacyMain } from "@/components/LegacyMain";
import { loadTechblogManifest, techblogArticleHref } from "@/lib/techblog-data";
import { extractJsonLdBlocks } from "@/lib/legacy-html";

function plainSnippet(html: string) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function HomePage() {
  const jsonLd = extractJsonLdBlocks("index.html");
  const manifest = loadTechblogManifest();
  const carouselItems = manifest.articles.slice(0, 12).map((a) => ({
    title: a.title,
    href: techblogArticleHref(a.slug),
    excerpt: plainSnippet(a.excerpt).slice(0, 280),
    coverImage: a.coverImage || "/images/IMG_7712.PNG",
  }));

  return (
    <>
      <JsonLdScripts blocks={jsonLd} />
      <LegacyMain legacyFile="index.html" />
      <HomeBlogCarouselPortal items={carouselItems} />
    </>
  );
}
