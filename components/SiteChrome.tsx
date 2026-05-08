import { SiteNav } from "./SiteNav";
import { getBackgroundHtml, getFooterAndUiHtml } from "@/lib/legacy-html";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const bg = getBackgroundHtml();
  const tail = getFooterAndUiHtml();

  return (
    <>
      {bg ? <div dangerouslySetInnerHTML={{ __html: bg }} /> : null}
      <SiteNav />
      {children}
      {tail ? <div dangerouslySetInnerHTML={{ __html: tail }} /> : null}
    </>
  );
}
