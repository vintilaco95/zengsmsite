/**
 * Calculator preț reparații — API GSM OS. Wizard card-based (ZENGSM).
 */
const API_URL = "https://gsmos.ro/api/public/price-list";
const TOKEN = "gsmos_pl_NDiBuubCpqJHtqWe2LIoc8EMsSAnPMW4yQIyUhbj8PM";

/** @type {{ brand: string, model: string, repair: string, p: number, m: number }[]} */
let rows = [];
let moneda = "RON";

/** Logo-uri brand: Simple Icons CDN (ca pe telefoanebeius — cdn.simpleicons.org) */
const SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org";

/** Slug Simple Icons: cheie = brand normalizat (fără spații diacritice) */
const SIMPLE_ICONS_SLUGS = {
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

const state = {
  step: 1,
  brandKey: "",
  brandLabel: "",
  model: null,
  repair: "",
};

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
    const b =
      String(g.brand || "").trim() ||
      String(g.deviceType || "").trim() ||
      "—";
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
    (q) =>
      norm(q.brand) === brandKey &&
      q.model === model &&
      q.repair === repair
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
  return `<div class="result-placeholder"><div class="placeholder-icon">💰</div><h3>Prețul apare aici</h3><p>Alege marca, modelul și reparația.</p></div>`;
}

