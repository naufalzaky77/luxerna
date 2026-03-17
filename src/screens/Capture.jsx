import { useState, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import { MOCK } from "../data/mockData";

export default function Capture({ settings, onDone, onBack }) {
  const { layout, templatePreview } = settings;
  const total = layout.shots;
  const [photos, setPhotos] = useState(Array(total).fill(null));
  const [active, setActive] = useState(0);
  const [cd, setCd] = useState(null);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);
  const allDone = photos.every(Boolean);

  const shoot = (slot) => {
    if (busy) return;
    setBusy(true);
    let n = 3;
    setCd(n);
    timerRef.current = setInterval(() => {
      n--;
      if (n === 0) {
        clearInterval(timerRef.current);
        setCd("📸");
        setTimeout(() => {
          const np = [...photos];
          np[slot] = MOCK[slot % MOCK.length];
          setPhotos(np);
          setCd(null);
          setBusy(false);
          const nx = np.findIndex((p) => p === null);
          if (nx !== -1) setActive(nx);
        }, 380);
      } else setCd(n);
    }, 1000);
  };

  const retake = (slot) => {
    if (busy) return;
    const np = [...photos];
    np[slot] = null;
    setPhotos(np);
    setActive(slot);
  };

  // Layout grid for sidebar strip
  const renderStripLayout = () => {
    if (layout.id === "grid") {
      // Grid: 1 besar kiri atas, 2 bawah kiri, 3 atas kanan, 4 bawah kanan
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5px",
          }}
        >
          <div style={{ gridColumn: "1", gridRow: "1" }}>
            <SlotThumb
              idx={0}
              photos={photos}
              active={active}
              busy={busy}
              setActive={setActive}
              retake={retake}
              aspect="3/4"
            />
          </div>
          <div style={{ gridColumn: "2", gridRow: "1" }}>
            <SlotThumb
              idx={2}
              photos={photos}
              active={active}
              busy={busy}
              setActive={setActive}
              retake={retake}
              aspect="4/3"
            />
          </div>
          <div style={{ gridColumn: "1", gridRow: "2" }}>
            <SlotThumb
              idx={1}
              photos={photos}
              active={active}
              busy={busy}
              setActive={setActive}
              retake={retake}
              aspect="4/3"
            />
          </div>
          <div style={{ gridColumn: "2", gridRow: "2" }}>
            <SlotThumb
              idx={3}
              photos={photos}
              active={active}
              busy={busy}
              setActive={setActive}
              retake={retake}
              aspect="4/3"
            />
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <SlotThumb
            key={i}
            idx={i}
            photos={photos}
            active={active}
            busy={busy}
            setActive={setActive}
            retake={retake}
            aspect="4/3"
          />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--f)",
      }}
    >
      <style>
        {buildCssVars()}
        {G}
      </style>
      {cd === "📸" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
            zIndex: 200,
            animation: "flash .4s ease-out",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          padding: "13px 22px",
          background: "rgba(0,0,0,.04)",
          borderBottom: "1px solid rgba(0,0,0,.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            className="ghost-btn"
            onClick={onBack}
            style={{
              padding: "7px 14px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Kembali
          </button>
          <span
            style={{
              color: "var(--secondary)",
              fontFamily: "var(--f)",
              fontStyle: "italic",
              fontSize: "18px",
            }}
          >
            Snapbooth
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                border: `2px solid ${photos[i] ? "var(--secondary)" : active === i ? "var(--secondary)" : "rgba(0,0,0,.15)"}`,
                background: photos[i]
                  ? "var(--secondary)"
                  : active === i
                    ? "rgba(65,139,250,.15)"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: photos[i] ? "var(--white)" : "rgba(0,0,0,.4)",
                transition: "all .3s",
              }}
            >
              {photos[i] ? "✓" : i + 1}
            </div>
          ))}
          <span
            style={{
              color: "rgba(0,0,0,.5)",
              fontSize: "11px",
              marginLeft: "6px",
            }}
          >
            {photos.filter(Boolean).length}/{total} foto
          </span>
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(0,0,0,.5)",
            letterSpacing: "1px",
          }}
        >
          {layout.label} · {layout.orientation}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Viewfinder */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "22px",
            padding: "28px",
          }}
        >
          <div
            style={{
              maxWidth: layout.orientation === "landscape" ? "580px" : "380px",
              width: "100%",
              aspectRatio: layout.orientation === "landscape" ? "4/3" : "3/4",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              background: "#080808",
              border: `2px solid ${busy ? "var(--secondary)" : "rgba(0,0,0,.15)"}`,
              transition: "border-color .3s, box-shadow .3s",
              boxShadow: busy ? "0 0 32px rgba(65,139,250,.22)" : "none",
            }}
          >
            {/* Camera feed placeholder */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "radial-gradient(ellipse at center,#161616 0%,#050505 100%)",
                color: "#1a1a1a",
                fontSize: "80px",
              }}
            >
              📷
            </div>

            {/* Bracket corners */}
            {[
              ["top", "left"],
              ["top", "right"],
              ["bottom", "left"],
              ["bottom", "right"],
            ].map(([y, x], i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  [y]: "14px",
                  [x]: "14px",
                  width: "20px",
                  height: "20px",
                  [`border${y[0].toUpperCase() + y.slice(1)}`]:
                    "2px solid var(--secondary)",
                  [`border${x[0].toUpperCase() + x.slice(1)}`]:
                    "2px solid var(--secondary)",
                  opacity: 0.6,
                }}
              />
            ))}

            {/* Template overlay preview */}
            {templatePreview && (
              <img
                src={templatePreview}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
                alt=""
              />
            )}

            {/* Countdown */}
            {cd !== null && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,.75)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: cd === "📸" ? "72px" : "104px",
                    fontFamily: "var(--f)",
                    fontWeight: 700,
                    color: cd === "📸" ? "#fff" : "var(--secondary)",
                    textShadow: `0 0 48px ${cd === "📸" ? "#fff" : "var(--secondary)"}`,
                    animation: "fadeIn .25s ease",
                  }}
                >
                  {cd}
                </div>
                {cd !== "📸" && (
                  <div
                    style={{
                      color: "rgba(0,0,0,.5)",
                      fontSize: "11px",
                      letterSpacing: "3px",
                    }}
                  >
                    FOTO {active + 1} / {total}
                  </div>
                )}
              </div>
            )}
          </div>

          {!allDone && !busy && (
            <button
              className="primary-btn"
              onClick={() => shoot(active)}
              style={{
                borderRadius: "50px",
                padding: "16px 52px",
                fontSize: "13px",
              }}
            >
              ● &nbsp;AMBIL FOTO {active + 1}
            </button>
          )}
          {allDone && (
            <button
              className="primary-btn"
              onClick={() => onDone(photos)}
              style={{
                borderRadius: "50px",
                padding: "16px 52px",
                fontSize: "13px",
              }}
            >
              LANJUT KE OUTPUT &nbsp;→
            </button>
          )}
        </div>

        {/* Strip sidebar */}
        <div
          style={{
            width: "200px",
            background: "rgba(0,0,0,.04)",
            borderLeft: "1px solid rgba(0,0,0,.1)",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              color: "rgba(0,0,0,.5)",
              fontSize: "10px",
              letterSpacing: "3px",
              textAlign: "center",
            }}
          >
            STRIP PREVIEW
          </div>
          {renderStripLayout()}
        </div>
      </div>
    </div>
  );
}

