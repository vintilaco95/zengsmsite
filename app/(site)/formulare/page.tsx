import type { Metadata } from "next";
import { Suspense } from "react";
import { FormulareStatusUrlParam } from "@/components/FormulareStatusUrlParam";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Verifică Status Service | ZEN GSM Timișoara",
  description:
    "Formulare verificare status reparație și solicitări service la ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/formulare/` },
};

export default function FormularePage() {
  return (
    <>
      <LegacyMain legacyFile="formulare.html" />
      <Suspense fallback={null}>
        <FormulareStatusUrlParam />
      </Suspense>
      <PageScripts jquery extra={["/scripts/forms.js"]} />
    </>
  );
}
