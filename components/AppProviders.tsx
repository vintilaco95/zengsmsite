"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { PriceWizardContext } from "./PriceWizardContext";
import { PriceWizardModal } from "./PriceWizardModal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPriceWizard = useCallback(() => setOpen(true), []);
  const value = useMemo(
    () => ({ openPriceWizard }),
    [openPriceWizard],
  );

  return (
    <PriceWizardContext.Provider value={value}>
      {children}
      <PriceWizardModal open={open} onClose={() => setOpen(false)} />
    </PriceWizardContext.Provider>
  );
}
