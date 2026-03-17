import { useState, useEffect, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import LayoutPreview from "../components/LayoutPreview";
import { LAYOUTS } from "../data/mockData";

export default function Home({
  settings,
  onSettingsChange,
  adminUnlocked,
  onToggleAdmin,
  onStart,
}) {
  const {
    layout,
    templateFile,
    templatePreview,
    selectedCamera,
    cameras,
    eventName,
  } = settings;

  const [now, setNow] = useState(new Date());
  const [cameraDropdownOpen, setCameraDropdownOpen] = useState(false);
  const [cameraScanning, setCameraScanning] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const set = (key, val) => onSettingsChange({ ...settings, [key]: val });

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

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSettingsChange({ ...settings, templateFile: file, templatePreview: url });
  };

  const removeTemplate = () => {
    onSettingsChange({
      ...settings,
      templateFile: null,
      templatePreview: null,
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const locked = !adminUnlocked;

  // Shared disabled input style
  const disabledOverlay = locked
    ? {
        opacity: 0.5,
        pointerEvents: "none",
        userSelect: "none",
        filter: "grayscale(0.3)",
      }
    : {};

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>
        {buildCssVars()}
        {G}
      </style>

      {/* ── KOLOM KIRI ── */}
      <div
        style={{
          width: "46%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "52px 44px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "3rem" }}>
          <img
            src="/assets/Luxerna_Full.webp"
            alt="logo"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "contain",
              margin: "auto",
              display: "block",
            }}
          />
        </div>

        {/* Jam & Tanggal */}
        <div
          style={{
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h0)",
            fontWeight: "var(--fw-black)",
            color: "var(--primary)",
            letterSpacing: 6,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          {timeStr}
        </div>
        <div
          style={{
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h1)",
            fontWeight: "var(--fw-bold)",
            color: "var(--secondary)",
            letterSpacing: 1,
            marginBottom: "5rem",
            textAlign: "center",
          }}
        >
          {dateStr}
        </div>

        {/* Nama Acara */}
        <div style={{ width: "100%", maxWidth: "360px", marginBottom: "28px" }}>
          <div
            style={{
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h3)",
              fontWeight: "var(--fw-semiBold)",
              color: "var(--primary)",
              letterSpacing: 2,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            NAMA ACARA
          </div>
          <input
            type="text"
            value={eventName}
            onChange={(e) => !locked && set("eventName", e.target.value)}
            placeholder="Luxius & Erna"
            readOnly={locked}
            style={{
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h2)",
              fontWeight: "var(--fw-medium)",
              fontStyle: "italic",
              textAlign: "center",
              border: `3px solid ${locked ? "var(--ash)" : "#418bfa"}`,
              cursor: locked ? "default" : "text",
              background: locked ? "var(--ash)" : "transparent",
              color: locked ? "var(--white)" : "var(--primary)",
            }}
          />
        </div>

        {/* Start Button */}
        <button
          className="start-btn1"
          onClick={() => onStart()}
          style={{
            borderRadius: "3rem",
            padding: "1.5rem 3.5rem",
            marginTop: "2rem",
          }}
        >
          <img
            src="/assets/Luxerna_Submark.webp"
            alt="stic"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
          <span>&nbsp;MULAI</span>
        </button>

        {/* Tombol Kunci Setting */}
        <button
          className="admin-btn"
          onClick={onToggleAdmin}
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "3rem",
            background: adminUnlocked ? "var(--secondary)" : "transparent",
            border: "2px solid var(--secondary)",
            borderRadius: ".5rem",
            padding: ".5rem 1rem",
            cursor: "pointer",
            color: adminUnlocked ? "var(--white)" : "var(--secondary)",
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h3)",
            fontWeight: "var(--fw-semiBold)",
            letterSpacing: ".1rem",
            display: "flex",
            alignItems: "center",
            gap: ".7rem",
            transition: "all .2s",
          }}
        >
          <img
            src={adminUnlocked ? "/assets/lock-open-2.svg" : "/assets/lock.svg"}
            alt="lock"
            className={adminUnlocked ? "ic-white" : "ic-blue"}
            style={{
              width: "16px",
              height: "16px",
            }}
          />
          {adminUnlocked ? "TUTUP KUNCI" : "BUKA KUNCI"}
        </button>
      </div>

      {/* ── KOLOM KANAN ── */}
      <div
        className="scroll"
        style={{
          flex: 1,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                color: "var(--secondary)",
                fontFamily: "var(--f)",
                fontSize: "var(--fs-h2)",
                fontWeight: "var(--fw-bold)",
                letterSpacing: ".3rem",
              }}
            >
              PENGATURAN SESI
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: ".3rem .3rem",
              borderRadius: ".5rem",
              border: `3px solid ${adminUnlocked ? "var(--green)" : "var(--red)"}`,
              background: adminUnlocked ? "var(--green)" : "var(--red)",
            }}
          >
            <span
              style={{
                color: "var(--white)",
                fontFamily: "var(--f)",
                fontSize: "var(--fs-h3)",
                fontWeight: "var(--fw-semiBold)",
                letterSpacing: ".1rem",
              }}
            >
              {adminUnlocked ? "TERBUKA" : "TERKUNCI"}
            </span>
          </div>
        </div>

        {/* ── Layout Foto ── */}
        <div style={disabledOverlay}>
          <div
            style={{
              color: "var(--black)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h3)",
              fontWeight: "var(--fw-medium)",
              letterSpacing: ".1rem",
              marginBottom: ".5rem",
            }}
          >
            SUSUNAN FOTO
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "10px",
            }}
          >
            {LAYOUTS.map((l) => {
              const active = layout.id === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => !locked && set("layout", l)}
                  className={`layout-btn${active ? " active " : ""}`}
                  style={{ cursor: locked ? "default" : "pointer" }}
                >
                  {l.icon(active)}
                  <div
                    style={{
                      color: active ? "var(--secondary)" : "rgba(0, 0, 0, 0.2)",
                      fontFamily: "var(--f)",
                      fontSize: "var(--fs-h2)",
                      fontWeight: "var(--fw-medium)",
                    }}
                  >
                    {l.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Camera Device ── */}
        <div style={{ position: "relative", ...disabledOverlay }}>
          <div
            style={{
              color: "var(--black)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h3)",
              fontWeight: "var(--fw-medium)",
              letterSpacing: ".1rem",
              marginBottom: ".5rem",
            }}
          >
            PERANGKAT KAMERA
          </div>
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
              <span style={{ fontSize: "12px" }}>
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
                transform: cameraDropdownOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform .2s",
              }}
            />
          </button>

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
                            color: isActive
                              ? "var(--secondary)"
                              : "var(--primary)",
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

        {/* ── Frame Design ── */}
        <div style={disabledOverlay}>
          <div
            style={{
              color: "var(--black)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h3)",
              fontWeight: "var(--fw-medium)",
              letterSpacing: ".1rem",
              marginBottom: ".5rem",
            }}
          >
            DESAIN FRAME
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleTemplateUpload}
          />
          {!templateFile ? (
            <div
              className="upload-zone"
              onClick={() => !locked && fileRef.current.click()}
              style={{ cursor: locked ? "default" : "pointer" }}
            >
              <img
                src="/assets/upload.svg"
                alt="up"
                className="up-img"
                style={{
                  width: "3rem",
                  height: "3rem",
                }}
              />
              <div
                className="up-text"
                style={{
                  fontFamily: "var(--f)",
                  fontWeight: "var(--fw-semiBold)",
                  fontSize: "var(--fs-h2)",
                  letterSpacing: ".1rem",
                }}
              >
                Klik untuk unggah desain frame
              </div>
            </div>
          ) : (
            <div
              className="upload-zone has-file"
              style={{
                flexDirection: "row",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "62px",
                  height: "82px",
                  flexShrink: 0,
                }}
              >
                <img
                  src={templatePreview}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  alt=""
                />
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: "var(--secondary)",
                    fontFamily: "var(--f)",
                    fontWeight: "var(--fw-medium)",
                    fontSize: "var(--fs-h2)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <img
                    src="/assets/file.svg"
                    alt="file"
                    className="ic-blue"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                  {templateFile.name}
                </div>
              </div>
              {!locked && (
                <button
                  onClick={removeTemplate}
                  className="ghost-btn"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/assets/x.svg"
                    alt="rmv"
                    className="rmv-img"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Preview ── */}
        <div>
          <div
            style={{
              color: "var(--black)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h3)",
              fontWeight: "var(--fw-medium)",
              letterSpacing: ".1rem",
              marginBottom: "1.5rem",
            }}
          >
            PREVIEW
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LayoutPreview layout={layout} templatePreview={templatePreview} />
          </div>
        </div>
      </div>
    </div>
  );
}