function SlotThumb({ idx, photos, active, busy, setActive, retake, aspect }) {
  const [hovered, setHovered] = useState(false);
  const hasPic = !!photos[idx];
  const isActive = active === idx && !hasPic;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={() => !busy && !hasPic && setActive(idx)}
        style={{
          borderRadius: "7px",
          overflow: "hidden",
          aspectRatio: aspect,
          border: `2px solid ${isActive ? "var(--secondary)" : hasPic ? "rgba(65,139,250,.5)" : "rgba(0,0,0,.15)"}`,
          background: "#0a0a0a",
          cursor: hasPic ? "default" : "pointer",
          position: "relative",
          transition: "border-color .2s",
        }}
      >
        {hasPic ? (
          <img
            src={photos[idx]}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            alt=""
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#222",
              fontSize: "20px",
              fontFamily: "var(--f)",
            }}
          >
            {idx + 1}
          </div>
        )}

        {/* AKTIF badge */}
        {isActive && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(65,139,250,.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "var(--secondary)",
                fontSize: "9px",
                letterSpacing: "2px",
                background: "rgba(0,0,0,.75)",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              AKTIF
            </div>
          </div>
        )}

        {/* Retake overlay — hover on filled slot */}
        {hasPic && !busy && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              retake(idx);
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              opacity: hovered ? 1 : 0,
              transition: "opacity .2s ease",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(65,139,250,.15)",
                border: "1.5px solid var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "var(--secondary)",
              }}
            >
              ↺
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: "9px",
                letterSpacing: "2px",
                fontFamily: "var(--f)",
              }}
            >
              RETAKE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
