import type { HeroVariant } from "@/lib/seo-landings";

function Bolt() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M5 12.5 10 17l9-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StateTags({ before, after }: { before: string; after: string }) {
  return (
    <>
      <span className="phone-state phone-state--before" aria-hidden="true">
        ✕ {before}
      </span>
      <span className="phone-state phone-state--after" aria-hidden="true">
        ✓ {after}
      </span>
    </>
  );
}

export function HeroVisual({ variant }: { variant: HeroVariant }) {
  if (variant === "display") {
    return (
      <div className="phone-3d">
        <div className="phone-model">
          <div className="phone-screen"></div>
          <span className="phone-state phone-state--before" aria-hidden="true">
            ✕ Înainte
          </span>
          <span className="phone-state phone-state--after" aria-hidden="true">
            ✓ După
          </span>
        </div>
      </div>
    );
  }

  if (variant === "baterie") {
    return (
      <div className="lv-device lv-device--battery" aria-hidden="true">
        <div className="lv-screen">
          <span className="lv-battery">
            <span className="lv-battery__fill"></span>
            <span className="lv-battery__bolt">
              <Bolt />
            </span>
          </span>
          <span className="lv-battery__pct"></span>
          <span className="lv-battery__label">Baterie nouă</span>
        </div>
        <StateTags before="Se descarcă" after="O zi întreagă" />
      </div>
    );
  }

  if (variant === "mufa") {
    return (
      <div className="lv-device lv-device--port" aria-hidden="true">
        <div className="lv-screen">
          <span className="lv-ring">
            <span className="lv-ring__bolt">
              <Bolt />
            </span>
          </span>
          <span className="lv-port__label">Se încarcă</span>
        </div>
        <span className="lv-port"></span>
        <span className="lv-plug">
          <span className="lv-plug__head"></span>
          <span className="lv-plug__cable"></span>
        </span>
        <StateTags before="Nu încarcă" after="Încarcă rapid" />
      </div>
    );
  }

  if (variant === "camera") {
    return (
      <div className="lv-device lv-device--back lv-device--camera" aria-hidden="true">
        <span className="lv-cam">
          <span className="lv-cam__lens lv-cam__lens--a"></span>
          <span className="lv-cam__lens lv-cam__lens--b"></span>
          <span className="lv-cam__lens lv-cam__lens--c"></span>
          <span className="lv-cam__flash"></span>
          <span className="lv-cam__crack"></span>
        </span>
        <span className="lv-cam-focus"></span>
        <span className="lv-back-logo">ZEN</span>
        <StateTags before="Poze neclare" after="Cameră clară" />
      </div>
    );
  }

  if (variant === "carcasa") {
    return (
      <div className="lv-device lv-device--back lv-device--glass" aria-hidden="true">
        <span className="lv-cam lv-cam--small">
          <span className="lv-cam__lens lv-cam__lens--a"></span>
          <span className="lv-cam__lens lv-cam__lens--b"></span>
        </span>
        <svg className="lv-cracks" viewBox="0 0 200 400" preserveAspectRatio="none">
          <path d="M120 160 L90 120 L70 60 M120 160 L160 130 L195 110 M120 160 L140 220 L130 290 L150 400 M120 160 L60 200 L5 230 M140 220 L185 260 M90 120 L40 110" />
        </svg>
        <span className="lv-shine"></span>
        <span className="lv-back-logo">ZEN</span>
        <StateTags before="Spate spart" after="Ca nou" />
      </div>
    );
  }

  return (
    <div className="lv-device lv-device--water" aria-hidden="true">
      <div className="lv-screen">
        <span className="lv-water"></span>
        <span className="lv-drop lv-drop--1"></span>
        <span className="lv-drop lv-drop--2"></span>
        <span className="lv-drop lv-drop--3"></span>
        <span className="lv-drop lv-drop--4"></span>
        <span className="lv-dry">
          <Check />
        </span>
      </div>
      <StateTags before="Ud" after="Salvat" />
    </div>
  );
}
