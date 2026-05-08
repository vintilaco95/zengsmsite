"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { useSiteModals } from "./SiteModalsContext";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Acasă" },
  { href: "/servicii/", label: "Servicii" },
  { href: "/preturi/", label: "Prețuri" },
  { href: "/formulare/", label: "Verifică" },
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

function PreturiNavLink({
  className,
  onAfterClick,
  children = "Prețuri",
}: {
  className: string;
  onAfterClick?: () => void;
  children?: React.ReactNode;
}) {
  const { openPriceWizard } = useSiteModals();
  return (
    <a
      href="/preturi/"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onAfterClick?.();
        openPriceWizard();
      }}
    >
      {children}
    </a>
  );
}

function StatusNavLink({
  className,
  onAfterClick,
  children = "Status",
}: {
  className: string;
  onAfterClick?: () => void;
  children?: React.ReactNode;
}) {
  const { openStatusForm } = useSiteModals();
  return (
    <a
      href="/formulare/"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onAfterClick?.();
        openStatusForm();
      }}
    >
      {children}
    </a>
  );
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
      <div className="zgs-header__bar">
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

          <div className="zgs-header__mobile-quick">
            <StatusNavLink
              className="zgs-header__pill zgs-header__pill--solid"
              onAfterClick={close}
            >
              Status
            </StatusNavLink>
            <PreturiNavLink
              className="zgs-header__pill zgs-header__pill--ghost"
              onAfterClick={close}
            />
          </div>

          <nav className="zgs-header__nav" aria-label="Pagini site">
            <ul className="zgs-header__list">
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  {href === "/preturi/" ? (
                    <PreturiNavLink className={linkCls(href)} />
                  ) : href === "/formulare/" ? (
                    <StatusNavLink className={linkCls(href)}>
                      {label}
                    </StatusNavLink>
                  ) : (
                    <Link href={href} className={linkCls(href)}>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="zgs-header__actions">
            <StatusNavLink className="zgs-header__pill zgs-header__pill--solid">
              Verifică status
            </StatusNavLink>
            <PreturiNavLink className="zgs-header__pill zgs-header__pill--ghost" />
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
              {href === "/preturi/" ? (
                <PreturiNavLink
                  className={linkCls(href, true)}
                  onAfterClick={close}
                />
              ) : href === "/formulare/" ? (
                <StatusNavLink
                  className={linkCls(href, true)}
                  onAfterClick={close}
                >
                  {label}
                </StatusNavLink>
              ) : (
                <Link href={href} className={linkCls(href, true)} onClick={close}>
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="zgs-header__sheet-actions">
          <StatusNavLink
            className="zgs-header__pill zgs-header__pill--solid"
            onAfterClick={close}
          >
            Verifică status
          </StatusNavLink>
          <PreturiNavLink
            className="zgs-header__pill zgs-header__pill--ghost"
            onAfterClick={close}
          />
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
