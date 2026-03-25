// BAGIAN HOME TOMBOL MULAI

import { useRef } from "react";
import getAsset from "../utils/getAsset";

export default function StartButton({ onStart }) {
  const imgRef = useRef(null);

  const handleMouseLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogoReverse .6s ease forwards";
  };

  const handleMouseEnter = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogo .6s ease forwards";
  };

  return (
    <button
      className="start-btn1"
      onClick={() => onStart()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: "3rem",
        padding: "1.5rem 3.5rem",
        marginTop: "2rem",
      }}
    >
      <img
        ref={imgRef}
        src={getAsset("/assets/Luxerna_Submark.webp")}
        alt="stic"
        style={{ width: "28px", height: "28px", objectFit: "contain" }}
      />
      <span>&nbsp;MULAI</span>
    </button>
  );
}
