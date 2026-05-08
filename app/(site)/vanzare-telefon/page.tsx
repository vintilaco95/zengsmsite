import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Vinde Telefonul Tău | ZEN GSM Timișoara - Preț Corect",
  description:
    "Vinde telefonul folosit la ZEN GSM Timișoara — evaluare și ofertă corectă pentru telefoane și tablete.",
  alternates: { canonical: `${siteUrl}/vanzare-telefon` },
};

export default function VanzarePage() {
  return (
    <>
      <LegacyMain legacyFile="vanzare-telefon.html" />
      <PageScripts extra={["/scripts/vanzare-telefon-nou.js"]} />
    </>
  );
}
