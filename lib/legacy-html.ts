import fs from "fs";
import path from "path";
import { rewriteLegacyHtml } from "./html-rewrite";

const LEGACY_DIR = path.join(process.cwd(), "legacy-pages");

function read(file: string): string {
  return fs.readFileSync(path.join(LEGACY_DIR, file), "utf8");
}

let indexCache: string | null = null;
function indexHtml(): string {
  if (!indexCache) indexCache = read("index.html");
  return indexCache;
}

export function getBackgroundHtml(): string {
  const raw = indexHtml();
  const navStart = raw.indexOf('<nav class="navbar">');
  const s = raw.indexOf('<div class="background-animation">');
  if (s === -1 || navStart === -1 || s > navStart) return "";
  return rewriteLegacyHtml(raw.slice(s, navStart).trim());
}

export function getFooterAndUiHtml(): string {
  const raw = indexHtml();
  const s = raw.indexOf('<footer class="footer">');
  const script = raw.indexOf("<script", s);
  if (s === -1 || script === -1) return "";
  return rewriteLegacyHtml(raw.slice(s, script).trim());
}

/** Modale calculator + status (model TrustGSM: HTML static + script.js). */
export function getTrustModalsHtml(): string {
  const raw = read("zengsm-trust-modals.html");
  return rewriteLegacyHtml(raw.trim());
}

/** Conținut principal între </nav> și <footer> dintr-o pagină veche. */
export function getMainHtml(legacyFile: string): string {
  const raw = read(legacyFile);
  const navEnd = raw.indexOf("</nav>");
  const foot = raw.indexOf("<footer", navEnd);
  if (navEnd === -1 || foot === -1) {
    throw new Error(`Nu pot extrage main din ${legacyFile}`);
  }
  const mid = raw.slice(navEnd + "</nav>".length, foot).trim();
  return rewriteLegacyHtml(mid);
}

export function extractJsonLdBlocks(sourceFile: string): string[] {
  const raw = read(sourceFile);
  const out: string[] = [];
  const re = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const t = m[1].trim();
    if (t.startsWith("{")) out.push(t);
  }
  return out;
}
