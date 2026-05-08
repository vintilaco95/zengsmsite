import { getLegacyFragmentHtml, getMainHtml } from "@/lib/legacy-html";

type Props = {
  legacyFile: string;
  className?: string;
  /** Dacă true, fișierul este doar fragment (ex. secțiuni extra), fără <nav>/<footer>. */
  fragment?: boolean;
};

export function LegacyMain({ legacyFile, className, fragment }: Props) {
  const html = fragment
    ? getLegacyFragmentHtml(legacyFile)
    : getMainHtml(legacyFile);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
