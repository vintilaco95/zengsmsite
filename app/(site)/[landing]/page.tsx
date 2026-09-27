import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScripts } from "@/components/JsonLdScripts";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { OfferPopup } from "@/components/landing/OfferPopup";
import {
  SEO_LANDINGS_UPDATED_AT,
  getSeoLanding,
  listSeoLandings,
  seoLandingHref,
  type SeoLanding,
} from "@/lib/seo-landings";
import { getSiteUrl } from "@/lib/site-url";

export const dynamicParams = false;

const siteUrl = getSiteUrl();
const BUSINESS_ID = "https://www.zengsm.ro/#business";

type Props = { params: Promise<{ landing: string }> };

export function generateStaticParams(): { landing: string }[] {
  return listSeoLandings().map((p) => ({ landing: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { landing } = await params;
  const page = getSeoLanding(landing);
  if (!page) return {};
  const url = `${siteUrl}${seoLandingHref(page.slug)}`;
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: "ZEN GSM Timișoara",
      url,
      title: page.meta.title,
      description: page.meta.description,
      images: [{ url: "/images/IMG_7712.PNG", width: 1200, height: 630, alt: page.h1.lead }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.meta.title,
      description: page.meta.description,
    },
  };
}

const STEPS = [
  {
    title: "Diagnostic",
    text: "Ne spui ce s-a întâmplat, verificăm telefonul și îți explicăm ce e de reparat, cât durează și ce tip de piesă recomandăm.",
  },
  {
    title: "Piesa",
    text: "Dacă piesa e în stoc, începem imediat. Dacă nu, o aducem pe comandă rapidă, în câteva zile, și te anunțăm când a ajuns.",
  },
  {
    title: "Reparația",
    text: "Cu piesa în stoc, reparația durează maximum 3 ore. Testăm telefonul complet înainte să-l închidem.",
  },
  {
    title: "Predarea",
    text: "Primești telefonul testat împreună cu tine și documentul de predare, cu garanția de 1 până la 3 ani trecută pe el.",
  },
];

function buildJsonLd(page: SeoLanding): string[] {
  const url = `${siteUrl}${seoLandingHref(page.slug)}`;
  const graph = [
    {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
      name: "ZEN GSM",
      url: "https://www.zengsm.ro/",
      telephone: "+40758060072",
      image: "https://www.zengsm.ro/images/IMG_7712.PNG",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Constantin Brâncoveanu Nr. 2",
        addressLocality: "Timișoara",
        addressRegion: "Timiș",
        postalCode: "300001",
        addressCountry: "RO",
      },
      geo: { "@type": "GeoCoordinates", latitude: 45.7489, longitude: 21.2087 },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "14:00",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.meta.title,
      description: page.meta.description,
      inLanguage: "ro-RO",
      dateModified: SEO_LANDINGS_UPDATED_AT,
      about: { "@id": `${url}#service` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: `${page.serviceType} în Timișoara`,
      serviceType: page.serviceType,
      description: page.answer,
      provider: { "@id": BUSINESS_ID },
      areaServed: { "@type": "City", name: "Timișoara" },
      ...(page.brand ? { brand: { "@type": "Brand", name: page.brand } } : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: page.breadcrumb, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return [JSON.stringify({ "@context": "https://schema.org", "@graph": graph })];
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.5 15L12.5 10L7.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function SeoLandingPage({ params }: Props) {
  const { landing } = await params;
  const page = getSeoLanding(landing);
  if (!page) notFound();

  const all = listSeoLandings();
  const related = page.related
    .map((s) => getSeoLanding(s))
    .filter((p): p is SeoLanding => Boolean(p));

  return (
    <>
      <JsonLdScripts blocks={buildJsonLd(page)} />

      <section
        className="hero lv-hero"
        data-hero={page.hero.variant}
        data-layout={page.hero.layout}
      >
        <div className="container">
          <nav className="lv-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Acasă</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.breadcrumb}</span>
          </nav>
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">{page.h1.lead} </span>
                <span className="title-line gradient-text">{page.h1.accent}</span>
              </h1>
              <Link href="/termeni-conditii/#credit-magazin" className="hero-offer">
                <span className="hero-offer__badge" aria-hidden="true">
                  <strong>100</strong>
                  <small>lei</small>
                </span>
                <span className="hero-offer__body">
                  <span className="hero-offer__kicker">Garanția Zen GSM</span>
                  <span className="hero-offer__title">
                    Telefonul tău funcțional sau primești{" "}
                    <span className="hero-offer__nowrap">100 lei*</span>
                  </span>
                  <span className="hero-offer__note">*Vezi condițiile ofertei</span>
                </span>
              </Link>
              <p className="hero-description">{page.heroLead}</p>
              <div className="hero-buttons">
                <Link href="/formulare/#repair-form" className="btn btn-primary hero-btn-service">
                  <span className="label-long">Trimite în service</span>
                  <span className="label-short">Sau trimite telefonul în service</span>
                  <Arrow />
                </Link>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- data-open-calc: script.js deschide modalul; Link ar naviga înainte */}
                <a
                  href="/preturi/"
                  className="btn btn-secondary hero-btn-price"
                  data-open-calc=""
                  title="Ctrl+click sau click dreapta: pagina Prețuri"
                >
                  <span className="label-long">Calculează prețul reparației</span>
                  <span className="label-short">Verifică prețul reparației</span>
                  <Arrow />
                </a>
                <a href="tel:+40758060072" className="btn btn-secondary hero-btn-call">
                  <span>Sună acum: 0758 060 072</span>
                </a>
              </div>
              <div className="trust-badges">
                {page.badges.map((b) => (
                  <div className="badge" key={b.long}>
                    <span className="badge-icon">✓</span>
                    <span className="label-long">{b.long}</span>
                    <span className="label-short">{b.short}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <HeroVisual variant={page.hero.variant} />
            </div>
          </div>
        </div>
      </section>

      <section className="lv-section lv-answer" aria-labelledby="lv-answer-title">
        <div className="container">
          <div className="lv-answer__card">
            <h2 id="lv-answer-title" className="lv-answer__label">
              Pe scurt
            </h2>
            <p>{page.answer}</p>
          </div>
        </div>
      </section>

      <section className="lv-section lv-focus">
        <div className="container lv-focus__grid">
          <div className="lv-focus__text">
            <h2 className="section-title lv-h2">{page.focus.heading}</h2>
            {page.focus.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <ul className="lv-checklist">
            {page.focus.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lv-section">
        <div className="container">
          <h2 className="section-title lv-h2">{page.othersHeading}</h2>
          <div className="lv-cards">
            {page.others.map((o) => (
              <article className="lv-card" key={o.title}>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lv-section">
        <div className="container">
          <h2 className="section-title lv-h2">{page.seriesHeading}</h2>
          <ul className="lv-chips">
            {page.series.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lv-section">
        <div className="container">
          <h2 className="section-title lv-h2">Cum decurge reparația la ZEN GSM</h2>
          <ol className="lv-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="lv-steps__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lv-section" id="intrebari">
        <div className="container lv-narrow">
          <h2 className="section-title lv-h2">{page.faqHeading}</h2>
          <div className="lv-faq">
            {page.faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="lv-section lv-local">
        <div className="container lv-local__grid">
          <div>
            <h2 className="section-title lv-h2">{page.localHeading}</h2>
            <p>{page.localText}</p>
            <address className="lv-nap">
              <strong>ZEN GSM</strong>
              <br />
              <a href="https://maps.app.goo.gl/wN9nUyV1aeFGop5U7" target="_blank" rel="noopener noreferrer">
                Constantin Brâncoveanu Nr. 2, Timișoara, Județul Timiș
              </a>
              <br />
              <a href="tel:+40758060072">0758 060 072</a> ·{" "}
              <a href="tel:+40721171995">0721 171 995</a>
              <br />
              Luni – Vineri: 9:00 – 18:00 · Sâmbătă: 10:00 – 14:00 · Duminică: închis
            </address>
            <div className="lv-local__cta">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- data-open-calc: script.js deschide modalul; Link ar naviga înainte */}
              <a href="/preturi/" className="btn btn-primary" data-open-calc="">
                Verifică prețul reparației
              </a>
              <a href="tel:+40758060072" className="btn btn-secondary">
                Sună acum
              </a>
            </div>
          </div>
          <nav className="lv-related" aria-label="Reparații înrudite">
            <h3>Te-ar putea interesa</h3>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={seoLandingHref(r.slug)}>{r.breadcrumb} în Timișoara</Link>
                </li>
              ))}
              <li>
                <Link href="/preturi/">Lista de prețuri</Link>
              </li>
              <li>
                <Link href="/contact/">Contact și program</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="lv-section lv-hub">
        <div className="container">
          <h2 className="lv-hub__title">Reparații telefoane în Timișoara, pe mărci și servicii</h2>
          <ul className="lv-hub__list">
            {all.map((p) => (
              <li key={p.slug}>
                {p.slug === page.slug ? (
                  <span aria-current="page">{p.breadcrumb}</span>
                ) : (
                  <Link href={seoLandingHref(p.slug)}>{p.breadcrumb}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OfferPopup lead={page.popupLead} />
    </>
  );
}
