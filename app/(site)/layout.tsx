import { SiteGate } from "@/components/SiteGate";
import {
  getBackgroundHtml,
  getFooterAndUiHtml,
  getTrustModalsHtml,
} from "@/lib/legacy-html";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const backgroundHtml = getBackgroundHtml();
  const footerHtml = getFooterAndUiHtml() + getTrustModalsHtml();

  return (
    <SiteGate backgroundHtml={backgroundHtml} footerHtml={footerHtml}>
      {children}
    </SiteGate>
  );
}
