import { AppProviders } from "@/components/AppProviders";
import { SiteGate } from "@/components/SiteGate";
import { getBackgroundHtml, getFooterAndUiHtml } from "@/lib/legacy-html";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const backgroundHtml = getBackgroundHtml();
  const footerHtml = getFooterAndUiHtml();

  return (
    <AppProviders>
      <SiteGate backgroundHtml={backgroundHtml} footerHtml={footerHtml}>
        {children}
      </SiteGate>
    </AppProviders>
  );
}
