import { getMainHtml } from "@/lib/legacy-html";

type Props = { legacyFile: string; className?: string };

export function LegacyMain({ legacyFile, className }: Props) {
  const html = getMainHtml(legacyFile);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
