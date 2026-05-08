"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HomeBlogCarousel, type HomeBlogCard } from "./HomeBlogCarousel";

type Props = { items: HomeBlogCard[] };

export function HomeBlogCarouselPortal({ items }: Props) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setEl(document.getElementById("zgs-home-blog-carousel-mount"));
  }, []);

  if (!el || !items.length) return null;
  return createPortal(<HomeBlogCarousel items={items} />, el);
}
