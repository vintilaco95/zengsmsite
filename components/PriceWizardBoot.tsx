"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __ZENGSM_BOOT_PRICE_WIZARD?: () => void | Promise<void>;
  }
}

export function PriceWizardBoot() {
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 160;

    const tick = () => {
      if (cancelled) return;
      const boot = window.__ZENGSM_BOOT_PRICE_WIZARD;
      if (typeof boot === "function") {
        void boot();
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) return;
      requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
