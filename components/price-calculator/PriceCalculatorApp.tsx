"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  brandLogoUrl,
  defaultPriceListToken,
  fetchPriceList,
  findPrice,
  listBrands,
  listModels,
  listRepairs,
  norm,
  repairEmojiHint,
  type PriceRow,
} from "@/lib/gsmos-price-list";
import styles from "./PriceCalculatorApp.module.css";

export const PRETURI_CALCULATOR_ANCHOR_ID = "preturi-calculator";

type Variant = "page" | "embed";

type LoadState = "loading" | "ready" | "error" | "no_token";

const WHATSAPP = "40758060072";

function BrandOption({
  brandKey,
  label,
  onPick,
}: {
  brandKey: string;
  label: string;
  onPick: () => void;
}) {
  const [showImg, setShowImg] = useState(true);
  const logo = brandLogoUrl(label) || brandLogoUrl(brandKey);
  const initial = (label.trim()[0] || "?").toUpperCase();
  return (
    <button type="button" className={styles.pickBtn} onClick={onPick}>
      {logo && showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          width={40}
          height={40}
          className={styles.brandLogo}
          loading="lazy"
          decoding="async"
          onError={() => setShowImg(false)}
        />
      ) : (
        <span className={styles.brandFallback} aria-hidden>
          {initial}
        </span>
      )}
      <span className={styles.pickLabel}>{label}</span>
    </button>
  );
}

