import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site-url";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "ZEN GSM - Service GSM Premium Timișoara | Reparații Telefoane și Tablete",
  description:
    "Service GSM profesional în Timișoara. Reparații iPhone, Samsung, Huawei, Xiaomi. Piese originale, garanție, diagnostic gratuit.",
  keywords: [
    "service gsm timisoara",
    "reparatii telefoane",
    "service iphone timisoara",
  ],
  authors: [{ name: "ZEN GSM - SC Ajutor Technologia SRL" }],
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/IMG_7712.PNG", sizes: "32x32", type: "image/png" },
    ],
    apple: "/images/IMG_7712.PNG",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "ZEN GSM Timișoara",
    url: siteUrl,
    images: [{ url: "/images/IMG_7712.PNG", width: 1200, height: 630, alt: "ZEN GSM" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/IMG_7712.PNG"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" data-zengsm-engine="next-export-out">
      <head>
        {/* Dacă în „View source” nu vezi data-zengsm-engine și fișiere /_next/static/..., Render încă servește build-ul vechi (publish dir greșit sau fără npm run build). */}
        {/* Site-ul vechi folosește /public/css/styles.css — menținem același fișier. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/styles.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags -- CSS legacy + navbar dedicat */}
        <link rel="stylesheet" href="/css/site-nav.css" />
        <link rel="stylesheet" href="/css/home-blog-carousel.css" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- același font stack ca site-ul HTML vechi */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DJT9VFKRS1"
          strategy="afterInteractive"
        />
        <Script id="gtag-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DJT9VFKRS1');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
