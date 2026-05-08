import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Verifică Status Service | ZEN GSM Timișoara",
  description:
    "Formulare verificare status reparație și solicitări service la ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/formulare` },
};

export default function FormularePage() {
  return (
    <>
      <LegacyMain legacyFile="formulare.html" />
      <PageScripts jquery extra={["/scripts/forms.js"]} />
    </>
  );
}
