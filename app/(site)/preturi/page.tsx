import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Prețuri Reparații Telefoane | ZEN GSM Timișoara",
  description:
    "Listă de prețuri orientative pentru reparații telefoane și tablete la ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/preturi` },
};

export default function PreturiPage() {
  return (
    <>
      <LegacyMain legacyFile="preturi.html" />
      <PageScripts extra={["/scripts/simple-price-calculator.js"]} />
    </>
  );
}
