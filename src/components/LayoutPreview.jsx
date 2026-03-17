export default function LayoutPreview({ layout, templatePreview }) {
  const isLand = layout.orientation === "landscape";
  const gap = 3;

  const cell = (label, style = {}) => (
    <div
      style={{
        background: "#1c1c1c",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <span
        style={{
          color: "#3a3a3a",
          fontSize: "14px",
          fontFamily: "var(--fd)",
          userSelect: "none",
        }}
      >
        {label}
      </span>
    </div>
  );

  const gW = 220;
  const smallW = Math.round((gW - gap) / 2);
  const smallH = Math.round((smallW * 3) / 4);
  const gH = smallH * 2 + gap;
  const bigH = gH - gap - smallH;

  const renderGrid = () => (
    <div
      style={{
        display: "flex",
        gap: `${gap}px`,
        width: gW,
        height: gH,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          width: smallW,
          flexShrink: 0,
        }}
      >
        {cell("1", { height: bigH, borderRadius: "4px 0 0 0" })}
        {cell("2", { height: smallH, borderRadius: "0 0 0 4px" })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          width: smallW,
          flexShrink: 0,
        }}
      >
        {cell("3", { height: smallH, borderRadius: "0 4px 0 0" })}
        {cell("4", { height: smallH, borderRadius: "0 0 4px 0" })}
      </div>
    </div>
  );

  const sW = isLand ? 220 : 150;
  const sH = isLand ? 165 : 220;

  const renderSimple = () => {
    if (layout.id === "1foto")
      return (
        <div style={{ width: sW, height: sH }}>
          {cell("1", { width: "100%", height: "100%", borderRadius: "4px" })}
        </div>
      );
    const count = layout.id === "2strip" ? 2 : 3;
    return (
      <div
        style={{
          width: sW,
          height: sH,
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: count }).map((_, i) =>
          cell(String(i + 1), {
            flex: 1,
            borderRadius:
              i === 0 ? "4px 4px 0 0" : i === count - 1 ? "0 0 4px 4px" : "0",
          }),
        )}
      </div>
    );
  };

  const isGrid = layout.id === "grid";
  const W = isGrid ? gW : sW;
  const H = isGrid ? gH : sH;

  return (
    <div
      style={{
        width: W,
        height: H,
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid var(--bdr2)",
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        flexShrink: 0,
      }}
    >
      {isGrid ? renderGrid() : renderSimple()}
      {templatePreview && (
        <img
          src={templatePreview}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
          }}
          alt="template"
        />
      )}
      <div
        style={{
          position: "absolute",
          bottom: "7px",
          right: "8px",
          background: "rgba(0,0,0,.8)",
          border: "1px solid rgba(201,168,76,.3)",
          borderRadius: "5px",
          padding: "2px 7px",
          color: "var(--gold)",
          fontSize: "9px",
          letterSpacing: "1.5px",
        }}
      >
        {isLand ? "LANDSCAPE" : "PORTRAIT"}
      </div>
    </div>
  );
}