function normalizeBrandForLogo(brandName) {
  return String(brandName || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[ăâ]/g, "a")
    .replace(/[î]/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t");
}

function findBrandLogoKey(normalized) {
  if (SIMPLE_ICONS_SLUGS[normalized]) return normalized;
  const noSpaces = normalized.replace(/\s+/g, "");
  if (SIMPLE_ICONS_SLUGS[noSpaces]) return noSpaces;
  for (const key of Object.keys(SIMPLE_ICONS_SLUGS)) {
    if (normalized.includes(key) || key.includes(normalized)) return key;
  }
  return null;
}

/**
 * URL logo Simple Icons (fundal închis → icon alb)
 * @param {string} brandLabel
 * @param {string} colorHex fără #
 */
function brandCdnLogoUrl(brandLabel, colorHex = "ffffff") {
  const n = normalizeBrandForLogo(brandLabel);
  if (!n) return null;
  const key = findBrandLogoKey(n);
  const slug = key ? SIMPLE_ICONS_SLUGS[key] : null;
  if (!slug) return null;
  return `${SIMPLE_ICONS_CDN}/${slug}/${colorHex}`;
}

function brandInitial(label) {
  const t = String(label || "").trim();
  if (!t) return "?";
  const ch = t[0].toUpperCase();
  return /[A-Z0-9]/i.test(ch) ? ch : "?";
}

/**
 * @param {string} repair
 * @returns {{ icon: string, label: string }}
 */
function repairIconMeta(repair) {
  const r = norm(repair);
  const rules = [
    { keys: ["display", "ecran", "lcd", "oled", "screen", "touch"], icon: "fa fa-mobile", label: "Ecran" },
    { keys: ["bater", "acumulator", "battery"], icon: "fa fa-battery-full", label: "Baterie" },
    { keys: ["camer", "camera", "lens", "obiectiv"], icon: "fa fa-camera", label: "Cameră" },
    { keys: ["spate", "back glass", "capac"], icon: "fa fa-square", label: "Spate" },
    { keys: ["incarc", "încărc", "charging", "mufă", "port", "conector", "lightning", "usb"], icon: "fa fa-plug", label: "Încărcare" },
    { keys: ["jack", "audio", "microfon", "difuzor", "speaker", "sunet"], icon: "fa fa-volume-up", label: "Audio" },
    { keys: ["software", "flash", "ios", "android", "unlock", "debloc"], icon: "fa fa-code", label: "Software" },
    { keys: ["buton", "home", "power", "volum", "volume", "flex"], icon: "fa fa-toggle-on", label: "Butoane / flex" },
    { keys: ["face id", "faceid", "senzor"], icon: "fa fa-user", label: "Senzori" },
    { keys: ["wifi", "bluetooth", "antena", "semnal"], icon: "fa fa-wifi", label: "Conectivitate" },
    { keys: ["apa", "lichid", "oxid"], icon: "fa fa-tint", label: "Lichide" },
    { keys: ["rame", "frame", "carcas"], icon: "fa fa-cube", label: "Carcasă" },
  ];
  for (const rule of rules) {
    if (rule.keys.some((k) => r.includes(k))) return rule;
  }
  return { icon: "fa fa-wrench", label: "Reparație" };
}

function $(id) {
  return document.getElementById(id);
}

function bootHtmlLoading() {
  return `<div class="price-wizard-boot-inner result-placeholder"><div class="placeholder-icon">⏳</div><h3>Se încarcă…</h3><p>Listă prețuri GSM OS</p></div>`;
}

function bootHtmlNoToken() {
  return `<div class="price-wizard-boot-inner result-placeholder" role="alert"><div class="placeholder-icon">⚠️</div><h3>Lipsește token</h3><p>Configurează TOKEN în <code>scripts/simple-price-calculator.js</code>.</p></div>`;
}

function bootHtmlError() {
  return `<div class="price-wizard-boot-inner result-placeholder" role="alert"><div class="placeholder-icon">⚠️</div><h3>Nu s-a încărcat lista</h3><p>Verifică conexiunea sau reîncearcă mai târziu.</p></div>`;
}

function updateProgressUI() {
  document.querySelectorAll(".price-wizard-progress-step").forEach((el) => {
    const n = Number(el.dataset.wizardStep);
    el.classList.remove("active", "completed");
    if (n < state.step) el.classList.add("completed");
    else if (n === state.step) el.classList.add("active");
  });
}

function updateChips() {
  const chips = $("price-wizard-chips");
  if (!chips) return;
  const parts = [];
  if (state.brandLabel)
    parts.push(`<span class="price-wizard-chip">${esc(state.brandLabel)}</span>`);
  if (state.model !== null)
    parts.push(
      `<span class="price-wizard-chip">${esc(state.model === "" ? "Model generic" : state.model)}</span>`
    );
  if (state.repair)
    parts.push(`<span class="price-wizard-chip">${esc(state.repair)}</span>`);
  chips.innerHTML = parts.length ? parts.join("") : "";
  chips.hidden = parts.length === 0;
}

function updatePanels() {
  document.querySelectorAll(".price-wizard-panel").forEach((panel) => {
    const n = Number(panel.dataset.wizardPanel);
    const on = n === state.step;
    panel.hidden = !on;
    panel.classList.toggle("price-wizard-panel--active", on);
  });
}

function updateFooter() {
  const back = $("price-wizard-back");
  const restart = $("price-wizard-restart");
  if (back) {
    back.hidden = state.step <= 1;
    back.disabled = state.step <= 1;
  }
  if (restart) {
    restart.hidden = state.step !== 4;
  }
}

function goStep(step) {
  state.step = Math.max(1, Math.min(4, step));
  updateProgressUI();
  updateChips();
  updatePanels();
  updateFooter();
}

function resetFromBrand() {
  state.model = null;
  state.repair = "";
}

function resetFromModel() {
  state.repair = "";
}

function renderBrands() {
  const grid = $("price-brands-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (const [k, lab] of listBrands()) {
    const logoUrl = brandCdnLogoUrl(lab) || brandCdnLogoUrl(k);
    const initial = brandInitial(lab);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "price-wizard-card price-wizard-card-brand";
    btn.dataset.brandKey = k;
    btn.setAttribute("aria-label", `Marcă ${lab}`);
    btn.style.setProperty("--stagger", String(grid.children.length));
    if (logoUrl) {
      btn.innerHTML = `
        <div class="price-wizard-card-visual">
          <img src="${esc(logoUrl)}" alt="" class="price-wizard-brand-logo" width="48" height="48" loading="lazy" decoding="async" />
        </div>
        <div class="price-wizard-card-footer"><span class="price-wizard-card-title">${esc(lab)}</span></div>`;
      const img = btn.querySelector("img");
      if (img) {
        img.addEventListener("error", () => {
          const wrap = btn.querySelector(".price-wizard-card-visual");
          if (wrap)
            wrap.innerHTML = `<span class="price-wizard-brand-fallback" aria-hidden="true">${esc(initial)}</span>`;
        });
      }
    } else {
      btn.innerHTML = `
        <div class="price-wizard-card-visual">
          <span class="price-wizard-brand-fallback" aria-hidden="true">${esc(initial)}</span>
        </div>
        <div class="price-wizard-card-footer"><span class="price-wizard-card-title">${esc(lab)}</span></div>`;
    }
    btn.addEventListener("click", () => {
      state.brandKey = k;
      state.brandLabel = lab;
      resetFromBrand();
      renderModels();
      goStep(2);
    });
    grid.appendChild(btn);
  }
}

function renderModels() {
  const grid = $("price-models-grid");
  if (!grid || !state.brandKey) return;
  grid.innerHTML = "";
  const logoUrl =
    brandCdnLogoUrl(state.brandLabel) || brandCdnLogoUrl(state.brandKey);
  const list = listModels(state.brandKey);
  if (!list.length) {
    grid.innerHTML =
      '<p class="price-wizard-empty" role="status">Nu există modele listate pentru această marcă.</p>';
    return;
  }
  for (const mod of list) {
    const enc = encModel(mod);
    const display = mod === "" ? "Generic / orice model" : mod;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "price-wizard-card price-wizard-card-model";
    btn.dataset.modelEnc = enc;
    btn.setAttribute("aria-label", `Model ${display}`);
    btn.style.setProperty("--stagger", String(grid.children.length));
    const logoHtml = logoUrl
      ? `<img src="${esc(logoUrl)}" alt="" class="price-wizard-model-brand-bg" loading="lazy" decoding="async" />`
      : "";
    btn.innerHTML = `
      ${logoHtml}
      <div class="price-wizard-card-visual price-wizard-model-visual">
        <i class="fa fa-mobile price-wizard-phone-icon" aria-hidden="true"></i>
      </div>
      <div class="price-wizard-card-footer">
        <span class="price-wizard-card-sub">${esc(state.brandLabel)}</span>
        <span class="price-wizard-card-title">${esc(display)}</span>
      </div>`;
    const bg = btn.querySelector(".price-wizard-model-brand-bg");
    if (bg) {
      bg.addEventListener("error", () => bg.remove());
    }
    btn.addEventListener("click", () => {
      state.model = decModel(enc);
      resetFromModel();
      renderRepairs();
      goStep(3);
    });
    grid.appendChild(btn);
  }
}

function renderRepairs() {
  const grid = $("price-repairs-grid");
  if (!grid || state.model === null) return;
  grid.innerHTML = "";
  const list = listRepairs(state.brandKey, state.model);
  if (!list.length) {
    grid.innerHTML =
      '<p class="price-wizard-empty" role="status">Nu există reparații listate pentru acest model.</p>';
    return;
  }
  for (const rep of list) {
    const meta = repairIconMeta(rep);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "price-wizard-card price-wizard-card-repair";
    btn.style.setProperty("--stagger", String(grid.children.length));
    btn.setAttribute("aria-label", `Reparație ${rep}`);
    btn.innerHTML = `
      <div class="price-wizard-card-visual">
        <i class="${esc(meta.icon)} price-wizard-repair-icon" aria-hidden="true"></i>
      </div>
      <div class="price-wizard-card-footer">
        <span class="price-wizard-card-title price-wizard-repair-title">${esc(rep)}</span>
      </div>`;
    btn.addEventListener("click", () => {
      state.repair = rep;
      updateChips();
      const out = $("calculator-result");
      const z = calc(state.brandKey, state.model, rep);
      const bl = state.brandLabel;
      const ml = state.model === "" ? "—" : state.model;
      if (out) {
        if (!z) showRez(out, null);
        else
          showRez(out, {
            bl,
            ml,
            rl: rep,
            p: z.p,
            m: z.m,
            t: z.t,
          });
      }
      goStep(4);
    });
    grid.appendChild(btn);
  }
}

function wizardBack() {
  if (state.step <= 1) return;
  if (state.step === 4) {
    state.repair = "";
    const out = $("calculator-result");
    if (out) out.innerHTML = ph();
    goStep(3);
    return;
  }
  if (state.step === 3) {
    state.repair = "";
    goStep(2);
    return;
  }
  if (state.step === 2) {
    resetFromBrand();
    goStep(1);
  }
}

function wizardRestart() {
  state.step = 1;
  state.brandKey = "";
  state.brandLabel = "";
  state.model = null;
  state.repair = "";
  const out = $("calculator-result");
  if (out) out.innerHTML = ph();
  const mg = $("price-models-grid");
  const rg = $("price-repairs-grid");
  if (mg) mg.innerHTML = "";
  if (rg) rg.innerHTML = "";
  renderBrands();
  updateProgressUI();
  updateChips();
  updatePanels();
  updateFooter();
}

function bindWizardControls() {
  const back = $("price-wizard-back");
  const restart = $("price-wizard-restart");
  if (back) back.addEventListener("click", () => wizardBack());
  if (restart) restart.addEventListener("click", () => wizardRestart());
}

function showApp() {
  const boot = $("price-wizard-boot");
  const app = $("price-wizard-app");
  if (boot) {
    boot.innerHTML = "";
    boot.hidden = true;
  }
  if (app) app.hidden = false;
}

function startWizard() {
  bindWizardControls();
  const out = $("calculator-result");
  if (out) out.innerHTML = ph();
  wizardRestart();
}

async function init() {
  const boot = $("price-wizard-boot");
  const app = $("price-wizard-app");

  if (boot) {
    boot.hidden = false;
    boot.innerHTML = bootHtmlLoading();
  }
  if (app) app.hidden = true;

  let ok = false;
  try {
    if (TOKEN.trim()) ok = await load();
  } catch (e) {
    console.error(e);
    rows = [];
  }

  if (!TOKEN.trim()) {
    if (boot) boot.innerHTML = bootHtmlNoToken();
    return;
  }
  if (!ok) {
    if (boot) boot.innerHTML = bootHtmlError();
    return;
  }

  showApp();
  startWizard();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
