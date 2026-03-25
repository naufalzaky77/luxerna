// BAGIAN HOME PILIH FILE DATABASE TAMU

import { useRef } from "react";
import getAsset from "../utils/getAsset";

export default function GuestDB({ locked, settings, onSettingsChange }) {
  const rmvImgRef = useRef(null);

  const handleRmvEnter = () => {
    const img = rmvImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogo .6s ease forwards";
  };

  const handleRmvLeave = () => {
    const img = rmvImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogoReverse .6s ease forwards";
  };

  const { guestCSV } = settings;

  const handleSelectCSV = async () => {
    if (locked) return;
    const filePath = await window.electronAPI.selectFile({
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    });
    if (filePath) {
      onSettingsChange({ ...settings, guestCSV: filePath });
    }
  };

  const fileName = guestCSV
    ? guestCSV.split("\\").pop() || guestCSV.split("/").pop()
    : null;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          color: "var(--primary)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          letterSpacing: ".1rem",
          marginBottom: ".5rem",
        }}
      >
        DATABASE TAMU
      </div>

      <button
        onClick={handleSelectCSV}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: ".7rem 1rem",
          borderRadius: ".7rem",
          cursor: locked ? "default" : "pointer",
          background: "var(--white)",
          border: ".1rem solid var(--white)",
          color: guestCSV ? "var(--secondary)" : "rgba(0,0,0,.4)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          transition: "all .2s",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={getAsset("/assets/database-import.svg")}
            alt="db"
            className={guestCSV ? "ic-blue" : "ic-grey"}
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
          <span
            style={{
              fontFamily: "var(--f)",
              fontSize: "1rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "220px",
            }}
          >
            {fileName || "Pilih file database tamu (.csv)"}
          </span>
        </div>

        {guestCSV && !locked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSettingsChange({ ...settings, guestCSV: null });
            }}
            className="del-btn"
            onMouseEnter={handleRmvEnter}
            onMouseLeave={handleRmvLeave}
            style={{ flexShrink: 0 }}
          >
            <img
              ref={rmvImgRef}
              src={getAsset("/assets/x.svg")}
              alt="rmv"
              className="rmv-img"
              style={{ width: "1rem", height: "1rem" }}
            />
          </button>
        )}
      </button>
    </div>
  );
}
