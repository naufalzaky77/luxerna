// BAGIAN CAPTURE HEADER BAR ATAS

import TimeDate from "./HoTimeDate";

export default function HeadBar({
  onBack,
  settings,
  layout,
  photos,
  active,
  total,
}) {
  return (
    <div
      style={{
        padding: ".7rem 1.5rem",
        background: "rgba(0,0,0,.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Bagian Tombol Kembali */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          className="back-btn"
          onClick={onBack}
          style={{
            padding: ".5rem .5rem",
            cursor: "pointer",
          }}
        >
          <img
            src={"/assets/home-cog.svg"}
            alt="back"
            className="ic-blue"
            style={{
              width: "16px",
              height: "16px",
            }}
          />
          KEMBALI
        </button>

        {/* Bagian Logo Vendor */}
        <img
          src="/assets/Luxerna_Full.webp"
          alt="logo"
          style={{
            height: "34px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* KOLOM TENGAH */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Bagian Jam */}
        <TimeDate
          showDate={false}
          timeSize="var(--fs-h2)"
          timeWeight="var(--fw-bold)"
          noMargin
          timeColor="var(--secondary)"
          timeSpacing={3}
        />

        {/* Bagian Nama Acara */}
        <div
          style={{
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h2)",
            fontWeight: "var(--fw-medium)",
            color: "var(--primary)",
            letterSpacing: ".1rem",
            fontStyle: "italic",
          }}
        >
          {settings.eventName || "Nama Acara"}
        </div>
      </div>

      {/* KOLOM KANAN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".3rem",
          alignItems: "flex-end",
        }}
      >
        {/* Bagian Info Jenis Foto */}
        <div
          style={{
            fontFamily: "var(--f)",
            fontWeight: "var(--fw-regular)",
            fontSize: "var(--fs-h3)",
            color: "rgba(0,0,0,.5)",
            letterSpacing: ".1rem",
          }}
        >
          {layout.label} · {layout.sublabel}
        </div>

        {/* Bagian Info Banyak Foto yg Diambil */}
        <div
          style={{
            display: "flex",
            gap: ".3rem",
            alignItems: "center",
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "1.7rem",
                height: "1.7rem",
                borderRadius: "50%",
                border: `2px solid ${photos[i] ? "transparent" : active === i ? "var(--secondary)" : "rgba(0,0,0,.1)"}`,
                background: photos[i]
                  ? "transparent"
                  : active === i
                    ? "rgba(65,139,250,.1)"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-bold)",
                fontSize: "var(--fs-h3)",
                color: photos[i]
                  ? "var(--white)"
                  : active === i
                    ? "var(--secondary)"
                    : "rgba(0,0,0,.1)",
                transition: "all .3s",
              }}
            >
              {photos[i] ? (
                <img
                  src="/assets/circle-check.svg"
                  alt="done"
                  className="ic-blue"
                  style={{ width: "2rem", height: "2rem" }}
                />
              ) : (
                i + 1
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
