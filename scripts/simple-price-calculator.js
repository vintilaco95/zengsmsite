/**
 * Calculator — API GSM OS. Completează TOKEN mai jos. Fără .env.
 */
const API_URL = "https://gsmos.ro/api/public/price-list";
const TOKEN = "gsmos_pl_NDiBuubCpqJHtqWe2LIoc8EMsSAnPMW4yQIyUhbj8PM";

let rows = [];
let moneda = "RON";

function norm(s) {
  return String(s || "").trim().toLowerCase();
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function encModel(m) {
  return m === "" ? "__E__" : m;
}
function decModel(v) {
  return v === "__E__" ? "" : v;
}

function flat(json) {
  if (!json || typeof json !== "object") return [];
  moneda = String(json.currency || "RON").trim().toUpperCase() || "RON";
  const out = [];
  for (const g of json.groups || []) {
    const b = String(g.brand || "").trim() || String(g.deviceType || "").trim() || "—";
    const model = String(g.model || "").trim();
    for (const it of g.items || []) {
      if (it && it.isActive === false) continue;
      const r = String(it.serviceOperation || "").trim();
      if (!r) continue;
      out.push({
        brand: b,
        model,
        repair: r,
        p: Number(it.partsCost) || 0,
        m: Number(it.labourCost) || 0,
      });
    }
  }
  return out;
}

async function load() {
  if (!TOKEN.trim()) return false;
  const r = await fetch(API_URL, {
    headers: { Authorization: "Bearer " + TOKEN.trim() },
  });
  if (!r.ok) throw new Error("HTTP " + r.status);
  rows = flat(await r.json());
  return rows.length > 0;
}

function listBrands() {
  const map = new Map();
  for (const x of rows) {
    const k = norm(x.brand);
    if (k && !map.has(k)) map.set(k, x.brand.trim());
  }
  return [...map.entries()].sort((a, b) =>
    a[1].localeCompare(b[1], "ro", { sensitivity: "base" })
  );
}

function listModels(brandKey) {
  const s = new Set();
  for (const x of rows) {
    if (norm(x.brand) === brandKey) s.add(x.model);
  }
  return [...s].sort((a, b) =>
    String(a).localeCompare(String(b), "ro", { sensitivity: "base" })
  );
}

function listRepairs(brandKey, model) {
  const s = new Set();
  for (const x of rows) {
    if (norm(x.brand) === brandKey && x.model === model) s.add(x.repair);
  }
  return [...s].sort((a, b) =>
    String(a).localeCompare(String(b), "ro", { sensitivity: "base" })
  );
}

function calc(brandKey, model, repair) {
  const x = rows.find(
    (q) => norm(q.brand) === brandKey && q.model === model && q.repair === repair
  );
  if (!x) return null;
  return { p: x.p, m: x.m, t: x.p + x.m };
}

function waMsg(bl, ml, rl, p, m, t) {
  return `Bună ziua! 

Am folosit calculatorul de pe zengsm.ro:

📱 ${bl} / ${ml} — ${rl}
💰 ${p} + ${m} = ${t} ${moneda}

Aș dori detalii. Mulțumesc!`;
}

function showRez(el, o) {
  if (!o) {
    el.innerHTML = `<div class="result-placeholder"><div class="placeholder-icon">ℹ️</div><h3>Fără preț pentru combinația aleasă</h3><p>Contactează-ne.</p></div>`;
    return;
  }
  const { bl, ml, rl, p, m, t } = o;
  const u = `https://wa.me/40758060072?text=${encodeURIComponent(waMsg(bl, ml, rl, p, m, t))}`;
  el.innerHTML = `
    <div class="result-card">
      <h3 style="color:white;font-weight:800">Estimare</h3>
      <ul class="result-list">
        <li><strong>Marcă:</strong> ${esc(bl)}</li>
        <li><strong>Model:</strong> ${esc(ml)}</li>
        <li><strong>Reparație:</strong> ${esc(rl)}</li>
        <li><strong>Componentă:</strong> ${p} ${moneda}</li>
        <li><strong>Manoperă:</strong> ${m} ${moneda}</li>
      </ul>
      <div class="result-total">Total: <strong>${t} ${moneda}</strong></div>
      <a href="${u}" target="_blank" rel="noopener" class="btn btn-primary btn-large calculator-whatsapp-btn">WhatsApp</a>
      <p class="result-note" style="color:white;font-weight:800">Preț orientativ.</p>
    </div>`;
}

function ph() {
  return `<div class="result-placeholder"><div class="placeholder-icon">💰</div><h3>Prețul apare aici</h3><p>Completează formularul.</p></div>`;
}

function startCalc() {
  const bEl = document.getElementById("phone-brand");
  const mEl = document.getElementById("phone-model");
  const rEl = document.getElementById("repair-type");
  const btn = document.getElementById("calculate-price");
  const out = document.getElementById("calculator-result");
  if (!bEl || !mEl || !rEl || !btn || !out) return;

  function fillBrands() {
    bEl.innerHTML = "";
    const pho = document.createElement("option");
    pho.value = "";
    pho.textContent = "Selectează marca";
    bEl.appendChild(pho);
    for (const [k, lab] of listBrands()) {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = lab;
      bEl.appendChild(o);
    }
  }

  function fillModels() {
    const bk = bEl.value;
    const list = listModels(bk);
    mEl.innerHTML = "";
    if (!bk || !list.length) {
      mEl.disabled = true;
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "Selectează mai întâi marca";
      mEl.appendChild(o);
      return;
    }
    mEl.disabled = false;
    const p = document.createElement("option");
    p.value = "";
    p.textContent = "Selectează modelul";
    mEl.appendChild(p);
    for (const mod of list) {
      const o = document.createElement("option");
      o.value = encModel(mod);
      o.textContent = mod === "" ? "(fără model)" : mod;
      mEl.appendChild(o);
    }
  }

  function fillRepairs() {
    const bk = bEl.value;
    const mod = decModel(mEl.value);
    const list = listRepairs(bk, mod);
    rEl.innerHTML = "";
    if (!mEl.value || !list.length) {
      rEl.disabled = true;
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "Selectează mai întâi modelul";
      rEl.appendChild(o);
      return;
    }
    rEl.disabled = false;
    const p = document.createElement("option");
    p.value = "";
    p.textContent = "Tip reparație";
    rEl.appendChild(p);
    for (const rep of list) {
      const o = document.createElement("option");
      o.value = rep;
      o.textContent = rep;
      rEl.appendChild(o);
    }
  }

  fillBrands();
  fillModels();
  fillRepairs();

  bEl.addEventListener("change", () => {
    fillModels();
    rEl.innerHTML = '<option value="">Selectează mai întâi modelul</option>';
    rEl.disabled = true;
    out.innerHTML = ph();
  });
  mEl.addEventListener("change", () => {
    fillRepairs();
    out.innerHTML = ph();
  });
  btn.addEventListener("click", () => {
    const bk = bEl.value;
    const bl = bEl.options[bEl.selectedIndex]?.text || "";
    const mod = decModel(mEl.value);
    const rk = rEl.value;
    const rl = rEl.options[rEl.selectedIndex]?.text || "";
    if (!bk || !mEl.value || !rk) {
      showRez(out, null);
      return;
    }
    const z = calc(bk, mod, rk);
    if (!z) {
      showRez(out, null);
      return;
    }
    showRez(out, {
      bl,
      ml: mod === "" ? "—" : mod,
      rl,
      p: z.p,
      m: z.m,
      t: z.t,
    });
  });
}

async function init() {
  const out = document.getElementById("calculator-result");
  if (out) {
    out.innerHTML = `<div class="result-placeholder" role="status"><div class="placeholder-icon">⏳</div><h3>Se încarcă…</h3><p>GSM OS</p></div>`;
  }
  let ok = false;
  try {
    if (TOKEN.trim()) ok = await load();
  } catch (e) {
    console.error(e);
    rows = [];
  }
  if (out) {
    if (!TOKEN.trim()) {
      out.innerHTML = `<div class="result-placeholder" role="alert"><div class="placeholder-icon">⚠️</div><h3>Lipsește token</h3><p>Deschide <code>scripts/simple-price-calculator.js</code> și pune valoarea în <code>TOKEN</code>.</p></div>`;
    } else if (!ok) {
      out.innerHTML = `<div class="result-placeholder" role="alert"><div class="placeholder-icon">⚠️</div><h3>Nu s-a încărcat lista</h3><p>Verifică token, CORS în GSM OS, reîncearcă.</p></div>`;
    } else {
      out.innerHTML = ph();
    }
  }
  if (ok) startCalc();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
