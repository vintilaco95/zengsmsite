/**
 * După `next build`, generează `out/blog-articol/index.html` din legacy (HTML pur + techblog-article.js).
 * Astfel /blog/:slug poate fi servit prin rewrite pe CDN fără hidratare Next pe URL „greșit”.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const FILE_TO_ROUTE = {
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

function escRe(s) {
  return s.replace(/-/g, "\\-");
}

function hrefPath(route) {
  if (route === "/") return "/";
  return `${route}/`;
}

function absUrlForRoute(siteBase, route) {
  if (route === "/") return `${siteBase}/`;
  return `${siteBase}${route}/`;
}

function rewriteBlogArticHtml(html, base) {
  let h = html;

  h = h.replace(/\bsrc=(["'])images\//gi, "src=$1/images/");
  h = h.replace(/\bhref=(["'])images\//gi, "href=$1/images/");
  h = h.replace(/\bsrc=(["'])scripts\//gi, "src=$1/scripts/");
  h = h.replace(/\bhref=(["'])css\//gi, "href=$1/css/");

  for (const [file, route] of Object.entries(FILE_TO_ROUTE)) {
    const e = escRe(file);
    const target = hrefPath(route);
    h = h.replace(
      new RegExp(`\\bhref=(["'])(?:\\.\\/)?${e}\\.html`, "gi"),
      `href=$1${target}`,
    );
    h = h.replace(
      new RegExp(`\\bhref=(["'])/${e}\\.html`, "gi"),
      `href=$1${target}`,
    );
  }

  for (const [file, route] of Object.entries(FILE_TO_ROUTE)) {
    const e = escRe(file);
    h = h.replace(
      new RegExp(`https?://(?:www\\.)?zengsm\\.ro/${e}\\.html`, "gi"),
      absUrlForRoute(base, route),
    );
  }

  h = h.replace(
    /data-zengsm-public-base="[^"]*"/,
    `data-zengsm-public-base="${base}"`,
  );

  return h;
}

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://zengsm.ro").replace(
  /\/+$/,
  "",
);
const outRoot = path.join(root, "out");
const src = path.join(root, "legacy-pages/blog-articol.html");
const outDir = path.join(outRoot, "blog-articol");
const dest = path.join(outDir, "index.html");

if (!fs.existsSync(outRoot)) {
  console.warn(
    "postbuild-blog-articol: lipsește out/ — săr peste (rulează next build mai întâi).",
  );
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
const raw = fs.readFileSync(src, "utf8");
fs.writeFileSync(dest, rewriteBlogArticHtml(raw, base), "utf8");
console.log("postbuild-blog-articol:", dest);
