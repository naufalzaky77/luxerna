import { useState, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import HeadBar from "../components/CapHeadBar";
import ViewFinder from "../components/CapViewFinder";
import SnapButton from "../components/CapSnapButton";
import SideBar from "../components/CapSideBar";

export default function Capture({ settings, onDone, onBack }) {
  const { layout } = settings;
  const total = layout.shots;

  const [photos, setPhotos] = useState(Array(total).fill(null));
  const [active, setActive] = useState(0);
  const [cd, setCd] = useState(null);
  const [busy, setBusy] = useState(false);
  const [snapError, setSnapError] = useState(null);

  const videoRef = useRef(null); // untuk webcam
  const canvasRef = useRef(null); // untuk webcam snapshot
  const imgRef = useRef(null); // untuk DSLR live view (diteruskan ke ViewFinder)

  const allDone = photos.every(Boolean);
  const isDSLR = settings.selectedCamera?.type === "dslr";

  // ── COUNTDOWN HELPER ───────────────────────────────────────────────────────
  const runCountdown = async () => {
    setCd("SIAP");
    await wait(1000);
    for (let n = 3; n > 0; n--) {
      setCd(n);
      await wait(1000);
    }
    setCd(null);
    await wait(380);
  };

  // ── CAPTURE WEBCAM ─────────────────────────────────────────────────────────
  const captureWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  // ── CAPTURE DSLR via IPC (Windows: DCC | macOS: gphoto2) ──────────────────
  const captureDSLR = async () => {
    const result = await window.electronAPI.captureDSLR();
    if (!result.success) throw new Error(result.error || "Memotret gagal");
    return result.base64;
  };

  // ── FUNGSI UTAMA SHOOT ─────────────────────────────────────────────────────
  const shoot = async (slot) => {
    if (busy) return;

    setBusy(true);
    setSnapError(null);

    await runCountdown();

    const np = [...photos];

    try {
      if (isDSLR) {
        np[slot] = await captureDSLR();
      } else {
        np[slot] = captureWebcam();
      }
    } catch (err) {
      console.error("Capture error:", err);
      setSnapError(
        isDSLR
          ? `Gagal memotret: ${err.message}`
          : "Gagal mengambil gambar dari kamera.",
      );
      // Slot tidak terisi — user bisa coba lagi
      setBusy(false);
      return;
    }

    setPhotos(np);
    setBusy(false);

    // Pindah ke slot berikutnya yang kosong
    const nx = np.findIndex((p) => p === null);
    if (nx !== -1) setActive(nx);
  };

  const retake = (slot) => {
    if (busy) return;
    const np = [...photos];
    np[slot] = null;
    setPhotos(np);
    setActive(slot);
    setSnapError(null);
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--f)",
      }}
    >
      <style>
        {buildCssVars()}
        {G}
      </style>

      <HeadBar
        onBack={onBack}
        settings={settings}
        layout={layout}
        photos={photos}
        active={active}
        total={total}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* VIEWFINDER + TOMBOL */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--white)",
            alignItems: "center",
            justifyContent: "center",
            gap: "3rem",
            padding: "28px",
          }}
        >
          <ViewFinder
            cd={cd}
            selectedCamera={settings.selectedCamera}
            videoRef={videoRef}
            imgRef={imgRef}
          />

          {/* EROR CAPTURE */}
          {snapError && (
            <div
              style={{
                color: "var(--red)",
                fontFamily: "var(--f)",
                fontSize: "var(--fs-h2)",
                fontWeight: "var(--fw-semiBold)",
                textAlign: "center",
                maxWidth: "480px",
                lineHeight: 1.5,
              }}
            >
              {snapError}
            </div>
          )}

          <SnapButton
            busy={busy}
            active={active}
            allDone={allDone}
            onShoot={shoot}
            onDone={() => onDone(photos)}
          />
        </div>

        <SideBar
          layout={layout}
          photos={photos}
          active={active}
          busy={busy}
          setActive={setActive}
          retake={retake}
          total={total}
        />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

// ── UTILITAS ──────────────────────────────────────────────────────────────────

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // sudah include "data:image/jpeg;base64,..."
    reader.onerror = () => reject(new Error("FileReader gagal"));
    reader.readAsDataURL(blob);
  });
}
