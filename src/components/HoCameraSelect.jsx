// BAGIAN HOME PILIH KAMERA

import { useState } from "react";

const DCC_BASE = "http://localhost:5513";

async function checkDCC() {
  try {
    const result = await window.electronAPI.listDSLR();
    return Array.isArray(result.cameras);
  } catch {
    return false;
  }
}

async function fetchDSLRCameras() {
  try {
    const result = await window.electronAPI.listDSLR();
    return result.cameras ?? [];
  } catch {
    return [];
  }
}

// ── Sub-komponen ──────────────────────────────────────────────────────────────

function GroupLabel({ label }) {
  return (
    <div
      style={{
        padding: ".4rem 1rem .2rem",
        fontSize: ".68rem",
        fontWeight: "var(--fw-semiBold)",
        letterSpacing: ".08rem",
        color: "rgba(0,0,0,.35)",
        fontFamily: "var(--f)",
      }}
    >
      {label}
    </div>
  );
}

function CameraItem({ cam, index, isActive, onSelect }) {
  const badgeColor =
    cam.type === "dslr"
      ? { bg: "rgba(139,92,246,.12)", text: "#7c3aed" }
      : cam.isCapCard
        ? { bg: "rgba(16,185,129,.12)", text: "#059669" }
        : { bg: "rgba(65,139,250,.12)", text: "var(--secondary)" };

  return (
    <div
      onClick={() => onSelect(cam)}
      style={{
        padding: ".65rem 1rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: ".7rem",
        background: isActive ? "rgba(65,139,250,.08)" : "transparent",
        transition: "background .15s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,.04)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      {isActive && (
        <img
          src="/assets/circle-check.svg"
          alt="check"
          className="ic-blue"
          style={{ width: "1.1rem", height: "1.1rem", flexShrink: 0 }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: isActive ? "var(--secondary)" : "var(--primary)",
            fontFamily: "var(--f)",
            fontWeight: "var(--fw-semiBold)",
            fontSize: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cam.label || cam.model || `Kamera ${index + 1}`}
        </div>
        {/* Sub-label model untuk DSLR */}
        {cam.type === "dslr" && cam.model && cam.model !== cam.label && (
          <div
            style={{
              fontSize: ".75rem",
              color: "rgba(0,0,0,.4)",
              marginTop: "1px",
            }}
          >
            {cam.model}
          </div>
        )}
      </div>

      <span
        style={{
          fontSize: ".62rem",
          fontWeight: "var(--fw-semiBold)",
          padding: ".12rem .4rem",
          borderRadius: "4px",
          background: badgeColor.bg,
          color: badgeColor.text,
          flexShrink: 0,
          letterSpacing: ".04rem",
        }}
      >
        {cam.type === "dslr"
          ? "DSLR"
          : cam.isCapCard
            ? "CAPTURE CARD"
            : "WEBCAM"}
      </span>
    </div>
  );
}

// ── Komponen utama ────────────────────────────────────────────────────────────

export default function CameraSelect({ locked, settings, onSettingsChange }) {
  const { selectedCamera, cameras } = settings;
  const [cameraDropdownOpen, setCameraDropdownOpen] = useState(false);
  const [cameraScanning, setCameraScanning] = useState(false);
  const [dccAvailable, setDccAvailable] = useState(null);

  const scanCameras = async () => {
    setCameraScanning(true);
    setCameraDropdownOpen(true);

    let webcams = [];
    let dslrs = [];

    // Scan webcam & capture card
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      const devices = await navigator.mediaDevices.enumerateDevices();
      webcams = devices
        .filter((d) => d.kind === "videoinput")
        .map((d) => ({
          ...d,
          type: "webcam",
          isCapCard: /elgato|avermedia|magewell|cam link|4k60|game cap/i.test(
            d.label,
          ),
        }));
    } catch {
      // Permission denied atau tidak ada webcam — lanjut
    }

    // Scan DSLR via digiCamControl
    const dccOk = await checkDCC();
    setDccAvailable(dccOk);
    if (dccOk) {
      dslrs = await fetchDSLRCameras();
    }

    const allCameras = [...webcams, ...dslrs];

    onSettingsChange({
      ...settings,
      cameras: allCameras,
      selectedCamera:
        settings.selectedCamera &&
        allCameras.some((c) => c.deviceId === settings.selectedCamera.deviceId)
          ? settings.selectedCamera
          : null,
    });

    setCameraScanning(false);
  };

  const selectCamera = (cam) => {
    onSettingsChange({ ...settings, selectedCamera: cam });
    setCameraDropdownOpen(false);
  };

  const barLabel = () => {
    if (cameraScanning) return "Mencari kamera...";
    if (!selectedCamera) return "PILIH KAMERA!";
    return selectedCamera.label || selectedCamera.model || "Kamera";
  };

  const webcams = cameras.filter((c) => c.type === "webcam");
  const dslrs = cameras.filter((c) => c.type === "dslr");

  return (
    <div style={{ position: "relative" }}>
      {/* Label section */}
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
        PERANGKAT KAMERA
      </div>

      {/* Bar utama */}
      <button
        onClick={() => !locked && scanCameras()}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: ".7rem 1rem",
          borderRadius: ".7rem",
          cursor: locked ? "default" : "pointer",
          background: "var(--white)",
          border: `3px solid ${cameraDropdownOpen ? "var(--secondary)" : "var(--white)"}`,
          color: selectedCamera ? "var(--secondary)" : "rgba(0,0,0,0.4)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          transition: "all .2s",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/assets/camera-plus.svg"
            alt="cam"
            className={selectedCamera ? "ic-blue" : "ic-grey"}
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
          <span style={{ fontFamily: "var(--f)", fontSize: "1rem" }}>
            {barLabel()}
          </span>
          {/* Badge tipe di bar */}
          {selectedCamera && (
            <span
              style={{
                fontSize: ".65rem",
                fontWeight: "var(--fw-semiBold)",
                padding: ".15rem .45rem",
                borderRadius: "4px",
                background:
                  selectedCamera.type === "dslr"
                    ? "rgba(139,92,246,.15)"
                    : selectedCamera.isCapCard
                      ? "rgba(16,185,129,.15)"
                      : "rgba(65,139,250,.15)",
                color:
                  selectedCamera.type === "dslr"
                    ? "#7c3aed"
                    : selectedCamera.isCapCard
                      ? "#059669"
                      : "var(--secondary)",
              }}
            >
              {selectedCamera.type === "dslr"
                ? "DSLR"
                : selectedCamera.isCapCard
                  ? "CAPTURE CARD"
                  : "WEBCAM"}
            </span>
          )}
        </div>

        <img
          src="/assets/caret-down.svg"
          alt="caret"
          className="ic-blue"
          style={{
            width: "1rem",
            height: "1rem",
            transform: cameraDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
          }}
        />
      </button>

      {/* Dropdown */}
      {cameraDropdownOpen && !locked && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--white)",
            borderRadius: "1rem",
            overflow: "hidden",
            animation: "fadeUp .18s ease",
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          }}
        >
          {/* State: scanning */}
          {cameraScanning && (
            <div
              style={{
                padding: "1rem",
                color: "var(--secondary)",
                fontFamily: "var(--f)",
                display: "flex",
                alignItems: "center",
                gap: ".7rem",
              }}
            >
              <img
                src="/assets/rotate-clockwise-2.svg"
                alt="spin"
                className="ic-blue"
                style={{
                  width: "1.3rem",
                  height: "1.3rem",
                  animation: "infSpin 0.8s linear infinite",
                }}
              />
              Mencari kamera...
            </div>
          )}

          {/* State: tidak ada kamera */}
          {!cameraScanning && cameras.length === 0 && (
            <div style={{ padding: "1rem", fontFamily: "var(--f)" }}>
              <div
                style={{
                  color: "var(--primary)",
                  fontWeight: "var(--fw-medium)",
                  marginBottom: ".3rem",
                }}
              >
                Tidak ada kamera terdeteksi
              </div>
              {dccAvailable === false && (
                <div
                  style={{
                    fontSize: ".8rem",
                    color: "rgba(0,0,0,.45)",
                    lineHeight: 1.5,
                  }}
                >
                  digiCamControl tidak terdeteksi. Pastikan aplikasi sudah
                  berjalan untuk menggunakan DSLR via USB.
                </div>
              )}
            </div>
          )}

          {/* State: ada kamera — tampilkan per grup */}
          {!cameraScanning && cameras.length > 0 && (
            <>
              {webcams.length > 0 && (
                <>
                  <GroupLabel label="WEBCAM / CAPTURE CARD" />
                  {webcams.map((cam, i) => (
                    <CameraItem
                      key={cam.deviceId}
                      cam={cam}
                      index={i}
                      isActive={selectedCamera?.deviceId === cam.deviceId}
                      onSelect={selectCamera}
                    />
                  ))}
                </>
              )}

              {dslrs.length > 0 && (
                <>
                  <GroupLabel label="DSLR / MIRRORLESS (USB)" />
                  {dslrs.map((cam, i) => (
                    <CameraItem
                      key={cam.deviceId}
                      cam={cam}
                      index={i}
                      isActive={selectedCamera?.deviceId === cam.deviceId}
                      onSelect={selectCamera}
                    />
                  ))}
                </>
              )}

              {/* Info kalau DCC tidak jalan tapi ada webcam */}
              {dccAvailable === false && (
                <div
                  style={{
                    padding: ".6rem 1rem",
                    fontSize: ".75rem",
                    color: "rgba(0,0,0,.4)",
                    borderTop: "1px solid rgba(0,0,0,.06)",
                  }}
                >
                  digiCamControl tidak terdeteksi — DSLR via USB tidak tersedia
                </div>
              )}
            </>
          )}

          {/* Tombol pindai ulang */}
          {!cameraScanning && (
            <div
              onClick={scanCameras}
              className="cam-scan"
              style={{
                padding: "1rem 3rem",
                cursor: "pointer",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-medium)",
                fontSize: "var(--fs-h3)",
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                borderTop: "1px solid rgba(0,0,0,.06)",
              }}
            >
              <img
                src="/assets/rotate-clockwise-2.svg"
                alt="rescan"
                style={{ width: "1rem", height: "1rem" }}
              />
              PINDAI ULANG
            </div>
          )}
        </div>
      )}

      {/* Overlay tutup dropdown */}
      {cameraDropdownOpen && !locked && (
        <div
          onClick={() => setCameraDropdownOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
        />
      )}
    </div>
  );
}
