import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PageScripts } from "@/components/PageScripts";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contact ZEN GSM Timișoara | Program & Locație",
  description:
    "Contact service GSM ZEN GSM Timișoara — adresă, telefon, email și programul de lucru.",
  alternates: { canonical: `${siteUrl}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <LegacyMain legacyFile="contact.html" />
      <PageScripts extra={["/scripts/contact-form.js"]} />
    </>
  );
}
