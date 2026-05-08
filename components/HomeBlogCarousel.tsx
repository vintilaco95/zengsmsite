"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HomeBlogCard = {
  title: string;
  href: string;
  excerpt: string;
  coverImage: string;
};

type Props = { items: HomeBlogCard[] };

function scrollStep(el: HTMLElement | null, dir: -1 | 1) {
  if (!el) return;
  const card = el.querySelector<HTMLElement>(".zgs-home-blog__card");
  const w = card ? card.offsetWidth + 16 : Math.min(280, el.clientWidth * 0.82);
  el.scrollBy({ left: dir * w, behavior: "smooth" });
}

export function HomeBlogCarousel({ items }: Props) {
  const vpRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncArrows = useCallback(() => {
    const el = vpRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 2;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < max);
  }, []);

  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [syncArrows, items.length]);

  if (!items.length) return null;

  return (
    <section className="zgs-home-blog" aria-labelledby="zgs-home-blog-heading">
      <div className="container">
        <div className="zgs-home-blog__head">
          <h2 id="zgs-home-blog-heading" className="zgs-home-blog__title">
            Din blog
          </h2>
          <div className="zgs-home-blog__controls">
            <Link className="zgs-home-blog__all" href="/blog/">
              Toate articolele
            </Link>
            <button
              type="button"
              className="zgs-home-blog__btn"
              aria-label="Articole anterioare"
              disabled={!canPrev}
              onClick={() => scrollStep(vpRef.current, -1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="zgs-home-blog__btn"
              aria-label="Articole următoare"
              disabled={!canNext}
              onClick={() => scrollStep(vpRef.current, 1)}
            >
              ›
            </button>
          </div>
        </div>
        <div
          className="zgs-home-blog__viewport"
          ref={vpRef}
          tabIndex={0}
          role="region"
          aria-label="Carusel articole blog"
        >
          <div className="zgs-home-blog__track">
            {items.map((it) => (
              <article key={it.href} className="zgs-home-blog__card">
                <Link className="zgs-home-blog__card-link" href={it.href}>
                  <div className="zgs-home-blog__media">
                    {/* eslint-disable-next-line @next/next/no-img-element -- URL-uri externe din manifest */}
                    <img
                      src={it.coverImage}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="zgs-home-blog__body">
                    <h3 className="zgs-home-blog__card-title">{it.title}</h3>
                    <p className="zgs-home-blog__snippet">{it.excerpt}</p>
                    <span className="zgs-home-blog__read">Citește articolul</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
