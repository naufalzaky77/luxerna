import { useState, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import HeadBar from "../components/CapHeadBar";
import ViewFinder from "../components/CapViewFinder";
import SnapButton from "../components/CapSnapButton";
import SideBar from "../components/CapSideBar";

const DCC_BASE = "http://localhost:5513";

export default function Capture({ settings, onDone, onBack }) {
  const { layout } = settings;
  const total = layout.shots;

  const [photos, setPhotos] = useState(Array(total).fill(null));
  const [active, setActive] = useState(0);
  const [cd, setCd] = useState(null);
  const [busy, setBusy] = useState(false);
  const [snapError, setSnapError] = useState(null); // error per-capture

  const videoRef = useRef(null); // untuk webcam
  const canvasRef = useRef(null); // untuk webcam snapshot
  const imgRef = useRef(null); // untuk DSLR live view (diteruskan ke ViewFinder)

  const allDone = photos.every(Boolean);
  const isDSLR = settings.selectedCamera?.type === "dslr";

  // ── Countdown helper ───────────────────────────────────────────────────────
  const runCountdown = async () => {
    setCd("SIAP");
    await wait(1000);
    for (let n = 3; n > 0; n--) {
      setCd(n);
      await wait(1000);
    }
    setCd(null);
    await wait(380); // jeda sebelum capture
  };

  // ── Capture webcam ─────────────────────────────────────────────────────────
  const captureWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  // ── Capture DSLR via digiCamControl ───────────────────────────────────────
  const captureDSLR = async () => {
    // 1. Trigger shutter
    const triggerRes = await fetch(`${DCC_BASE}/api/capture`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!triggerRes.ok) throw new Error("Trigger shutter gagal");

    // 2. Tunggu sebentar — kamera butuh waktu proses
    await wait(1500);

    // 3. Ambil path file terakhir yang di-capture
    const lastRes = await fetch(`${DCC_BASE}/api/lastcaptured`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!lastRes.ok) throw new Error("Gagal ambil info file terakhir");

    const lastData = await lastRes.json();
    const filePath = lastData?.Data || lastData?.data || null;

    if (!filePath) throw new Error("Path file tidak ditemukan");

    // 4. Download file sebagai base64
    const fileUrl = `${DCC_BASE}/image?file=${encodeURIComponent(filePath)}`;
    const fileRes = await fetch(fileUrl, {
      signal: AbortSignal.timeout(8000),
    });
    if (!fileRes.ok) throw new Error("Gagal download file dari DCC");

    const blob = await fileRes.blob();
    const base64 = await blobToBase64(blob);
    return base64;
  };

  // ── Fungsi shoot utama ─────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
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
        {/* Area utama — viewfinder + tombol */}
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
            imgRef={imgRef} // ← tambahan untuk DSLR
          />

          {/* Error capture */}
          {snapError && (
            <div
              style={{
                color: "#dc2626",
                fontFamily: "var(--f)",
                fontSize: ".85rem",
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

// ── Utilities ──────────────────────────────────────────────────────────────────

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
