import fs from "fs";
import path from "path";
import type {
  TechblogArticleRecord,
  TechblogManifest,
} from "@/lib/techblog-types";

const DATA_DIR = path.join(process.cwd(), "data", "techblog");
const MANIFEST = path.join(DATA_DIR, "manifest.json");
const ARTICLES_DIR = path.join(DATA_DIR, "articles");

export function techblogFileKeyForSlug(slug: string): string {
  return Buffer.from(String(slug), "utf8").toString("base64url");
}

export function loadTechblogManifest(): TechblogManifest {
  const empty: TechblogManifest = {
    fetchedAt: null,
    apiBase: "",
    bloggerSlug: "",
    blogger: null,
    articles: [],
  };
  if (!fs.existsSync(MANIFEST)) return empty;
  try {
    const raw = fs.readFileSync(MANIFEST, "utf8");
    const j = JSON.parse(raw) as TechblogManifest;
    if (!j || !Array.isArray(j.articles)) return empty;
    return j;
  } catch {
    return empty;
  }
}

export function loadTechblogArticle(slug: string): TechblogArticleRecord | null {
  const key = techblogFileKeyForSlug(slug);
  const p = path.join(ARTICLES_DIR, `${key}.json`);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as TechblogArticleRecord;
  } catch {
    return null;
  }
}

/** Cale URL cu trailing slash, aliniată la trailingSlash: true */
export function techblogArticleHref(slug: string): string {
  const parts = String(slug)
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent);
  if (!parts.length) return "/blog/";
  return `/blog/${parts.join("/")}/`;
}