function waHref(
  bl: string,
  ml: string,
  rl: string,
  p: number,
  m: number,
  t: number,
  currency: string,
): string {
  const text = `Bună ziua! 

Am folosit calculatorul de pe zengsm.ro:

📱 ${bl} / ${ml} — ${rl}
💰 ${p} + ${m} = ${t} ${currency}

Aș dori detalii. Mulțumesc!`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

type Props = { variant: Variant };

export function PriceCalculatorApp({ variant }: Props) {
  const token = defaultPriceListToken();
  const [load, setLoad] = useState<LoadState>("loading");
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [currency, setCurrency] = useState("RON");
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [brandKey, setBrandKey] = useState("");
  const [brandLabel, setBrandLabel] = useState("");
  const [model, setModel] = useState<string | null>(null);
  const [repair, setRepair] = useState("");

  useEffect(() => {
    if (!token.trim()) {
      setLoad("no_token");
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const { rows: r, currency: c } = await fetchPriceList(token);
        if (cancelled) return;
        if (!r.length) {
          setLoad("error");
          return;
        }
        setRows(r);
        setCurrency(c);
        setLoad("ready");
      } catch {
        if (!cancelled) setLoad("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const brands = useMemo(() => listBrands(rows), [rows]);

  const filteredBrands = useMemo(() => {
    const q = norm(query);
    if (!q) return brands;
    return brands.filter(
      ([k, lab]) => norm(lab).includes(q) || k.includes(q),
    );
  }, [brands, query]);

  const models = useMemo(
    () => (brandKey ? listModels(rows, brandKey) : []),
    [rows, brandKey],
  );

  const filteredModels = useMemo(() => {
    const q = norm(query);
    if (!q) return models;
    return models.filter((m) => {
      const disp = m === "" ? "generic" : m;
      return norm(disp).includes(q);
    });
  }, [models, query]);

  const repairs = useMemo(
    () =>
      brandKey && model !== null ? listRepairs(rows, brandKey, model) : [],
    [rows, brandKey, model],
  );

  const filteredRepairs = useMemo(() => {
    const q = norm(query);
    if (!q) return repairs;
    return repairs.filter((r) => norm(r).includes(q));
  }, [repairs, query]);

  const selection = useMemo(() => {
    if (!brandKey || model === null || !repair) return null;
    return findPrice(rows, brandKey, model, repair);
  }, [rows, brandKey, model, repair]);

  const resetFromBrand = useCallback(() => {
    setModel(null);
    setRepair("");
  }, []);

  const pickBrand = useCallback(
    (k: string, lab: string) => {
      setBrandKey(k);
      setBrandLabel(lab);
      resetFromBrand();
      setQuery("");
      setStep(2);
    },
    [resetFromBrand],
  );

  const pickModel = useCallback((m: string) => {
    setModel(m);
    setRepair("");
    setQuery("");
    setStep(3);
  }, []);

  const pickRepair = useCallback((r: string) => {
    setRepair(r);
    setQuery("");
    setStep(4);
  }, []);

  const goBack = useCallback(() => {
    if (step <= 1) return;
    if (step === 4) {
      setRepair("");
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(2);
      return;
    }
    setBrandKey("");
    setBrandLabel("");
    resetFromBrand();
    setStep(1);
  }, [step, resetFromBrand]);

  const restart = useCallback(() => {
    setStep(1);
    setBrandKey("");
    setBrandLabel("");
    setModel(null);
    setRepair("");
    setQuery("");
  }, []);

  useEffect(() => {
    setQuery("");
  }, [step]);

  const shellClass =
    variant === "page" ? styles.shellPage : styles.shellEmbed;

  return (
    <section
      id={PRETURI_CALCULATOR_ANCHOR_ID}
      className={shellClass}
      aria-label="Calculator prețuri reparații"
    >
      <div className={styles.inner}>
        {variant === "page" ? (
          <header className={styles.titleBlock}>
            <h1 className={styles.title}>Prețuri reparații</h1>
            <p className={styles.subtitle}>
              Estimare orientativă din lista actuală GSM OS — alege marca,
              modelul și tipul reparației.
            </p>
          </header>
        ) : null}

        <div className={styles.card}>
          {load === "loading" ? (
            <div className={styles.loader} role="status">
              <span className={styles.spinner} aria-hidden />
              Se încarcă prețurile…
            </div>
          ) : null}

          {load === "no_token" ? (
            <div className={styles.errorBox} role="alert">
              <p>
                Lipsește token-ul API. Setează{" "}
                <code>NEXT_PUBLIC_GSMOS_PRICE_LIST_TOKEN</code> în mediu.
              </p>
            </div>
          ) : null}

          {load === "error" ? (
            <div className={styles.errorBox} role="alert">
              <p>Nu s-a încărcat lista de prețuri. Încearcă din nou mai târziu.</p>
            </div>
          ) : null}

          {load === "ready" ? (
            <>
              <div className={styles.steps} role="tablist">
                {[
                  { n: 1, label: "Marcă" },
                  { n: 2, label: "Model" },
                  { n: 3, label: "Reparație" },
                  { n: 4, label: "Rezultat" },
                ].map((s) => (
                  <div
                    key={s.n}
                    role="tab"
                    aria-selected={step === s.n}
                    className={
                      styles.stepBtn +
                      (step === s.n ? ` ${styles.stepBtnActive}` : "") +
                      (step > s.n ? ` ${styles.stepBtnDone}` : "")
                    }
                  >
                    {s.n}. {s.label}
                  </div>
                ))}
              </div>

              {step < 4 ? (
                <div className={styles.search}>
                  <label htmlFor="zgsm-calc-filter" className={styles.srOnly}>
                    Filtrează
                  </label>
                  <input
                    id="zgsm-calc-filter"
                    className={styles.searchInput}
                    placeholder={
                      step === 1
                        ? "Caută marcă…"
                        : step === 2
                          ? "Caută model…"
                          : "Caută tip reparație…"
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              ) : null}

              {(brandLabel || model !== null || repair) && (
                <div className={styles.chips} aria-live="polite">
                  {brandLabel ? (
                    <span className={styles.chip}>{brandLabel}</span>
                  ) : null}
                  {model !== null ? (
                    <span className={styles.chip}>
                      {model === "" ? "Model generic" : model}
                    </span>
                  ) : null}
                  {repair ? (
                    <span className={styles.chip}>{repair}</span>
                  ) : null}
                </div>
              )}

              <div className={styles.body}>
                {step === 1 ? (
                  <div className={styles.grid}>
                    {filteredBrands.length === 0 ? (
                      <p className={styles.empty}>Nicio marcă nu se potrivește.</p>
                    ) : (
                      filteredBrands.map(([k, lab]) => (
                        <BrandOption
                          key={k}
                          brandKey={k}
                          label={lab}
                          onPick={() => pickBrand(k, lab)}
                        />
                      ))
                    )}
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className={styles.grid}>
                    {filteredModels.length === 0 ? (
                      <p className={styles.empty}>
                        {models.length === 0
                          ? "Nu există modele listate."
                          : "Niciun model nu se potrivește."}
                      </p>
                    ) : (
                      filteredModels.map((m) => {
                        const display =
                          m === "" ? "Generic / orice model" : m;
                        return (
                          <button
                            key={m === "" ? "__empty__" : m}
                            type="button"
                            className={styles.pickBtn}
                            onClick={() => pickModel(m)}
                          >
                            <span className={styles.repairEmoji} aria-hidden>
                              📱
                            </span>
                            <span className={styles.pickSub}>{brandLabel}</span>
                            <span className={styles.pickLabel}>{display}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className={styles.grid}>
                    {filteredRepairs.length === 0 ? (
                      <p className={styles.empty}>
                        {repairs.length === 0
                          ? "Nu există reparații listate."
                          : "Nicio reparație nu se potrivește."}
                      </p>
                    ) : (
                      filteredRepairs.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={styles.pickBtn}
                          onClick={() => pickRepair(r)}
                        >
                          <span className={styles.repairEmoji} aria-hidden>
                            {repairEmojiHint(r)}
                          </span>
                          <span className={styles.pickLabel}>{r}</span>
                        </button>
                      ))
                    )}
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className={styles.resultPanel}>
                    {!selection ? (
                      <p className={styles.empty}>
                        Nu există preț pentru combinația aleasă.
                      </p>
                    ) : (
                      <>
                        <h2 className={styles.resultTitle}>Estimare</h2>
                        <ul className={styles.resultList}>
                          <li>
                            <span>Marcă</span>
                            <strong>{brandLabel}</strong>
                          </li>
                          <li>
                            <span>Model</span>
                            <strong>
                              {model === "" || model === null ? "—" : model}
                            </strong>
                          </li>
                          <li>
                            <span>Reparație</span>
                            <strong>{repair}</strong>
                          </li>
                          <li>
                            <span>Componentă</span>
                            <strong>
                              {selection.p} {currency}
                            </strong>
                          </li>
                          <li>
                            <span>Manoperă</span>
                            <strong>
                              {selection.m} {currency}
                            </strong>
                          </li>
                        </ul>
                        <div className={styles.resultTotal}>
                          Total: {selection.t} {currency}
                        </div>
                        <a
                          className={styles.waBtn}
                          href={waHref(
                            brandLabel,
                            model === "" || model === null ? "—" : model,
                            repair,
                            selection.p,
                            selection.m,
                            selection.t,
                            currency,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Deschide WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                ) : null}
              </div>

              <div className={styles.footerBar}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={goBack}
                  disabled={step <= 1}
                >
                  Înapoi
                </button>
                <button
                  type="button"
                  className={styles.restartBtn}
                  onClick={restart}
                >
                  Resetează
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
