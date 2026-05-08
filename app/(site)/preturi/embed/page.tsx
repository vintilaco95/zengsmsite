import type { Metadata } from "next";
import { PriceCalculatorApp } from "@/components/price-calculator/PriceCalculatorApp";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Calculator prețuri reparații | ZEN GSM",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/preturi/embed/` },
};

export default function PreturiEmbedPage() {
  return <PriceCalculatorApp variant="embed" />;
}
