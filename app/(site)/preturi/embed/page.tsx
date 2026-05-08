import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { PriceWizardBoot } from "@/components/PriceWizardBoot";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Calculator prețuri reparații | ZEN GSM",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/preturi/embed/` },
};

export default function PreturiEmbedPage() {
  return (
    <>
      <LegacyMain legacyFile="preturi-wizard-embed.html" />
      <PriceWizardBoot />
      <PageScripts extra={["/scripts/simple-price-calculator.js"]} />
    </>
  );
}
