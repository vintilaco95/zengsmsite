import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Termeni și Condiții - Zen GSM",
  description: "Termenii și condițiile de utilizare a serviciilor ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/termeni-conditii` },
};

export default function TermeniPage() {
  return (
    <>
      <LegacyMain legacyFile="termeni-conditii.html" />
    </>
  );
}
