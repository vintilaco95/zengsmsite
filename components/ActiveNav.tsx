"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Pune clasa `active` pe link-ul din navbar care corespunde rutei curente. */
export function ActiveNav() {
  const pathname = usePathname();

  useEffect(() => {
    const p = (pathname.replace(/\/$/, "") || "/").split("#")[0];
    document.querySelectorAll(".navbar .nav-link").forEach((el) => {
      const a = el as HTMLAnchorElement;
      const raw = (a.getAttribute("href") || "").split("#")[0].replace(/\/$/, "") || "/";
      let active = raw === p;
      if (raw === "/blog" && p.startsWith("/blog")) active = true;
      a.classList.toggle("active", active);
    });
  }, [pathname]);

  return null;
}
