import { ActiveNav } from "./ActiveNav";
import { getBackgroundHtml, getFooterAndUiHtml, getNavHtml } from "@/lib/legacy-html";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const bg = getBackgroundHtml();
  const nav = getNavHtml();
  const tail = getFooterAndUiHtml();

  return (
    <>
      {bg ? <div dangerouslySetInnerHTML={{ __html: bg }} /> : null}
      {nav ? <div dangerouslySetInnerHTML={{ __html: nav }} /> : null}
      <ActiveNav />
      {children}
      {tail ? <div dangerouslySetInnerHTML={{ __html: tail }} /> : null}
    </>
  );
}
