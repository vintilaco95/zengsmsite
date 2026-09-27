/** Trimitere lead din calculatorul de prețuri către gsmOS. Cheia e publică (doar scrie, nu citește). */

export const GSMOS_LEADS_SUBMIT_URL =
  "https://gsmos.ro/api/public/leads/v1/submit";

export function leadFormKey(): string {
  return (
    process.env.NEXT_PUBLIC_GSMOS_LEAD_FORM_KEY?.trim() ||
    "gsmos_lf_pk_H0UYv0_Nm-arzGOv8T9Ek1LY"
  );
}

export function isLeadPhone(raw: string): boolean {
  const digits = String(raw || "").replace(/[^\d+]/g, "");
  if (digits.length < 6 || digits.length > 16) return false;
  let n = digits;
  if (n.startsWith("00")) n = `+${n.slice(2)}`;
  if (!n.startsWith("+")) {
    if (n.startsWith("0")) n = `+4${n}`;
    else if (n.startsWith("40")) n = `+${n}`;
    else n = `+40${n}`;
  }
  return /^\+40(7\d{8}|[23]\d{7,8})$/.test(n) || /^\+[1-9]\d{9,14}$/.test(n);
}

function idempotencyKey(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export type PriceLeadInput = {
  name: string;
  phone: string;
  brand: string;
  model: string;
  repair: string;
  price: number;
  itemId?: string;
  elapsedMs: number;
  honeypot?: string;
};

export async function submitPriceLead(
  input: PriceLeadInput,
): Promise<{ ref: string; message: string }> {
  const body: Record<string, unknown> = {
    formKey: leadFormKey(),
    idempotencyKey: idempotencyKey(),
    fields: {
      nume: input.name.trim(),
      telefon: input.phone.trim(),
      marca: input.brand,
      model: input.model,
      defect: input.repair,
      pret_afisat: String(input.price),
    },
    meta: {
      pageUrl: window.location.href.slice(0, 500),
      referrer: document.referrer.slice(0, 500),
      locale: (navigator.language || "").slice(0, 20),
      elapsedMs: input.elapsedMs,
      hp: input.honeypot || "",
    },
  };
  if (input.itemId && /^[a-f0-9]{24}$/i.test(input.itemId)) {
    body.priceItemId = input.itemId.toLowerCase();
  }

  const res = await fetch(GSMOS_LEADS_SUBMIT_URL, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    ref?: string;
    message?: string;
    error?: string;
  };
  if (res.ok && data.ok) {
    return {
      ref: data.ref || "",
      message: data.message || "Mulțumim! Te contactăm în cel mai scurt timp.",
    };
  }
  if (data.error === "origin_not_allowed") {
    throw new Error("Solicitarea nu a putut fi trimisă de pe acest site.");
  }
  throw new Error(
    data.message ||
      (res.status === 429
        ? "Prea multe cereri. Încearcă din nou în câteva minute."
        : "Nu am putut trimite solicitarea."),
  );
}
