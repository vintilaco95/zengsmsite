"use client";

import Script from "next/script";

type Props = {
  /** În plus față de script.js și cookie-banner (ex: /scripts/gallery.js) */
  extra?: string[];
  /** Încarcă jQuery înainte de scripturile extra (formulare) */
  jquery?: boolean;
};

export function PageScripts({ extra = [], jquery = false }: Props) {
  return (
    <>
      {jquery ? (
        // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- jQuery trebuie înainte de forms.js (legacy)
        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />
      ) : null}
      {extra.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
      <Script src="/scripts/script.js" strategy="afterInteractive" />
      <Script src="/scripts/cookie-banner.js" strategy="afterInteractive" />
    </>
  );
}
