#!/usr/bin/env node
/**
 * Generează sitemap.xml canonic (fără .html), cu pagini statice + articole din data/techblog/manifest.json.
 * Apelat din postbuild după `next build`; scrie în `out/sitemap.xml` (dacă există) și `public/sitemap.xml`.
 *
 * Baza URL: NEXT_PUBLIC_SITE_URL | SITE_URL | ZENGSM_SITE_URL | https://zengsm.ro
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function escapeXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;");
}

function siteBase() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.ZENGSM_SITE_URL ||
    "https://zengsm.ro";
  return String(raw).replace(/\/+$/, "");
}

/** Aliniat la lib/techblog-data.ts — trailingSlash: true */
function articleUrlPath(slug) {
  const parts = String(slug || "")
    .split("/")
    .filter(Boolean)
    .map((p) => encodeURIComponent(p));
  if (!parts.length) return "/blog/";
  return `/blog/${parts.join("/")}/`;
}

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/servicii/", priority: "0.9", changefreq: "monthly" },
  { path: "/preturi/", priority: "0.9", changefreq: "monthly" },
  { path: "/formulare/", priority: "0.85", changefreq: "monthly" },
  { path: "/galerie/", priority: "0.75", changefreq: "monthly" },
  { path: "/despre/", priority: "0.75", changefreq: "monthly" },
  { path: "/blog/", priority: "0.9", changefreq: "weekly" },
  { path: "/intrebari-frecvente/", priority: "0.7", changefreq: "monthly" },
  { path: "/contact/", priority: "0.85", changefreq: "monthly" },
  { path: "/termeni-conditii/", priority: "0.35", changefreq: "yearly" },
  { path: "/politica-confidentialitate/", priority: "0.35", changefreq: "yearly" },
  { path: "/gdpr/", priority: "0.35", changefreq: "yearly" },
];

export function generateSitemapFiles(rootDir) {
  const base = siteBase();
  const today = new Date().toISOString().slice(0, 10);
  /** @type {{ loc: string; lastmod: string; changefreq: string; priority: string }[]} */
  const urls = [];

  for (const p of STATIC_PAGES) {
    urls.push({
      loc: `${base}${p.path}`,
      lastmod: today,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  const manifestPath = path.join(rootDir, "data", "techblog", "manifest.json");
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (manifest && Array.isArray(manifest.articles)) {
        for (const a of manifest.articles) {
          if (!a || !a.slug) continue;
          const pathPart = articleUrlPath(a.slug);
          let lastmod = today;
          if (a.publishedAt) {
            const d = String(a.publishedAt).slice(0, 10);
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) lastmod = d;
          }
          urls.push({
            loc: `${base}${pathPart}`,
            lastmod,
            changefreq: "monthly",
            priority: "0.75",
          });
        }
      }
    } catch (e) {
      console.warn("generate-sitemap: manifest.json invalid", e.message);
    }
  }

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${escapeXml(u.changefreq)}</changefreq>
    <priority>${escapeXml(u.priority)}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${body}
</urlset>
`;

  const outDir = path.join(rootDir, "out");
  const outPath = path.join(outDir, "sitemap.xml");
  const publicPath = path.join(rootDir, "public", "sitemap.xml");

  if (fs.existsSync(outDir)) {
    fs.writeFileSync(outPath, xml, "utf8");
    console.log("postbuild: sitemap.xml →", outPath, `(${urls.length} URL)`);
  }

  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.writeFileSync(publicPath, xml, "utf8");
  console.log("sitemap: public/sitemap.xml (" + urls.length + " URL, base=" + base + ")");
}

const isMain =
  typeof process.argv[1] === "string" &&
  process.argv[1].includes("generate-sitemap.mjs");
if (isMain) {
  const root = path.join(__dirname, "..");
  generateSitemapFiles(root);
}
