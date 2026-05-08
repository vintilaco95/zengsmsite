/**
 * La build: citește toate paginile din /api/embed/blogger/:slug și salvează
 * manifest + câte un JSON per articol (conținut HTML) pentru SSG pe zengsm.ro.
 *
 * Env:
 *   TECHBLOG_API_BASE   (default https://www.e-gsm.ro)
 *   TECHBLOG_BLOGGER_SLUG (default andreea)
 *   TECHBLOG_SKIP_SYNC=1 — nu apelează API; necesită data/techblog/manifest.json existent
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data", "techblog");
const articlesDir = path.join(dataDir, "articles");

const apiBase = String(process.env.TECHBLOG_API_BASE || "https://www.e-gsm.ro").replace(
  /\/+$/,
  "",
);
const bloggerSlug = String(process.env.TECHBLOG_BLOGGER_SLUG || "andreea").trim();
const skip = /^1|true|yes$/i.test(String(process.env.TECHBLOG_SKIP_SYNC || "").trim());

function fileKeyForSlug(slug) {
  return Buffer.from(String(slug), "utf8").toString("base64url");
}

async function fetchJson(url) {
  const r = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const body = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, body };
}

if (skip) {
  const manifestPath = path.join(dataDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(
      "fetch-techblog: TECHBLOG_SKIP_SYNC dar lipsește data/techblog/manifest.json",
    );
    process.exit(1);
  }
  console.log("fetch-techblog: skip sincronizare (TECHBLOG_SKIP_SYNC)");
  process.exit(0);
}

if (!bloggerSlug) {
  console.error("fetch-techblog: TECHBLOG_BLOGGER_SLUG gol");
  process.exit(1);
}

fs.mkdirSync(articlesDir, { recursive: true });

let bloggerMeta = null;
let currentPage = 1;
let totalPages = 1;
const allSummaries = [];

while (currentPage <= totalPages) {
  const url = `${apiBase}/api/embed/blogger/${encodeURIComponent(bloggerSlug)}?page=${currentPage}&limit=30`;
  const res = await fetchJson(url);
  if (!res.ok || !res.body.ok) {
    console.error(
      "fetch-techblog: feed blogger eșuat",
      url,
      res.status,
      res.body?.error || res.body,
    );
    process.exit(1);
  }
  bloggerMeta = res.body.blogger || bloggerMeta;
  totalPages = Number(res.body.pages) || 1;
  const list = res.body.articles || [];
  allSummaries.push(...list);
  currentPage += 1;
}

const seen = new Set();
const unique = [];
for (const a of allSummaries) {
  const s = String(a?.slug || "").trim();
  if (!s || seen.has(s)) continue;
  seen.add(s);
  unique.push(a);
}

console.log("fetch-techblog:", unique.length, "articole unice");

for (let i = 0; i < unique.length; i++) {
  const slug = String(unique[i].slug).trim();
  const url = `${apiBase}/api/embed/article/${encodeURIComponent(slug)}?bloggerSlug=${encodeURIComponent(bloggerSlug)}`;
  const res = await fetchJson(url);
  if (!res.ok || !res.body.ok || !res.body.article) {
    console.error(
      "fetch-techblog: articol eșuat",
      slug,
      res.status,
      res.body?.error || "",
    );
    process.exit(1);
  }
  const key = fileKeyForSlug(slug);
  fs.writeFileSync(
    path.join(articlesDir, `${key}.json`),
    JSON.stringify(res.body.article),
    "utf8",
  );
  await new Promise((r) => setTimeout(r, 75));
}

const manifest = {
  fetchedAt: new Date().toISOString(),
  apiBase,
  bloggerSlug,
  blogger: bloggerMeta,
  articles: unique,
};

fs.writeFileSync(path.join(dataDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log("fetch-techblog: scris data/techblog/manifest.json +", unique.length, "fișiere în articles/");
