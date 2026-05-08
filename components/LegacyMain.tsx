import { getMainHtml } from "@/lib/legacy-html";

export function LegacyMain({ legacyFile }: { legacyFile: string }) {
  const html = getMainHtml(legacyFile);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
