"use client";

import { usePathname } from "next/navigation";
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

  if (bare) {
    return <div className="zgs-embed-bare-layout">{children}</div>;
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
    </>
  );
}
