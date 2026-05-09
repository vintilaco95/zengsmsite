import type { Metadata } from "next";
import { FaqLegacyEnhancements } from "@/components/FaqLegacyEnhancements";
import { LegacyMain } from "@/components/LegacyMain";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Întrebări Frecvente | ZEN GSM Timișoara - FAQ",
  description:
    "Răspunsuri la întrebările frecvente despre service GSM, garanție și reparații telefoane.",
  alternates: { canonical: `${siteUrl}/intrebari-frecvente` },
};

export default function FaqPage() {
  return (
    <>
      <LegacyMain legacyFile="intrebari-frecvente.html" />
      <FaqLegacyEnhancements />
    </>
  );
}
