import type { Metadata } from "next";
import { JsonLdScripts } from "@/components/JsonLdScripts";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { extractJsonLdBlocks } from "@/lib/legacy-html";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Blog & Sfaturi | ZEN GSM Timișoara",
  description:
    "Sfaturi utile despre îngrijirea telefonului, cum să protejezi bateria, reparații și multe altele.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Blog & Sfaturi | ZEN GSM Timișoara",
    url: `${siteUrl}/blog`,
  },
};

export default function BlogPage() {
  const jsonLd = extractJsonLdBlocks("blog.html");
  return (
    <>
      <JsonLdScripts blocks={jsonLd} />
      <LegacyMain legacyFile="blog.html" />
      <PageScripts extra={["/scripts/techblog-feed.js"]} />
    </>
  );
}
