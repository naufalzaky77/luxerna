// BAGIAN CAPTURE VIEW LAYAR UNTUK FOTO

import { useEffect, useRef, useState } from "react";

const DCC_BASE = "http://localhost:5513";
const LV_URL = `${DCC_BASE}/api/liveview.jpg`;
const LV_SHOW = `${DCC_BASE}/?cmd=LiveViewWnd_Show`;
const LV_HIDE = `${DCC_BASE}/?cmd=LiveViewWnd_Hide`;
const LV_INTERVAL = 150; // ms antar frame, ~6fps — cukup untuk preview

export default function ViewFinder({ cd, selectedCamera, videoRef, imgRef }) {
  const [camError, setCamError] = useState(null);
  const [dslrReady, setDslrReady] = useState(false);
  const pollRef = useRef(null); // interval ID polling

  // ── Cleanup helper ──────────────────────────────────────────────────────────
  const stopDSLRLiveView = async () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setDslrReady(false);
    try {
      await fetch(LV_HIDE);
    } catch {
      /* DCC mungkin sudah tutup */
    }
  };

  const stopWebcam = (stream) => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // ── Effect utama — jalankan saat selectedCamera berubah ───────────────────
  useEffect(() => {
    if (!selectedCamera) return;

    setCamError(null);
    setDslrReady(false);

    // ── MODE DSLR ─────────────────────────────────────────────────────────────
    if (selectedCamera.type === "dslr") {
      let cancelled = false;

      const startDSLRLiveView = async () => {
        try {
          // 1. Aktifkan live view di digiCamControl
          await fetch(LV_SHOW);
          await new Promise((r) => setTimeout(r, 800)); // beri waktu DCC warmup

          if (cancelled) return;
          setDslrReady(true);

          // 2. Polling frame — tiap LV_INTERVAL ms update src <img>
          pollRef.current = setInterval(() => {
            if (imgRef.current) {
              // Cache-busting dengan timestamp agar browser tidak cache frame lama
              imgRef.current.src = `${LV_URL}?t=${Date.now()}`;
            }
          }, LV_INTERVAL);
        } catch (err) {
          if (!cancelled) {
            setCamError(
              "Gagal terhubung ke live view DSLR. Pastikan digiCamControl berjalan.",
            );
          }
        }
      };

      startDSLRLiveView();

      return () => {
        cancelled = true;
        stopDSLRLiveView();
      };
    }

    // ── MODE WEBCAM / CAPTURE CARD ─────────────────────────────────────────────
    let stream;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCamera.deviceId } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        const msg =
          err.name === "NotAllowedError"
            ? "Akses kamera ditolak. Cek izin di browser."
            : err.name === "NotFoundError"
              ? "Kamera tidak ditemukan. Coba pindai ulang."
              : err.name === "NotReadableError"
                ? "Kamera sedang dipakai aplikasi lain."
                : `Kamera error: ${err.message}`;
        setCamError(msg);
      }
    };

    startWebcam();

    return () => {
      stopWebcam(stream);
    };
  }, [selectedCamera]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        maxWidth: "90rem",
        width: "100%",
        aspectRatio: "1.543",
        position: "relative",
        overflow: "hidden",
        background: "#000",
        borderRadius: ".5rem",
      }}
    >
      {/* MODE WEBCAM — <video> */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // Sembunyikan kalau mode DSLR
          display: selectedCamera?.type === "dslr" ? "none" : "block",
        }}
      />

      {/* MODE DSLR — <img> polling */}
      {selectedCamera?.type === "dslr" && (
        <img
          ref={imgRef}
          alt="dslr-liveview"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: dslrReady ? 1 : 0,
            transition: "opacity .3s",
          }}
          onError={() => {
            // Frame gagal load — tidak perlu error state, polling akan retry otomatis
          }}
        />
      )}

      {/* Placeholder — belum pilih kamera */}
      {!selectedCamera && (
        <div style={overlayStyle}>
          <img
            src="/assets/camera-plus.svg"
            alt="cam"
            style={{
              width: "3rem",
              height: "3rem",
              opacity: 0.3,
              marginBottom: ".75rem",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,.4)",
              fontFamily: "var(--f)",
              fontSize: ".9rem",
            }}
          >
            Pilih kamera terlebih dahulu
          </span>
        </div>
      )}

      {/* Placeholder — DSLR loading */}
      {selectedCamera?.type === "dslr" && !dslrReady && !camError && (
        <div style={overlayStyle}>
          <img
            src="/assets/rotate-clockwise-2.svg"
            alt="loading"
            style={{
              width: "2rem",
              height: "2rem",
              marginBottom: ".75rem",
              filter: "invert(1)",
              animation: "infSpin .8s linear infinite",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,.6)",
              fontFamily: "var(--f)",
              fontSize: ".9rem",
            }}
          >
            Menghubungkan ke {selectedCamera.label}...
          </span>
        </div>
      )}

      {/* Error state */}
      {camError && (
        <div style={overlayStyle}>
          <span
            style={{
              color: "rgba(255,100,100,.9)",
              fontFamily: "var(--f)",
              fontSize: ".9rem",
              textAlign: "center",
              maxWidth: "80%",
              lineHeight: 1.6,
            }}
          >
            {camError}
          </span>
        </div>
      )}

      {/* Countdown */}
      {cd !== null && (
        <div style={{ ...overlayStyle, background: "transparent" }}>
          <div
            style={{
              width: "15rem",
              height: "15rem",
              borderRadius: "50%",
              background: "rgba(65,139,250,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulseRing 1s ease-out infinite",
            }}
          >
            <div
              style={{
                fontSize: cd === "SIAP" ? "5rem" : "13rem",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                color: "rgba(65,139,250,1)",
                letterSpacing: cd === "SIAP" ? ".3rem" : 0,
              }}
            >
              {cd}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Style helper — overlay centered di atas video
const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,.65)",
};
