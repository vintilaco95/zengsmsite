export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://zengsm.ro";
  return String(raw).replace(/\/+$/, "");
}
