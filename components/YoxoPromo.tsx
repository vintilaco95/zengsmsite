"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const HREF = "https://yoxo.onelink.me/ch/f8ly/5uof2g9a";
const CODE = "HAIPEYOXO100";
const POPUP_SEEN = "zgs-yoxo-popup-seen";
const DOCK_HIDDEN = "zgs-yoxo-dock-hidden";
const STARTED = "zgs-yoxo-started";
const WAIT_MS = 10_000;

function storageGet(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

function YoxoMark({ className }: { className?: string }) {
  return (
    <svg className={className ? `yoxo-mark ${className}` : "yoxo-mark"} viewBox="0 0 100 100" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.54 52.08c.45 0 .88.18 1.19.49l13.99 13.82c.33.32.77.5 1.24.48h.01c.43-.01.83-.18 1.14-.48l14.08-13.81c.32-.31.74-.49 1.19-.49l5.7.02c.49 0 .96.22 1.28.59l.15.18c.27.31.41.7.41 1.1l-.02 5.85c0 .45-.18.88-.5 1.2L33.43 74.83c-.32.32-.5.75-.5 1.2v.02c0 .45.18.89.5 1.2l13.96 13.79c.32.32.5.75.5 1.2l.02 5.85c0 .41-.15.8-.41 1.11l-.15.18c-.32.37-.79.59-1.28.59l-5.7.02c-.44 0-.87-.17-1.19-.49L25.11 85.69c-.3-.3-.71-.47-1.14-.48h-.01c-.46-.01-.91.16-1.24.49L8.73 99.51c-.32.31-.75.49-1.19.49H1.85c-.49 0-.96-.21-1.28-.59l-.15-.18C.15 98.93 0 98.53 0 98.13v-5.85c0-.45.18-.88.5-1.2l13.92-13.84c.32-.32.5-.75.5-1.2s-.18-.88-.5-1.2L.5 61c-.32-.32-.5-.75-.5-1.2v-5.85c0-.41.15-.8.41-1.1l.15-.18c.32-.37.79-.59 1.28-.59h5.7zm92.46 0V100H52.08V52.08H100zm-23.86 3.46c-11.32 0-20.54 9.18-20.54 20.47 0 11.29 9.21 20.47 20.54 20.47s20.54-9.18 20.54-20.47-9.21-20.47-20.54-20.47zm0 9.5c6.07 0 11 4.92 11 10.97s-4.94 10.97-11 10.97-11-4.92-11-10.97 4.93-10.97 11-10.97zM7.54 0c.45 0 .88.18 1.19.49l13.99 13.82c.33.32.77.5 1.24.49h.01c.43-.01.83-.18 1.14-.48L39.19.5C39.5.19 39.93.01 40.38.01l5.7.02c.49 0 .96.22 1.28.59l.15.18c.27.31.41.7.41 1.11l-.02 5.85c0 .45-.18.88-.5 1.2L32.93 23.24 23.24 33.1 8.73 47.43c-.32.31-.75.49-1.19.49H1.85c-.49 0-.96-.21-1.28-.59l-.15-.18C.15 46.84 0 46.45 0 46.05v-5.85c0-.45.18-.88.5-1.2l13.92-13.84c.32-.32.5-.75.5-1.2s-.18-.88-.5-1.2L.5 8.92C.18 8.6 0 8.17 0 7.72V1.87c0-.41.15-.8.41-1.1l.15-.18C.89.21 1.35 0 1.85 0h5.7zM76.04 0C89.22 0 100 10.04 100 23.22v1.48c0 13.04-10.57 23.02-23.56 23.22h-.4c-13.18 0-23.96-10.04-23.96-23.22v-1.48C52.08 10.04 62.86 0 76.04 0zm.26 13c-6.03 0-10.93 4.9-10.93 10.93s4.9 10.93 10.93 10.93 10.93-4.9 10.93-10.93S82.33 13 76.3 13z"
      />
    </svg>
  );
}

function Tile() {
  return (
    <a className="yoxo-tile" href={HREF} target="_blank" rel="noopener noreferrer sponsored">
      <span className="yoxo-tile__from">
        <img className="yoxo-tile__zen" src="/images/IMG_7712.PNG" alt="" />
        <span>
          <span className="yoxo-tile__kicker">Din partea</span>
          <span className="yoxo-tile__who">Zen GSM</span>
        </span>
      </span>
      <span className="yoxo-tile__offer">
        <span className="yoxo-tile__days">30</span>
        <span className="yoxo-tile__label">zile gratuite</span>
      </span>
      <span className="yoxo-tile__foot">
        <YoxoMark className="yoxo-tile__logo" />
        <span>
          <span className="yoxo-tile__kicker">Cod YOXO</span>
          <span className="yoxo-tile__code">{CODE}</span>
        </span>
      </span>
    </a>
  );
}

export function YoxoPromo() {
  const [heroSlot, setHeroSlot] = useState<HTMLElement | null>(null);
  const [dockOn, setDockOn] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    setHeroSlot(document.querySelector<HTMLElement>(".hero .phone-model, .hero .lv-device"));
    setDockOn(storageGet(DOCK_HIDDEN) !== "1");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("yoxo-dock-on", dockOn);
    return () => document.body.classList.remove("yoxo-dock-on");
  }, [dockOn]);

  useEffect(() => {
    document.body.classList.toggle("yoxo-popup-open", popupOpen);
    return () => document.body.classList.remove("yoxo-popup-open");
  }, [popupOpen]);

  useEffect(() => {
    if (!dockOn) return;
    const banner = document.getElementById("cookie-banner");
    const apply = () => {
      const shown = !!banner && getComputedStyle(banner).display !== "none";
      const height = shown ? banner.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty("--yoxo-cookie", `${Math.ceil(height)}px`);
    };
    apply();
    const observer = banner ? new MutationObserver(apply) : null;
    observer?.observe(banner as HTMLElement, { attributes: true, attributeFilter: ["style", "class"] });
    window.addEventListener("resize", apply);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", apply);
      document.documentElement.style.removeProperty("--yoxo-cookie");
    };
  }, [dockOn]);

  useEffect(() => {
    if (storageGet(POPUP_SEEN) === "1") return;
    if (!storageGet(STARTED)) storageSet(STARTED, String(Date.now()));
    const started = Number(storageGet(STARTED)) || Date.now();
    let timer = 0;
    let poll = 0;

    const blocked = () =>
      !!document.querySelector(
        ".zgs-offer-backdrop.is-open, .zgs-trust-calc-backdrop.is-open, .zgs-trust-status-backdrop.is-open",
      );

    const open = () => {
      if (storageGet(POPUP_SEEN) === "1") return;
      if (blocked()) {
        poll = window.setInterval(() => {
          if (!blocked()) {
            window.clearInterval(poll);
            storageSet(POPUP_SEEN, "1");
            setPopupOpen(true);
          }
        }, 400);
        return;
      }
      storageSet(POPUP_SEEN, "1");
      setPopupOpen(true);
    };

    const wait = Math.max(0, WAIT_MS - (Date.now() - started));
    timer = window.setTimeout(open, wait);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (!popupOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPopupOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [popupOpen]);

  const closeDock = () => {
    storageSet(DOCK_HIDDEN, "1");
    setDockOn(false);
  };

  return (
    <>
      {heroSlot ? createPortal(<Tile />, heroSlot) : null}

      {dockOn ? (
        <aside className="yoxo-dock" aria-label="Ofertă YOXO">
          <a className="yoxo-dock__link" href={HREF} target="_blank" rel="noopener noreferrer sponsored">
            <span className="yoxo-dock__mark">
              <YoxoMark />
            </span>
            <span className="yoxo-dock__copy">
              <span className="yoxo-dock__kicker">YOXO by Orange</span>
              <span className="yoxo-dock__title">
                <em>30 de zile</em> gratuit · cod <span className="yoxo-code">{CODE}</span>
              </span>
              <span className="yoxo-dock__note">Fără costuri. Fără contract. Introdu codul {CODE} în aplicație.</span>
            </span>
          </a>
          <a className="yoxo-dock__cta" href={HREF} target="_blank" rel="noopener noreferrer sponsored">
            Activează
          </a>
          <button type="button" className="yoxo-dock__close" aria-label="Închide bannerul YOXO" onClick={closeDock}>
            ×
          </button>
        </aside>
      ) : null}

      <div
        className={popupOpen ? "yoxo-popup is-open" : "yoxo-popup"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="yoxo-popup-title"
        hidden={!popupOpen}
        onClick={() => setPopupOpen(false)}
      >
        <div className="yoxo-popup__card" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="yoxo-popup__close" aria-label="Închide oferta YOXO" onClick={() => setPopupOpen(false)}>
            ×
          </button>
          <div className="yoxo-popup__brand">
            <YoxoMark className="yoxo-popup__logo" />
            <span>YOXO</span>
          </div>
          <p className="yoxo-popup__kicker">by Orange · recomandare Zen GSM</p>
          <h2 className="yoxo-popup__title" id="yoxo-popup-title">
            <span>30 de zile</span> complet gratuit
          </h2>
          <p className="yoxo-popup__code">
            Codul tău <strong>{CODE}</strong>
          </p>
          <p className="yoxo-popup__lead">
            Activează un număr YOXO și introdu codul {CODE}. Primești 30 de zile fără costuri. Fără contract, îl închizi când vrei.
          </p>
          <ul className="yoxo-popup__list">
            <li>Prima lună, 30 de zile, este gratuită</li>
            <li>Nu poți face cost suplimentar</li>
            <li>La activare, codul {CODE}</li>
          </ul>
          <a className="yoxo-popup__cta" href={HREF} target="_blank" rel="noopener noreferrer sponsored" onClick={() => setPopupOpen(false)}>
            Activează gratuit
          </a>
          <p className="yoxo-popup__fine">
            Ofertă YOXO by Orange. În aplicație, la „Cod de reducere”, scrie {CODE}.
          </p>
        </div>
      </div>
    </>
  );
}
