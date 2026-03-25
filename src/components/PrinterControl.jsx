import { useRef } from "react";
import getAsset from "../utils/getAsset";

export default function PrinterControl({
  printCount,
  setPrintCount,
  runPrint,
  processDone,
  selectedPrinter,
  printStatus,
}) {
  const prtImgRef = useRef(null);

  const handlePrtEnter = () => {
    const img = prtImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "zoomIn .3s ease forwards";
  };

  const handlePrtLeave = () => {
    const img = prtImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "zoomOut .3s ease forwards";
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginLeft: "auto",
      }}
    >
      {/* ------- TOMBOL PRINT ------- */}
      <input
        type="number"
        min={1}
        max={10}
        value={printCount}
        onChange={(e) =>
          setPrintCount(Math.max(1, parseInt(e.target.value) || 1))
        }
        style={{
          width: "auto",
          textAlign: "center",
          border: ".1rem solid var(--secondary)",
          borderRadius: ".5rem",
          padding: ".75rem",
          fontFamily: "var(--f)",
          fontWeight: "var(--fw-semiBold)",
          fontSize: "var(--fs-h2)",
          color: "var(--primary)",
          background: "rgba(65,139,250,.04)",
        }}
      />
      <button
        className="prt-btn"
        onClick={runPrint}
        onMouseEnter={handlePrtEnter}
        onMouseLeave={handlePrtLeave}
        style={{
          pointerEvents:
            !processDone || !selectedPrinter || printStatus !== "idle"
              ? "none"
              : "auto",
          opacity:
            !processDone || !selectedPrinter || printStatus !== "idle"
              ? 0.4
              : 1,
        }}
      >
        <img
          ref={prtImgRef}
          src={getAsset("/assets/file-arrow-right.svg")}
          alt="flpr"
          style={{
            width: "28px",
            height: "28px",
            objectFit: "contain",
          }}
        />
        <span>{printStatus === "printing" ? "MENCETAK..." : "CETAK"}</span>
      </button>
    </div>
  );
}
