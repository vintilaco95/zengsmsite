import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Despre Noi | ZEN GSM Timișoara - Peste 10 Ani Experiență",
  description:
    "ZEN GSM Timișoara — echipă cu experiență în service GSM, piese de calitate și garanție la reparații.",
  alternates: { canonical: `${siteUrl}/despre` },
};

export default function DesprePage() {
  return (
    <>
      <LegacyMain legacyFile="despre.html" />
      <PageScripts />
    </>
  );
}
