import data from "@/data/seo-landings.json";

export type HeroVariant = "display" | "baterie" | "mufa" | "camera" | "carcasa" | "apa";
export type HeroLayout = "side" | "center";

export type SeoLanding = {
  slug: string;
  kind: "brand" | "service";
  brand: string;
  serviceType: string;
  hero: { variant: HeroVariant; layout: HeroLayout };
  meta: { title: string; description: string };
  breadcrumb: string;
  h1: { lead: string; accent: string };
  heroLead: string;
  badges: { long: string; short: string }[];
  answer: string;
  focus: { heading: string; paragraphs: string[]; points: string[] };
  othersHeading: string;
  others: { title: string; text: string }[];
  seriesHeading: string;
  series: string[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  localHeading: string;
  localText: string;
  related: string[];
  popupLead: string;
};

const pages = data.pages as SeoLanding[];

export const SEO_LANDINGS_UPDATED_AT = data.updatedAt;

export function listSeoLandings(): SeoLanding[] {
  return pages;
}

export function getSeoLanding(slug: string): SeoLanding | undefined {
  return pages.find((p) => p.slug === slug);
}

export function seoLandingHref(slug: string): string {
  return `/${slug}/`;
}
