#!/usr/bin/env node
/**
 * @deprecated Folosește `npm run sitemap` sau postbuild (`scripts/generate-sitemap.mjs`),
 * care include paginile statice + articolele din manifest (URL-uri /.../ fără .html).
 *
 * Generează sitemap-blog.xml cu toate URL-urile canonic /blog/:slug
 *
 * Rulare (din rădăcina zengsm):
 *   ZENGSM_SITE_URL=https://zengsm.ro node scripts/generate-blog-sitemap.mjs
 *
 * Opțional:
 *   ZENGSM_TECHBLOG_API=https://www.e-gsm.ro
 *   ZENGSM_BLOGGER_SLUG=andreea
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const API = (process.env.ZENGSM_TECHBLOG_API || 'https://www.e-gsm.ro').replace(/\/+$/, '');
const BLOGGER = process.env.ZENGSM_BLOGGER_SLUG || 'andreea';
const SITE = (process.env.ZENGSM_SITE_URL || 'https://zengsm.ro').replace(/\/+$/, '');

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');
}

async function main() {
  const urls = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE}/blog.html`, priority: '0.9', changefreq: 'weekly' },
  ];

  let page = 1;
  let totalPages = 1;
  do {
    const r = await fetch(
      `${API}/api/embed/blogger/${encodeURIComponent(BLOGGER)}?page=${page}&limit=30`,
      { headers: { Accept: 'application/json' } }
    );
    const j = await r.json();
    if (!r.ok || !j.ok) {
      throw new Error(`API embed: ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
    }
    totalPages = j.pages || 1;
    for (const a of j.articles || []) {
      if (a.slug) {
        urls.push({
          loc: `${SITE}/blog/${encodeURI(a.slug)}`,
          priority: '0.75',
          changefreq: 'weekly',
        });
      }
    }
    page += 1;
  } while (page <= totalPages);

  const now = new Date().toISOString().slice(0, 10);
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  await fs.writeFile(path.join(ROOT, 'sitemap-blog.xml'), xml, 'utf8');
  console.log(`sitemap-blog.xml: ${urls.length} URL-uri (SITE=${SITE})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
