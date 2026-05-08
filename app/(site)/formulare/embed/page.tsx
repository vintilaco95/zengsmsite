import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Formulare service & status | ZEN GSM",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/formulare/embed/` },
};

export default function FormulareEmbedPage() {
  return (
    <>
      <LegacyMain
        legacyFile="formulare-status-embed.html"
        className="zgs-embed-legacy-host"
      />
      <PageScripts jquery extra={["/scripts/forms.js"]} />
    </>
  );
}
