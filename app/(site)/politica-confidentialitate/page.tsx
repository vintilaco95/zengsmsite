import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Politică de Confidențialitate - Zen GSM",
  description:
    "Politica de confidențialitate și utilizarea datelor pe site-ul ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/politica-confidentialitate` },
};

export default function PoliticaPage() {
  return (
    <>
      <LegacyMain legacyFile="politica-confidentialitate.html" />
      <PageScripts />
    </>
  );
}
