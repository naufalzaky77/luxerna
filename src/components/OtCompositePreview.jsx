// BAGIAN OUTPUT FRAME + FOTO DI KIRI

export default function CompositePreview({ photos, layout, templatePreview }) {
  const isLand = layout.orientation === "landscape";
  const W = isLand ? "100%" : "140px";

  const photoGrid = () => {
    if (layout.id === "grid")
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "2px",
            width: "100%",
            height: "100%",
          }}
        >
          {[
            { c: "1", r: "1", i: 0 },
            { c: "1", r: "2", i: 1 },
            { c: "2", r: "1", i: 2 },
            { c: "2", r: "2", i: 3 },
          ].map(({ c, r, i }) => (
            <div
              key={i}
              style={{
                gridColumn: c,
                gridRow: r,
                background: "#1a1a1a",
                overflow: "hidden",
              }}
            >
              {photos[i] && (
                <img
                  src={photos[i]}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt=""
                />
              )}
            </div>
          ))}
        </div>
      );
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          gap: "2px",
        }}
      >
        {photos.map((p, i) => (
          <div
            key={i}
            style={{ flex: 1, background: "#1a1a1a", overflow: "hidden" }}
          >
            {p && (
              <img
                src={p}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: W,
        aspectRatio: isLand ? "4/3" : "3/4",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#111",
        position: "relative",
        border: "1px solid rgba(0,0,0,.1)",
        boxShadow: "0 12px 40px rgba(0,0,0,.6)",
      }}
    >
      {photoGrid()}
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
          alt=""
        />
      )}
    </div>
  );
}
