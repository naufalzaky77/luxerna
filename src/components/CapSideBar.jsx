// BAGIAN CAPTURE SIDEBAR KANAN

import { useState } from "react";
import getAsset from "../utils/getAsset";

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
          overflow: "hidden",
          aspectRatio: aspect,
          border: `.2rem solid ${isActive ? "var(--secondary)" : hasPic ? "transparent" : "rgba(0,0,0,.15)"}`,
          background: isActive
            ? "rgba(65,139,250,.1)"
            : hasPic
              ? "transparent"
              : "rgba(0, 0, 0, 0.2)",
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
              color: isActive ? "var(--secondary)" : "rgba(0,0,0,.15)",
              fontSize: "var(--fs-h0)",
              fontWeight: "var(--fw-bold)",
              fontFamily: "var(--f)",
            }}
          >
            {idx + 1}
          </div>
        )}

        {/* BAGIAN RETAKE FOTO */}
        {hasPic && !busy && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              retake(idx);
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.5)",
              border: `.2rem solid ${hovered ? "var(--secondary)" : "transparent"}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
              opacity: hovered ? 1 : 0,
              transition: "opacity .2s ease",
              cursor: "pointer",
            }}
          >
            <div>
              <img
                src={getAsset("/assets/reload.svg")}
                alt="rld"
                className="ic-white"
                style={{ width: "3rem", height: "3rem" }}
              />
            </div>
            <div
              style={{
                color: "var(--white)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h2)",
                letterSpacing: ".2rem",
              }}
            >
              ULANGI
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SideBar({
  layout,
  photos,
  active,
  busy,
  setActive,
  retake,
  total,
}) {
  const photoRatio = layout.print.photo
    ? `${layout.print.photo.w} / ${layout.print.photo.h}`
    : "1.543";

  const renderStripLayout = () => {
    //* ------- LAYOUT FOTO KHUSUS 4 GRID -------  *//
    if (layout.print.slots) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {layout.print.slots.map((s, i) => (
            <SlotThumb
              key={i}
              idx={i}
              photos={photos}
              active={active}
              busy={busy}
              setActive={setActive}
              retake={retake}
              aspect={`${s.w} / ${s.h}`}
            />
          ))}
        </div>
      );
    }

    //* ------- LAYOUT FOTO BIASA -------  *//
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
            aspect={photoRatio}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "20rem",
        background: "rgba(0,0,0,.05)",
        padding: "1rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          color: "var(--primary)",
          fontFamily: "var(--f)",
          fontWeight: "var(--fw-semiBold)",
          fontSize: "var(--fs-h2)",
          letterSpacing: ".1rem",
          textAlign: "center",
        }}
      >
        PRATINJAU FOTO
      </div>
      {renderStripLayout()}
    </div>
  );
}
