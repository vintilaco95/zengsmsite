import type { Metadata } from "next";
import { LegacyMain } from "@/components/LegacyMain";
import { PriceCalculatorApp } from "@/components/price-calculator/PriceCalculatorApp";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Prețuri Reparații Telefoane | ZEN GSM Timișoara",
  description:
    "Listă de prețuri orientative pentru reparații telefoane și tablete la ZEN GSM Timișoara.",
  alternates: { canonical: `${siteUrl}/preturi/` },
};

export default function PreturiPage() {
  return (
    <div className="page-preturi">
      <PriceCalculatorApp variant="page" />
      <LegacyMain legacyFile="preturi-bottom.html" fragment />
    </div>
  );
}
