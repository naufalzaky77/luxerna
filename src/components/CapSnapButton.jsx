// BAGIAN CAPTURE TOMBOL SNAP POTRET

import { useRef } from "react";

export default function SnapButton({ busy, active, allDone, onShoot, onDone }) {
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "zoomIn .3s ease forwards";
  };

  const handleMouseLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "zoomOut .3s ease forwards";
  };

  return (
    <>
      {!allDone && (
        <button
          className={busy ? "snap-btnG" : "snap-btn"}
          onClick={() => !busy && onShoot(active)}
          onMouseEnter={!busy ? handleMouseEnter : undefined}
          onMouseLeave={!busy ? handleMouseLeave : undefined}
          style={{
            borderRadius: "3rem",
            padding: "1rem 2rem",
          }}
        >
          <img
            ref={imgRef}
            src="/assets/photo-sensor.svg"
            alt="spho"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
          <span>&nbsp;{busy ? "MEMOTRET" : `AMBIL FOTO ${active + 1}`}</span>
        </button>
      )}
      {allDone && (
        <button
          className="pros-btn"
          onClick={onDone}
          style={{
            padding: ".5rem .5rem",
            cursor: "pointer",
          }}
        >
          PROSES
        </button>
      )}
    </>
  );
}
