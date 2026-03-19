// BAGIAN HOME PILIH KAMERA

import { useState } from "react";

export default function CameraSelect({ locked, settings, onSettingsChange }) {
  const { selectedCamera, cameras } = settings;
  const [cameraDropdownOpen, setCameraDropdownOpen] = useState(false);
  const [cameraScanning, setCameraScanning] = useState(false);

  const scanCameras = async () => {
    setCameraScanning(true);
    setCameraDropdownOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      const devices = await navigator.mediaDevices.enumerateDevices();
      const vids = devices.filter(
        (d) => d.kind === "videoinput" && d.label !== "",
      );
      onSettingsChange({
        ...settings,
        cameras: vids,
        selectedCamera: vids.length > 0 ? vids[0] : null,
      });
    } catch {
      onSettingsChange({ ...settings, cameras: [], selectedCamera: null });
    }
    setCameraScanning(false);
  };

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
        PERANGKAT KAMERA
      </div>

      {/* Bagian Bar Kamera */}
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
          color: selectedCamera ? "var(--secondary)" : "rgba(0, 0, 0, 0.4)",
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
            alt="cpic"
            className={selectedCamera ? "ic-blue" : "ic-grey"}
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
          <span style={{ fontFamily: "var(--f)", fontSize: "12px" }}>
            {cameraScanning
              ? "Mencari kamera..."
              : selectedCamera
                ? selectedCamera.label ||
                  `Kamera ${cameras.indexOf(selectedCamera) + 1}`
                : "PILIH KAMERA!"}
          </span>
        </div>
        <img
          src="/assets/caret-down.svg"
          alt="cdw"
          className="ic-blue"
          style={{
            width: "1rem",
            height: "1rem",
            transform: cameraDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
          }}
        />
      </button>

      {/* Bagian Dropdown Isi Bar Kamera */}
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
          }}
        >
          {cameraScanning ? (
            <div
              style={{
                padding: "1rem 1rem",
                color: "var(--secondary)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h2)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/assets/rotate-clockwise-2.svg"
                alt="rcw"
                className="ic-blue"
                style={{
                  marginRight: ".7rem",
                  width: "1.3rem",
                  height: "1.3rem",
                  animation: "infSpin 0.8s linear infinite",
                }}
              />
              Mencari...
            </div>
          ) : cameras.length === 0 ? (
            <div
              style={{
                padding: "1rem 1rem",
                color: "var(--primary)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h2)",
              }}
            >
              Tidak ada kamera terdeteksi
            </div>
          ) : (
            cameras.map((cam, i) => {
              const isActive = selectedCamera?.deviceId === cam.deviceId;
              return (
                <div
                  key={cam.deviceId}
                  onClick={() => {
                    onSettingsChange({ ...settings, selectedCamera: cam });
                    setCameraDropdownOpen(false);
                  }}
                  style={{
                    padding: ".7rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: ".7rem",
                    background: isActive
                      ? "rgba(65,139,250,.1)"
                      : "transparent",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "rgba(0,0,0,.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: ".7rem",
                    }}
                  >
                    {isActive && (
                      <img
                        src="/assets/circle-check.svg"
                        alt="ccc"
                        className="ic-blue"
                        style={{
                          width: "1.3rem",
                          height: "1.3rem",
                        }}
                      />
                    )}
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
                      {cam.label || `Kamera ${i + 1}`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
              }}
            >
              <img
                src="/assets/rotate-clockwise-2.svg"
                alt="rcw"
                style={{
                  width: "1rem",
                  height: "1rem",
                }}
              />
              PINDAI ULANG
            </div>
          )}
        </div>
      )}
      {cameraDropdownOpen && !locked && (
        <div
          onClick={() => setCameraDropdownOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
        />
      )}
    </div>
  );
}
