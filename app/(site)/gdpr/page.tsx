import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "GDPR - Informații despre Protecția Datelor - Zen GSM",
  description:
    "Informații GDPR și protecția datelor personale pentru clienții ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/gdpr` },
};

export default function GdprPage() {
  return (
    <>
      <LegacyMain legacyFile="gdpr.html" />
    </>
  );
}
