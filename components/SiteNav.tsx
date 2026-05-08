"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Acasă" },
  { href: "/servicii/", label: "Servicii" },
  { href: "/preturi/", label: "Prețuri" },
  { href: "/formulare/", label: "Verifică" },
  { href: "/vanzare-telefon/", label: "Vinde" },
  { href: "/galerie/", label: "Galerie" },
  { href: "/despre/", label: "Despre" },
  { href: "/blog/", label: "Blog" },
  { href: "/intrebari-frecvente/", label: "FAQ" },
  { href: "/contact/", label: "Contact" },
];

function normalizePath(path: string): string {
  return (path.replace(/\/$/, "") || "/").split("#")[0] ?? "/";
}

function linkMatches(pathnameNorm: string, href: string): boolean {
  const h = normalizePath(href.split("#")[0] ?? href);
  if (h === "/blog") return pathnameNorm.startsWith("/blog");
  return h === pathnameNorm;
}

export function SiteNav() {
  const pathname = usePathname();
  const pathnameNorm = normalizePath(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sheetId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathnameNorm]);

  useEffect(() => {
    document.body.classList.toggle("zgs-nav-open", open);
    return () => document.body.classList.remove("zgs-nav-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const linkCls = (href: string, sheet?: boolean) => {
    const active = linkMatches(pathnameNorm, href);
    if (sheet)
      return `zgs-header__sheet-link${active ? " zgs-header__sheet-link--active" : ""}`;
    return `zgs-header__link${active ? " zgs-header__link--active" : ""}`;
  };

  return (
    <header
      className={`zgs-header${scrolled ? " zgs-header--scrolled" : ""}`}
    >
      <div className="zgs-header__inner">
        <Link href="/" className="zgs-header__brand" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element -- asset static + export */}
          <img
            src="/images/IMG_7712.PNG"
            alt=""
            width={160}
            height={40}
            className="zgs-header__logo"
            decoding="async"
          />
          <span className="zgs-header__title">ZEN GSM</span>
        </Link>

        <nav className="zgs-header__nav" aria-label="Pagini site">
          <ul className="zgs-header__list">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkCls(href)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="zgs-header__actions">
          <Link href="/formulare/" className="zgs-header__cta">
            Verifică status
          </Link>
          <Link href="/preturi/#price-wizard-root" className="zgs-header__chip">
            Prețuri
          </Link>
          <a
            href="https://licitatii-gsm.ro"
            className="zgs-header__chip zgs-header__chip--auction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="zgs-header__chip-long">Licitații GSM</span>
            <span className="zgs-header__chip-short" aria-hidden="true">
              Licitații
            </span>
          </a>
        </div>

        <button
          type="button"
          className={`zgs-header__burger${open ? " is-open" : ""}`}
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`zgs-header__backdrop${open ? " is-open" : ""}`}
        aria-hidden
        onClick={close}
      />

      <div
        id={sheetId}
        className={`zgs-header__sheet${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Meniu navigare"
        aria-hidden={!open}
      >
        <ul className="zgs-header__sheet-list">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkCls(href, true)} onClick={close}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="zgs-header__sheet-actions">
          <Link href="/formulare/" className="zgs-header__cta" onClick={close}>
            Verifică status
          </Link>
          <Link
            href="/preturi/#price-wizard-root"
            className="zgs-header__chip"
            onClick={close}
          >
            Prețuri
          </Link>
          <a
            href="https://licitatii-gsm.ro"
            className="zgs-header__chip zgs-header__chip--auction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="zgs-header__chip-long">Licitații GSM</span>
            <span className="zgs-header__chip-short" aria-hidden="true">
              Licitații
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
