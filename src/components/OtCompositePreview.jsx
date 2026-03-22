// BAGIAN OUTPUT FRAME + FOTO DI KIRI

export default function CompositePreview({ photos, layout, templatePreview }) {
  const { print } = layout;
  const { paper } = print;
  const ratio = `${paper.w} / ${paper.h}`;

  const renderPhotos = () => {
    //Layout custom slots (4 grid)
    if (print.slots) {
      const scaleX = 100 / paper.w;
      const scaleY = 100 / paper.h;
      return (
        <div style={{ position: "absolute", inset: 0 }}>
          {print.slots.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${s.x * scaleX}%`,
                top: `${s.y * scaleY}%`,
                width: `${s.w * scaleX}%`,
                height: `${s.h * scaleY}%`,
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
    }

    //Layout reguler (cols x rows)
    const { cols, rows, photo, margin, gap } = print;
    const scaleX = 100 / paper.w;
    const scaleY = 100 / paper.h;
    const slotW = photo.w * scaleX;
    const slotH = photo.h * scaleY;
    const gapX = gap.x * scaleX;
    const gapY = gap.y * scaleY;
    const marginL = margin.left * scaleX;
    const marginT = margin.top * scaleY;

    const slots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        slots.push({
          x: marginL + c * (slotW + gapX),
          y: marginT + r * (slotH + gapY),
          w: slotW,
          h: slotH,
          i: r * cols + c,
        });
      }
    }

    return (
      <div style={{ position: "absolute", inset: 0 }}>
        {slots.map((s) => (
          <div
            key={s.i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.w}%`,
              height: `${s.h}%`,
              background: "#1a1a1a",
              overflow: "hidden",
            }}
          >
            {photos[s.i] && (
              <img
                src={photos[s.i]}
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
        width: "100%",
        aspectRatio: ratio,
        borderRadius: "10px",
        overflow: "hidden",
        background: "white",
        position: "relative",
        boxShadow: "0 12px 40px rgba(0,0,0,.6)",
      }}
    >
      {/* Layer 1 — frame template */}
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
            zIndex: 0,
          }}
          alt=""
        />
      )}

      {/* Layer 2 — foto */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {renderPhotos()}
      </div>
    </div>
  );
}
