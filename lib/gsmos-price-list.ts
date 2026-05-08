/** Date „GSM OS” — același API ca vechiul calculator, dar fără DOM / script injectat. */

export const GSMOS_PUBLIC_PRICE_LIST_URL =
  "https://gsmos.ro/api/public/price-list";

export type PriceRow = {
  brand: string;
  model: string;
  repair: string;
  p: number;
  m: number;
};

export type PriceListPayload = {
  rows: PriceRow[];
  currency: string;
};

export function flattenPriceListJson(json: unknown): PriceListPayload {
  if (!json || typeof json !== "object") return { rows: [], currency: "RON" };
  const o = json as Record<string, unknown>;
  const currency =
    String(o.currency || "RON")
      .trim()
      .toUpperCase() || "RON";
  const out: PriceRow[] = [];
  const groups = Array.isArray(o.groups) ? o.groups : [];
  for (const g of groups) {
    if (!g || typeof g !== "object") continue;
    const gr = g as Record<string, unknown>;
    const brand =
      String(gr.brand || "").trim() ||
      String(gr.deviceType || "").trim() ||
      "—";
    const model = String(gr.model || "").trim();
    const items = Array.isArray(gr.items) ? gr.items : [];
    for (const it of items) {
      if (!it || typeof it !== "object") continue;
      const item = it as Record<string, unknown>;
      if (item.isActive === false) continue;
      const repair = String(item.serviceOperation || "").trim();
      if (!repair) continue;
      out.push({
        brand,
        model,
        repair,
        p: Number(item.partsCost) || 0,
        m: Number(item.labourCost) || 0,
      });
    }
  }
  return { rows: out, currency };
}

export async function fetchPriceList(token: string): Promise<PriceListPayload> {
  const t = token.trim();
  if (!t) return { rows: [], currency: "RON" };
  const r = await fetch(GSMOS_PUBLIC_PRICE_LIST_URL, {
    headers: { Authorization: "Bearer " + t },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return flattenPriceListJson(await r.json());
}

export function norm(s: string): string {
  return String(s || "")
    .trim()
    .toLowerCase();
}

export function listBrands(rows: PriceRow[]): [string, string][] {
  const map = new Map<string, string>();
  for (const x of rows) {
    const k = norm(x.brand);
    if (k && !map.has(k)) map.set(k, x.brand.trim());
  }
  return [...map.entries()].sort((a, b) =>
    a[1].localeCompare(b[1], "ro", { sensitivity: "base" }),
  );
}

export function listModels(rows: PriceRow[], brandKey: string): string[] {
  const s = new Set<string>();
  for (const x of rows) {
    if (norm(x.brand) === brandKey) s.add(x.model);
  }
  return [...s].sort((a, b) =>
    String(a).localeCompare(String(b), "ro", { sensitivity: "base" }),
  );
}

export function listRepairs(
  rows: PriceRow[],
  brandKey: string,
  model: string,
): string[] {
  const s = new Set<string>();
  for (const x of rows) {
    if (norm(x.brand) === brandKey && x.model === model) s.add(x.repair);
  }
  return [...s].sort((a, b) =>
    String(a).localeCompare(String(b), "ro", { sensitivity: "base" }),
  );
}

export function findPrice(
  rows: PriceRow[],
  brandKey: string,
  model: string,
  repair: string,
): Pick<PriceRow, "p" | "m"> & { t: number } | null {
  const x = rows.find(
    (q) =>
      norm(q.brand) === brandKey && q.model === model && q.repair === repair,
  );
  if (!x) return null;
  return { p: x.p, m: x.m, t: x.p + x.m };
}

/** Simple Icons CDN — aceleași mapping-uri ca în scriptul vechi. */
const SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org";

const SIMPLE_ICONS_SLUGS: Record<string, string> = {
  apple: "apple",
  samsung: "samsung",
  xiaomi: "xiaomi",
  huawei: "huawei",
  oppo: "oppo",
  vivo: "vivo",
  honor: "honor",
  motorola: "motorola",
  google: "google",
  "google pixel": "google",
  pixel: "google",
  oneplus: "oneplus",
  realme: "realme",
  nokia: "nokia",
  sony: "sony",
  lg: "lg",
  nothing: "nothing",
  infinix: "infinix",
  tecno: "tecno",
  asus: "asus",
  lenovo: "lenovo",
  dell: "dell",
  hp: "hp",
  acer: "acer",
  msi: "msi",
  razer: "razer",
  blackberry: "blackberry",
  android: "android",
  poco: "xiaomi",
  redmi: "xiaomi",
};

function normalizeBrandForLogo(brandName: string): string {
  return String(brandName || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[ăâ]/g, "a")
    .replace(/[î]/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t");
}

function findBrandLogoKey(normalized: string): string | null {
  if (SIMPLE_ICONS_SLUGS[normalized]) return normalized;
  const noSpaces = normalized.replace(/\s+/g, "");
  if (SIMPLE_ICONS_SLUGS[noSpaces]) return noSpaces;
  for (const key of Object.keys(SIMPLE_ICONS_SLUGS)) {
    if (normalized.includes(key) || key.includes(normalized)) return key;
  }
  return null;
}

export function brandLogoUrl(
  brandLabel: string,
  colorHex: string = "ffffff",
): string | null {
  const n = normalizeBrandForLogo(brandLabel);
  if (!n) return null;
  const key = findBrandLogoKey(n);
  const slug = key ? SIMPLE_ICONS_SLUGS[key] : undefined;
  if (!slug) return null;
  return `${SIMPLE_ICONS_CDN}/${slug}/${colorHex}`;
}

export function repairEmojiHint(repair: string): string {
  const r = norm(repair);
  const rules: { keys: string[]; emoji: string }[] = [
    {
      keys: ["display", "ecran", "lcd", "oled", "screen", "touch"],
      emoji: "📱",
    },
    { keys: ["bater", "acumulator", "battery"], emoji: "🔋" },
    { keys: ["camer", "camera", "lens", "obiectiv"], emoji: "📷" },
    { keys: ["spate", "back glass", "capac"], emoji: "⬜" },
    {
      keys: ["incarc", "încărc", "charging", "mufă", "port", "conector"],
      emoji: "🔌",
    },
    {
      keys: ["jack", "audio", "microfon", "difuzor", "speaker", "sunet"],
      emoji: "🔊",
    },
    {
      keys: ["software", "flash", "ios", "android", "unlock", "debloc"],
      emoji: "💾",
    },
    {
      keys: ["buton", "home", "power", "volum", "volume", "flex"],
      emoji: "🔘",
    },
    { keys: ["face id", "faceid", "senzor"], emoji: "👤" },
    { keys: ["wifi", "bluetooth", "antena", "semnal"], emoji: "📶" },
    { keys: ["apa", "lichid", "oxid"], emoji: "💧" },
    { keys: ["rame", "frame", "carcas"], emoji: "📦" },
  ];
  for (const rule of rules) {
    if (rule.keys.some((k) => r.includes(k))) return rule.emoji;
  }
  return "🔧";
}

export function defaultPriceListToken(): string {
  return (
    process.env.NEXT_PUBLIC_GSMOS_PRICE_LIST_TOKEN?.trim() ||
    "gsmos_pl_Hr6McQfzQCTohjdMrZWNA2KtAMWszKup8Ul3uuXkeAU"
  );
}
