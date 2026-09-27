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

const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  let last = { ok: false, status: 0, body: {} };
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const r = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      const body = await r.json().catch(() => ({}));
      last = { ok: r.ok, status: r.status, body };
      if (r.ok || !RETRY_STATUSES.has(r.status)) return last;
    } catch (err) {
      last = { ok: false, status: 0, body: { error: err?.message || String(err) } };
    }
    if (attempt < 4) {
      console.warn(
        "fetch-techblog: reîncerc",
        attempt,
        url,
        last.status || last.body?.error,
      );
      await sleep(1500 * attempt);
    }
  }
  return last;
}

/** Feed-ul e opțional: un 503 de la e-gsm.ro nu trebuie să oprească deploy-ul site-ului. */
function continueWithoutFeed(reason) {
  const manifestPath = path.join(dataDir, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    console.warn(
      "fetch-techblog: păstrez manifestul existent, sincronizarea a eșuat:",
      reason,
    );
    process.exit(0);
  }
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        fetchedAt: null,
        apiBase,
        bloggerSlug,
        blogger: null,
        articles: [],
        syncError: reason,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.warn(
    "fetch-techblog: feed indisponibil, build-ul continuă fără articole:",
    reason,
  );
  process.exit(0);
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
    continueWithoutFeed(
      `${url} ${res.status} ${JSON.stringify(res.body?.error || res.body || {})}`,
    );
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
    continueWithoutFeed(
      `articol ${slug} ${res.status} ${res.body?.error || ""}`,
    );
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
