"use client";

import { useEffect } from "react";

/**
 * FAQ din LegacyMain nu mai poate depinde de DOMContentLoaded (Next.js navigare client).
 * Legăm taburile și acordeonul după montare și curățăm la demontare.
 */
export function FaqLegacyEnhancements() {
  useEffect(() => {
    const root = document.querySelector(".faq-section");
    if (!root) return;

    const catBtns = root.querySelectorAll(".faq-cat-btn");
    const faqItems = root.querySelectorAll(".faq-item");

    const onCatClick = (ev: Event) => {
      const btn = ev.currentTarget as HTMLButtonElement;
      const category = btn.getAttribute("data-cat");
      if (!category) return;

      catBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      faqItems.forEach((item) => {
        const itemCat = item.getAttribute("data-category");
        (item as HTMLElement).style.display =
          category === "general" || itemCat === category ? "block" : "none";
      });
    };

    const onQuestionClick = (ev: Event) => {
      const question = ev.currentTarget as HTMLElement;
      const item = question.parentElement;
      if (!item || !item.classList.contains("faq-item")) return;

      const isActive = item.classList.contains("active");
      faqItems.forEach((i) => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    };

    catBtns.forEach((b) => b.addEventListener("click", onCatClick));
    root.querySelectorAll(".faq-question").forEach((q) => {
      q.addEventListener("click", onQuestionClick);
    });

    return () => {
      catBtns.forEach((b) => b.removeEventListener("click", onCatClick));
      root.querySelectorAll(".faq-question").forEach((q) => {
        q.removeEventListener("click", onQuestionClick);
      });
    };
  }, []);

  return null;
}
