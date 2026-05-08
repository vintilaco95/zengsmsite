/**
 * După `next build`:
 * 1) Fișiere *.html minime în `out/` care fac redirect la rutele curate (fără dependență de Render).
 * 2) `out/blog-articol/index.html` pentru articole TechBlog (fetch live).
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

/** Pagini vechi „pagina.html” → redirect la ruta Next cu slash final. */
const LEGACY_HTML_FILES = [
  "blog",
  "contact",
  "despre",
  "formulare",
  "galerie",
  "gdpr",
  "intrebari-frecvente",
  "politica-confidentialitate",
  "preturi",
  "servicii",
  "termeni-conditii",
  "vanzare-telefon",
  "blog-articol",
];

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

function redirectStubHtml(targetPath) {
  const t = JSON.stringify(targetPath);
  return `<!DOCTYPE html><html lang="ro"><head>
<meta charset="utf-8">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${targetPath.replace(/"/g, "&quot;")}">
<meta http-equiv="refresh" content="0;url=${targetPath.replace(/"/g, "&quot;")}">
<script>location.replace(${t});</script>
<title>Redirect…</title>
</head><body style="font-family:system-ui,sans-serif;padding:2rem">
<p>Actualizare URL. Dacă nu te redirecționează automat: <a href="${targetPath.replace(/"/g, "&quot;")}">apasă aici</a>.</p>
</body></html>`;
}

const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://zengsm.ro").replace(
  /\/+$/,
  "",
);
const outRoot = path.join(root, "out");

if (!fs.existsSync(outRoot)) {
  console.warn("postbuild: lipsește out/ — rulează mai întâi next build.");
  process.exit(0);
}

for (const name of LEGACY_HTML_FILES) {
  const clean =
    name === "blog-articol"
      ? "/blog-articol/"
      : name === "blog"
        ? "/blog/"
        : `/${name}/`;
  const filePath = path.join(outRoot, `${name}.html`);
  fs.writeFileSync(filePath, redirectStubHtml(clean), "utf8");
  console.log("postbuild: alias redirect", filePath, "→", clean);
}

const artSrc = path.join(root, "legacy-pages/blog-articol.html");
const artDir = path.join(outRoot, "blog-articol");
const artDest = path.join(artDir, "index.html");
fs.mkdirSync(artDir, { recursive: true });
fs.writeFileSync(
  artDest,
  rewriteBlogArticHtml(fs.readFileSync(artSrc, "utf8"), base),
  "utf8",
);
console.log("postbuild: articol shell", artDest);
