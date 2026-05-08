import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Galerie Lucrări | ZEN GSM Timișoara",
  description:
    "Galerie reparații și lucrări service GSM realizate în atelierul ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/galerie` },
};

export default function GaleriePage() {
  return (
    <>
      <LegacyMain legacyFile="galerie.html" />
      <PageScripts extra={["/scripts/gallery.js"]} />
    </>
  );
}
