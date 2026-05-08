"use client";

import { createContext, useContext } from "react";

export type SiteModalsValue = {
  openPriceWizard: () => void;
  openStatusForm: () => void;
};

export const SiteModalsContext = createContext<SiteModalsValue | null>(null);

export function useSiteModals(): SiteModalsValue {
  const v = useContext(SiteModalsContext);
  if (!v) {
    throw new Error("useSiteModals must be used within AppProviders");
  }
  return v;
}
