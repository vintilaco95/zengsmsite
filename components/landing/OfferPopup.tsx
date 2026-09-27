import Link from "next/link";

/** Aceleași id-uri și clase ca popup-ul de pe homepage: logica e în public/scripts/script.js. */
export function OfferPopup({ lead }: { lead: string }) {
  return (
    <div
      id="zgs-offer-backdrop"
      className="zgs-offer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="zgs-offer-title"
      hidden
    >
      <div className="zgs-offer-modal">
        <button type="button" className="zgs-offer-close" aria-label="Închide oferta">
          ×
        </button>
        <p className="zgs-offer-kicker">Garanția Zen GSM</p>
        <h2 className="zgs-offer-title" id="zgs-offer-title">
          <span>100 lei</span> credit în magazin
        </h2>
        <p className="zgs-offer-lead">{lead}</p>
        <ul className="zgs-offer-list">
          <li>Reparăm orice model de telefon</li>
          <li>Reparații în maxim 3 ore cu piese din stoc</li>
          <li>Orice piesă pe comandă rapidă, în doar câteva zile</li>
          <li>Garanție de la 1 an la 3 ani</li>
        </ul>
        <div className="zgs-offer-actions">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- data-open-calc: script.js deschide modalul; Link ar naviga înainte */}
          <a href="/preturi/" className="btn btn-primary" data-open-calc="">
            Verifică prețul reparației
          </a>
          <a href="tel:+40758060072" className="btn btn-secondary">
            Sună acum: 0758 060 072
          </a>
        </div>
        <Link href="/termeni-conditii/#credit-magazin" className="zgs-offer-terms">
          Vezi condițiile ofertei
        </Link>
      </div>
    </div>
  );
}
