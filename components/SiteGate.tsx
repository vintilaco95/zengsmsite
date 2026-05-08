"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BaseSiteScripts } from "./PageScripts";
import { SiteNav } from "./SiteNav";

type Props = {
  children: React.ReactNode;
  backgroundHtml: string;
  footerHtml: string;
};

export function SiteGate({ children, backgroundHtml, footerHtml }: Props) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/preturi/embed") ||
    pathname.startsWith("/formulare/embed");

  useEffect(() => {
    if (!bare) return;
    document.documentElement.classList.add("zgs-embed-fill");
    document.body.classList.add("zgs-embed-fill");
    return () => {
      document.documentElement.classList.remove("zgs-embed-fill");
      document.body.classList.remove("zgs-embed-fill");
    };
  }, [bare]);

  if (bare) {
    const embedKind = pathname.startsWith("/preturi/embed")
      ? "preturi"
      : pathname.startsWith("/formulare/embed")
        ? "formulare"
        : undefined;
    return (
      <div className="zgs-embed-bare-layout" data-zgs-embed={embedKind}>
        {children}
      </div>
    );
  }

  return (
    <>
      {backgroundHtml ? (
        <div dangerouslySetInnerHTML={{ __html: backgroundHtml }} />
      ) : null}
      <SiteNav />
      {children}
      {footerHtml ? (
        <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
      ) : null}
      <BaseSiteScripts />
    </>
  );
}
