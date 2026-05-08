"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PriceWizardModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("zgs-price-modal-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("zgs-price-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || typeof document === "undefined" || !open) return null;

  const embedSrc = `${window.location.origin}/preturi/embed/`;

  return createPortal(
    <div
      className="zgs-price-modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="zgs-price-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Calculator prețuri reparații"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="zgs-price-modal__close"
          aria-label="Închide"
          onClick={onClose}
        >
          ×
        </button>
        <iframe
          title="Calculator prețuri reparații"
          src={embedSrc}
          className="zgs-price-modal__frame"
        />
        <p className="zgs-price-modal__hint">
          Pagina completă:{" "}
          <Link href="/preturi/" onClick={onClose}>
            Prețuri
          </Link>
        </p>
      </div>
    </div>,
    document.body,
  );
}
