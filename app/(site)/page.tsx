import { JsonLdScripts } from "@/components/JsonLdScripts";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { extractJsonLdBlocks } from "@/lib/legacy-html";

export default function HomePage() {
  const jsonLd = extractJsonLdBlocks("index.html");
  return (
    <>
      <JsonLdScripts blocks={jsonLd} />
      <LegacyMain legacyFile="index.html" />
      <PageScripts />
    </>
  );
}
