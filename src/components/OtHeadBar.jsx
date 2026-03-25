// BAGIAN CAPTURE HEADER BAR ATAS

import TimeDate from "./HoTimeDate";
import getAsset from "../utils/getAsset";

export default function HeadBar({ onBack, settings, layout }) {
  return (
    <div
      style={{
        padding: ".7rem 1.5rem",
        background: "#dedede",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* BAGIAN TOMBOL BACK (POJOK KIRI ATAS) */}
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
            src={getAsset("/assets/home-cog.svg")}
            alt="back"
            className="ic-blue"
            style={{
              width: "16px",
              height: "16px",
            }}
          />
          KEMBALI
        </button>

        {/* BAGIAN LOGO LUXERNA */}
        <img
          src={getAsset("/assets/Luxerna_Full.webp")}
          alt="logo"
          style={{
            height: "34px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* ------- KOLOM TENGAH ------- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* BAGIAN JAM */}
        <TimeDate
          showDate={false}
          timeSize="var(--fs-h2)"
          timeWeight="var(--fw-bold)"
          noMargin
          timeColor="var(--secondary)"
          timeSpacing={3}
        />
        {/* BAGIAN NAMA SESI ACARA */}
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

      {/* ------- KOLOM KANAN ------- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".3rem",
          alignItems: "flex-end",
        }}
      >
        {/* BAGIAN JENIS FOTO */}
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
      </div>
    </div>
  );
}
