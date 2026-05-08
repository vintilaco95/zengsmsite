import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Servicii Reparații GSM | ZEN GSM Timișoara",
  description:
    "Servicii complete de reparații telefoane: display, baterie, cameră, contact apă, software. Toate mărcile: iPhone, Samsung, Huawei, Xiaomi. Garanție inclusă.",
  alternates: { canonical: `${siteUrl}/servicii` },
};

export default function ServiciiPage() {
  return (
    <>
      <LegacyMain legacyFile="servicii.html" />
      <PageScripts />
    </>
  );
}
