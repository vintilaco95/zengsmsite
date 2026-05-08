"use client";

import { createContext, useContext } from "react";

export type PriceWizardContextValue = { openPriceWizard: () => void };

export const PriceWizardContext =
  createContext<PriceWizardContextValue | null>(null);

export function usePriceWizard(): PriceWizardContextValue {
  const v = useContext(PriceWizardContext);
  if (!v) {
    throw new Error("usePriceWizard must be used within AppProviders");
  }
  return v;
}
