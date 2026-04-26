export default function LayoutPreview({ layout, templatePreview }) {
  const gap = 3;
  const PREVIEW_MAX = 220;
  const { w, h } = layout.print.paper;
  const ratio = w / h;
  const W = ratio >= 1 ? PREVIEW_MAX : Math.round(PREVIEW_MAX * ratio);
  const H = ratio >= 1 ? Math.round(PREVIEW_MAX / ratio) : PREVIEW_MAX;

  const renderCells = () => {
    const { print, shots } = layout;

    // ------- LAYOUT SLOT 4 GRID ------- //
    if (print.slots) {
      const { slots, paper } = print;
      const scaleX = W / paper.w;
      const scaleY = H / paper.h;
      return (
        <div style={{ position: "relative", width: W, height: H }}>
          {slots.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.x * scaleX,
                top: s.y * scaleY,
                width: s.w * scaleX,
                height: s.h * scaleY,
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "var(--secondary)",
                  fontSize: "var(--fs-h2)",
                  fontWeight: "var(--fw-medium)",
                  fontFamily: "var(--f)",
                }}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // ------- LAYOUT GRID/STRIP (COL X ROW) ------- //
    const { cols, rows, photo } = print;
    const cellW = (W - gap * (cols + 1)) / cols;
    const cellH = cellW * (photo.h / photo.w);
    return (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          padding: `${gap}px`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: "flex", gap: `${gap}px` }}>
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                style={{
                  width: cellW,
                  height: cellH,
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: "var(--secondary)",
                    fontSize: "var(--fs-h2)",
                    fontWeight: "var(--fw-medium)",
                    fontFamily: "var(--f)",
                  }}
                >
                  {r * cols + c + 1}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const FRAME_SCALE = 1.3;
  const FW = W * FRAME_SCALE;
  const FH = H * FRAME_SCALE;

  return (
    <div
      style={{
        width: W,
        height: H,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* LAYER 0 - Kertas Putih (di belakang frame) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 1,
          boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          overflow: "hidden",
        }}
      >
      {/* LAYER 1 - Frame Template (di belakang foto) */}
      {templatePreview && (
        <img
          src={templatePreview}
          style={{
            position: "absolute",
            inset: 0,
            // left: -(FW - W) / 2,
            // top: -(FH - H) / 2,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 1,
          }}
          alt="template"
        />
      )}

      
        {/* LAYER 2 - Hitam Area Foto (paling depan) */}
        <div style={{ position: "relative", zIndex: 2 }}>{renderCells()}</div>
      </div>
    </div>
  );
}
