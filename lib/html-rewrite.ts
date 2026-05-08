/** Mapează fișiere .html vechi → rute Next (fără .html). */
const FILE_TO_ROUTE: Record<string, string> = {
  index: "/",
  blog: "/blog",
  contact: "/contact",
  despre: "/despre",
  formulare: "/formulare",
  galerie: "/galerie",
  gdpr: "/gdpr",
  "intrebari-frecvente": "/intrebari-frecvente",
  "politica-confidentialitate": "/politica-confidentialitate",
  preturi: "/preturi",
  servicii: "/servicii",
  "termeni-conditii": "/termeni-conditii",
  "vanzare-telefon": "/vanzare-telefon",
  "blog-articol": "/blog",
};

function escRe(s: string) {
  return s.replace(/-/g, "\\-");
}

/** Rescrie href și src din fragmentele HTML extrase din site-ul vechi. */
export function rewriteLegacyHtml(html: string): string {
  let h = html;

  h = h.replace(/\bsrc=(["'])images\//gi, "src=$1/images/");
  h = h.replace(/\bhref=(["'])images\//gi, "href=$1/images/");
  h = h.replace(/\bsrc=(["'])scripts\//gi, "src=$1/scripts/");
  h = h.replace(/\bhref=(["'])css\//gi, "href=$1/css/");

  for (const [file, route] of Object.entries(FILE_TO_ROUTE)) {
    const e = escRe(file);
    h = h.replace(
      new RegExp(`\\bhref=(["'])(?:\\.\\/)?${e}\\.html`, "gi"),
      `href=$1${route}`,
    );
    h = h.replace(
      new RegExp(`\\bhref=(["'])/${e}\\.html`, "gi"),
      `href=$1${route}`,
    );
  }

  return h;
}

/** Rescrie legăturile din conținutul articolului TechBlog (în body). */
export function rewriteArticleHtmlInner(html: string): string {
  const toClean = (slug: string) =>
    `/blog/${String(slug)
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/")}`;
  return String(html || "")
    .replace(/href=(["'])https?:\/\/(?:www\.)?e-gsm\.ro\/articol\/([^"']*)/gi, (_m, q, rest) => {
      const slug = String(rest).split(/[#?]/)[0].replace(/\/+$/, "");
      return `href=${q}${toClean(slug)}${q}`;
    })
    .replace(/href=(["'])\/articol\/([^"']*)/gi, (_m, q, rest) => {
      const slug = String(rest).split(/[#?]/)[0].replace(/\/+$/, "");
      return `href=${q}${toClean(slug)}${q}`;
    })
    .replace(
      /href=(["'])blog-articol\.html\?slug=([^&"'#]+)(?:&blogger=[^"'#]+)?/gi,
      (_m, q, slugEnc) => {
        try {
          const slug = decodeURIComponent(String(slugEnc));
          return `href=${q}${toClean(slug)}${q}`;
        } catch {
          return `href=${q}/blog/${slugEnc}${q}`;
        }
      },
    );
}
