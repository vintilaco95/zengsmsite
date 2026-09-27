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
          <span className="lv-dial">
            <svg className="lv-dial__svg" viewBox="0 0 36 36" aria-hidden="true">
              <circle className="lv-dial__track" cx="18" cy="18" r="14" />
              <circle className="lv-dial__arc" cx="18" cy="18" r="14" />
            </svg>
            <span className="lv-dial__bolt">
              <Bolt />
            </span>
          </span>
        </div>
        <span className="lv-usbc" />
        <span className="lv-lead">
          <span className="lv-lead__plug" />
          <span className="lv-lead__wire" />
        </span>
        <StateTags before="Nu încarcă" after="Încarcă rapid" />
      </div>
    );
  }

  if (variant === "camera") {
    return (
      <div className="lv-device lv-device--back lv-device--camera" aria-hidden="true">
        <span className="lv-cam">
          <span className="lv-cam__lens lv-cam__lens--a" />
          <span className="lv-cam__lens lv-cam__lens--b" />
          <span className="lv-cam__lens lv-cam__lens--c" />
          <span className="lv-cam__flash" />
          <svg className="lv-cam__crack" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M46 50 L28 24 L16 6 M46 50 L70 30 L94 14 M46 50 L56 76 L50 98 M46 50 L20 68 L4 78" />
          </svg>
        </span>
        <span className="lv-brackets" />
        <StateTags before="Poze neclare" after="Cameră clară" />
      </div>
    );
  }

  if (variant === "carcasa") {
    return (
      <div className="lv-device lv-device--back lv-device--glass" aria-hidden="true">
        <span className="lv-cam lv-cam--small">
          <span className="lv-cam__lens lv-cam__lens--a" />
          <span className="lv-cam__lens lv-cam__lens--b" />
        </span>
        <svg className="lv-cracks" viewBox="0 0 100 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M58 78 L46 52 L40 22 M58 78 L74 60 L96 48 M58 78 L66 112 L62 150 L70 188 M58 78 L36 98 L8 112 M66 112 L88 128" />
        </svg>
        <span className="lv-shine" />
        <StateTags before="Spate spart" after="Ca nou" />
      </div>
    );
  }

  return (
    <div className="lv-device lv-device--water" aria-hidden="true">
      <div className="lv-screen">
        <span className="lv-drops">
          <span className="lv-drop lv-drop--1" />
          <span className="lv-drop lv-drop--2" />
          <span className="lv-drop lv-drop--3" />
        </span>
        <span className="lv-water" />
        <span className="lv-dry">
          <Check />
        </span>
      </div>
      <StateTags before="Ud" after="Salvat" />
    </div>
  );
}
