// BAGIAN HOME PILIHAN LAYOUT FOTO

import { LAYOUTS } from "../data/mockData";

export default function LayoutSelect({
  layout,
  locked,
  settings,
  onSettingsChange,
}) {
  const set = (key, val) => onSettingsChange({ ...settings, [key]: val });

  return (
    <div>
      <div
        style={{
          color: "var(--black)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          letterSpacing: ".1rem",
          marginBottom: ".5rem",
        }}
      >
        SUSUNAN FOTO
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "10px",
        }}
      >
        {LAYOUTS.map((l) => {
          const active = layout.id === l.id;
          return (
            <button
              key={l.id}
              onClick={() => !locked && set("layout", l)}
              className={`layout-btn${active ? " active " : ""}`}
              style={{
                cursor: locked ? "default" : "pointer",
                justifyContent: "space-between",
                paddingBottom: ".5rem",
              }}
            >
              {l.icon(active)}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: active ? "var(--secondary)" : "rgba(0, 0, 0, 0.2)",
                    fontFamily: "var(--f)",
                    fontSize: "var(--fs-h2)",
                    fontWeight: "var(--fw-medium)",
                  }}
                >
                  {l.label}
                </div>

                <div
                  style={{
                    color: active ? "var(--secondary)" : "rgba(0, 0, 0, 0.2)",
                    fontFamily: "var(--f)",
                    fontSize: "var(--fs-h2)",
                    fontWeight: "var(--fw-medium)",
                    fontStyle: "italic",
                    minHeight: "1.5rem",
                  }}
                >
                  {l.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
