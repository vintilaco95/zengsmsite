"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type EmbedModalVariant = "price" | "status";

type Props = {
  variant: EmbedModalVariant | null;
  onClose: () => void;
};

export function EmbedModal({ variant, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!variant) return;
    document.body.classList.add("zgs-embed-modal-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("zgs-embed-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [variant, onClose]);

  if (!mounted || typeof document === "undefined" || !variant) return null;

  const embedSrc =
    variant === "price"
      ? `${window.location.origin}/preturi/embed/`
      : `${window.location.origin}/formulare/embed/`;

  const title =
    variant === "price"
      ? "Calculator prețuri reparații"
      : "Verifică status service";

  return createPortal(
    <div
      className="zgs-embed-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="zgs-embed-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="zgs-embed-modal__close"
          aria-label="Închide"
          onClick={onClose}
        >
          ×
        </button>
        <iframe title={title} src={embedSrc} className="zgs-embed-modal__frame" />
      </div>
    </div>,
    document.body,
  );
}
