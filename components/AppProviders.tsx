"use client";

import { useCallback, useMemo, useState } from "react";
import { EmbedModal, type EmbedModalVariant } from "./EmbedModal";
import { SiteModalsContext } from "./SiteModalsContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [embed, setEmbed] = useState<EmbedModalVariant | null>(null);

  const openPriceWizard = useCallback(() => setEmbed("price"), []);
  const openStatusForm = useCallback(() => setEmbed("status"), []);

  const value = useMemo(
    () => ({ openPriceWizard, openStatusForm }),
    [openPriceWizard, openStatusForm],
  );

  return (
    <SiteModalsContext.Provider value={value}>
      {children}
      <EmbedModal variant={embed} onClose={() => setEmbed(null)} />
    </SiteModalsContext.Provider>
  );
}
