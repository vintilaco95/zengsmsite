"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ID_CLIENT = 1277;

/**
 * După navigare client către /formulare/?cod=…, rulează verificarea (scriptul forms.js încarcă o singură dată).
 */
export function FormulareStatusUrlParam() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const cod = searchParams.get("cod");
    if (!cod || typeof window === "undefined") return;
    if (!document.getElementById("statusCheckForm")) return;

    const w = window as unknown as {
      jQuery?: (sel: string) => { val: (v: string) => void };
      verifica?: (id: number) => void;
    };

    if (w.jQuery) w.jQuery("#cod").val(cod);
    else {
      const input = document.getElementById("cod") as HTMLInputElement | null;
      if (input) input.value = cod;
    }

    queueMicrotask(() => w.verifica?.(ID_CLIENT));
  }, [searchParams]);

  return null;
}
