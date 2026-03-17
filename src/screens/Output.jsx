import { useState, useEffect, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import { GUEST_DB } from "../data/mockData";

function CompositePreview({ photos, layout, templatePreview }) {
  const isLand = layout.orientation === "landscape";
  const W = isLand ? "100%" : "140px";

  const photoGrid = () => {
    if (layout.id === "grid")
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "2px",
            width: "100%",
            height: "100%",
          }}
        >
          {[
            { c: "1", r: "1", i: 0 },
            { c: "1", r: "2", i: 1 },
            { c: "2", r: "1", i: 2 },
            { c: "2", r: "2", i: 3 },
          ].map(({ c, r, i }) => (
            <div
              key={i}
              style={{
                gridColumn: c,
                gridRow: r,
                background: "#1a1a1a",
                overflow: "hidden",
              }}
            >
              {photos[i] && (
                <img
                  src={photos[i]}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt=""
                />
              )}
            </div>
          ))}
        </div>
      );
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          gap: "2px",
        }}
      >
        {photos.map((p, i) => (
          <div
            key={i}
            style={{ flex: 1, background: "#1a1a1a", overflow: "hidden" }}
          >
            {p && (
              <img
                src={p}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        width: W,
        aspectRatio: isLand ? "4/3" : "3/4",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#111",
        position: "relative",
        border: "1px solid rgba(0,0,0,.1)",
        boxShadow: "0 12px 40px rgba(0,0,0,.6)",
      }}
    >
      {photoGrid()}
      {templatePreview && (
        <img
          src={templatePreview}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
          }}
          alt=""
        />
      )}
    </div>
  );
}

export default function Output({
  photos,
  settings,
  localPath,
  setLocalPath,
  cloudFolder,
  setCloudFolder,
  pathLocked,
  setPathLocked,
  printers,
  setPrinters,
  selectedPrinter,
  setSelectedPrinter,
  printerLocked,
  setSelectedPrinterLocked,
  onBack,
}) {
  const { layout, templatePreview } = settings;
  const sid = useRef(`SB${Date.now().toString(36).toUpperCase()}`);

  // ── Process state ──
  const { eventName } = settings;
  const photoIndex = useRef(1); // auto-increment filename counter
  const [processStatus, setProcessStatus] = useState("idle"); // idle | running | done
  const [processSteps, setProcessSteps] = useState([
    { id: "render", label: "Render foto + frame template" },
    { id: "save", label: "Simpan ke disk lokal" },
    { id: "upload", label: "Upload ke cloud storage" },
  ]);
  const [processProgress, setProcessProgress] = useState(0);

  // ── Print state (printers/selectedPrinter/printerLocked from App props) ──
  const [printerDropOpen, setPrinterDropOpen] = useState(false);
  const [printStatus, setPrintStatus] = useState("idle"); // idle | printing | done

  // ── Guest / WA state ──
  const [guestMode, setGuestMode] = useState("name"); // "name" | "wa" | "qr"
  const [guestQuery, setGuestQuery] = useState("");
  const [guestResults, setGuestResults] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [waNumber, setWaNumber] = useState(""); // direct WA input
  const [waStatus, setWaStatus] = useState("idle"); // idle | sending | done | error
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);

  const processDone = processStatus === "done";

  // Auto-detect printers on mount (only if not locked/already selected)
  useEffect(() => {
    if (printerLocked || selectedPrinter) return;
    const mock = [
      { id: "p1", name: "Canon SELPHY CP1500", status: "ready" },
      { id: "p2", name: "Epson L805", status: "ready" },
      { id: "p3", name: "DNP DS620A", status: "offline" },
    ];
    // Auto-pick first ready printer
    const firstReady = mock.find((p) => p.status === "ready") || mock[0];
    setPrinters(mock);
    setSelectedPrinter(firstReady);
  }, []);

  // ── Scan printers (manual refresh) ──
  const scanPrinters = () => {
    setPrinterDropOpen(true);
    setTimeout(() => {
      const mock = [
        { id: "p1", name: "Canon SELPHY CP1500", status: "ready" },
        { id: "p2", name: "Epson L805", status: "ready" },
        { id: "p3", name: "DNP DS620A", status: "offline" },
      ];
      setPrinters(mock);
      if (!selectedPrinter) setSelectedPrinter(mock[0]);
    }, 600);
  };

  // ── Run process ──
  const runProcess = () => {
    if (processStatus !== "idle") return;
    setProcessStatus("running");
    const delays = [900, 700, 1100];
    let cum = 0;
    delays.forEach((d, i) => {
      cum += d;
      setTimeout(() => {
        setProcessSteps((prev) =>
          prev.map((s, j) => (j === i ? { ...s, done: true } : s)),
        );
        setProcessProgress(Math.round(((i + 1) / delays.length) * 100));
        if (i === delays.length - 1) setProcessStatus("done");
      }, cum);
    });
  };

  // ── Print (foto only, no frame) ──
  const runPrint = () => {
    if (!processDone || !selectedPrinter || printStatus !== "idle") return;
    setPrintStatus("printing");
    setTimeout(() => setPrintStatus("done"), 2200);
  };

  // ── Guest search ──
  const searchGuest = (q) => {
    setGuestQuery(q);
    setSelectedGuest(null);
    setWaStatus("idle");
    if (q.trim().length < 2) {
      setGuestResults([]);
      return;
    }
    const r = GUEST_DB.filter(
      (g) =>
        g.name.toLowerCase().includes(q.toLowerCase()) ||
        g.id.toLowerCase().includes(q.toLowerCase()),
    );
    setGuestResults(r);
  };

  const selectGuest = (g) => {
    setSelectedGuest(g);
    setGuestQuery(g.name);
    setGuestResults([]);
  };

  const sendWa = () => {
    const target = guestMode === "wa" ? waNumber : selectedGuest?.wa;
    if (!target || !processDone || waStatus !== "idle") return;
    setWaStatus("sending");
    setTimeout(() => setWaStatus("done"), 1800);
  };

  const canSendWa = () => {
    if (!processDone || waStatus !== "idle") return false;
    if (guestMode === "wa") return waNumber.replace(/\D/g, "").length >= 9;
    return !!selectedGuest;
  };

  // Simulate QR scan — finds guest from DB by mock QR code
  const simulateQrScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      const found = GUEST_DB[Math.floor(Math.random() * GUEST_DB.length)];
      setSelectedGuest(found);
      setGuestQuery(found.name);
      setQrScanning(false);
      setQrModalOpen(false);
    }, 2200);
  };

  const switchMode = (mode) => {
    setGuestMode(mode);
    setGuestQuery("");
    setGuestResults([]);
    setSelectedGuest(null);
    setWaNumber("");
    setWaStatus("idle");
  };

  const Section = ({ title, children, style = {} }) => (
    <div className="card" style={{ padding: "20px 22px", ...style }}>
      <div
        style={{
          color: "rgba(0,0,0,.6)",
          fontSize: "10px",
          letterSpacing: "3px",
          marginBottom: "16px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

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

      {/* Header */}
      <div
        style={{
          padding: "13px 22px",
          background: "rgba(0,0,0,.03)",
          borderBottom: "1px solid rgba(0,0,0,.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            className="ghost-btn"
            onClick={onBack}
            style={{ padding: "7px 14px", fontSize: "11px" }}
          >
            ← Kembali
          </button>
          <span
            style={{
              color: "var(--secondary)",
              fontFamily: "var(--f)",
              fontStyle: "italic",
              fontSize: "18px",
            }}
          >
            Snapbooth
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              color: "rgba(0,0,0,.4)",
              fontSize: "10px",
              letterSpacing: "2px",
            }}
          >
            SESSION
          </div>
          <div
            style={{
              color: "var(--secondary)",
              fontSize: "12px",
              letterSpacing: "3px",
            }}
          >
            {sid.current}
          </div>
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(0,0,0,.4)",
            letterSpacing: "1px",
          }}
        >
          {layout.label} · {layout.orientation}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── LEFT: Preview ── */}
        <div
          style={{
            width: "300px",
            background: "rgba(0,0,0,.03)",
            borderRight: "1px solid rgba(0,0,0,.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 20px",
            gap: "20px",
            flexShrink: 0,
          }}
        >
          <CompositePreview
            photos={photos}
            layout={layout}
            templatePreview={templatePreview}
          />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "rgba(0,0,0,.4)",
                fontSize: "10px",
                letterSpacing: "2px",
                marginBottom: "4px",
              }}
            >
              HASIL AKHIR
            </div>
            <div style={{ color: "rgba(0,0,0,.4)", fontSize: "11px" }}>
              Foto + Template Frame
            </div>
          </div>

          {/* Status badge */}
          {processDone && (
            <div
              style={{
                width: "100%",
                background: "rgba(76,175,80,.08)",
                border: "1px solid rgba(76,175,80,.25)",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(76,175,80,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--green)",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div>
                <div
                  style={{
                    color: "var(--green)",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  Proses Selesai
                </div>
                <div
                  style={{
                    color: "rgba(0,0,0,.4)",
                    fontSize: "10px",
                    marginTop: "2px",
                  }}
                >
                  File tersimpan & terupload
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Actions ── */}
        <div
          className="scroll"
          style={{
            flex: 1,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* ── 1. PROSES ── */}
          <Section
            title="① PROSES · RENDER + SAVE + UPLOAD"
            style={{
              borderColor: processDone
                ? "rgba(76,175,80,.35)"
                : "rgba(0,0,0,.1)",
            }}
          >
            {/* Local path */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  color: "rgba(0,0,0,.4)",
                  fontSize: "11px",
                  marginBottom: "7px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>💾</span> Path penyimpanan lokal
                {pathLocked && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--secondary)",
                      fontSize: "10px",
                      background: "rgba(65,139,250,.1)",
                      border: "1px solid rgba(65,139,250,.25)",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    🔒 Terkunci
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={localPath}
                  onChange={(e) => !pathLocked && setLocalPath(e.target.value)}
                  readOnly={pathLocked}
                  placeholder="Contoh: C:\Photobooth"
                  style={{
                    flex: 1,
                    cursor: pathLocked ? "default" : "text",
                    borderColor: pathLocked
                      ? "rgba(65,139,250,.3)"
                      : "rgba(0,0,0,.1)",
                    background: pathLocked
                      ? "rgba(65,139,250,.04)"
                      : "rgba(255,255,255,.04)",
                  }}
                />
                {!pathLocked && (
                  <button
                    className="ghost-btn"
                    style={{
                      padding: "8px 14px",
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    📁 Browse
                  </button>
                )}
              </div>
              {localPath && eventName && (
                <div
                  style={{
                    marginTop: "6px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(0,0,0,.1)",
                    color: "rgba(0,0,0,.4)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "var(--secondary)" }}>📁</span>
                  <span style={{ color: "rgba(0,0,0,.6)" }}>
                    {localPath.replace(/\+$/, "")}
                  </span>
                  <span style={{ color: "var(--secondary)" }}>
                    \{eventName}\
                  </span>
                  <span style={{ color: "rgba(0,0,0,.4)" }}>
                    foto_001.jpg, foto_002.jpg...
                  </span>
                </div>
              )}
            </div>

            {/* Cloud folder */}
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  color: "rgba(0,0,0,.4)",
                  fontSize: "11px",
                  marginBottom: "7px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>☁</span> Folder cloud (Google Drive / Dropbox)
                {pathLocked && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--secondary)",
                      fontSize: "10px",
                      background: "rgba(65,139,250,.1)",
                      border: "1px solid rgba(65,139,250,.25)",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    🔒 Terkunci
                  </span>
                )}
              </div>
              <input
                type="text"
                value={cloudFolder}
                onChange={(e) => !pathLocked && setCloudFolder(e.target.value)}
                readOnly={pathLocked}
                placeholder="nama-folder/sub-folder/"
                style={{
                  cursor: pathLocked ? "default" : "text",
                  borderColor: pathLocked
                    ? "rgba(65,139,250,.3)"
                    : "rgba(0,0,0,.1)",
                  background: pathLocked
                    ? "rgba(65,139,250,.04)"
                    : "rgba(255,255,255,.04)",
                }}
              />
            </div>

            {/* Progress */}
            {processStatus !== "idle" && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "rgba(0,0,0,.4)", fontSize: "11px" }}>
                    Progress
                  </span>
                  <span style={{ color: "var(--secondary)", fontSize: "11px" }}>
                    {processProgress}%
                  </span>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,.05)",
                    borderRadius: "4px",
                    height: "5px",
                    overflow: "hidden",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg,var(--gold-d),var(--secondary),var(--gold-l))",
                      width: `${processProgress}%`,
                      transition: "width .5s ease",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {processSteps.map((s, i) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: s.done
                            ? "rgba(76,175,80,.2)"
                            : "rgba(255,255,255,.04)",
                          border: `1px solid ${s.done ? "var(--green)" : "rgba(0,0,0,.1)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          color: s.done ? "var(--green)" : "rgba(0,0,0,.4)",
                          transition: "all .35s",
                        }}
                      >
                        {s.done ? "✓" : i + 1}
                      </div>
                      <span
                        style={{
                          color: s.done ? "var(--primary)" : "rgba(0,0,0,.4)",
                          fontSize: "12px",
                          transition: "color .3s",
                        }}
                      >
                        {s.label}
                      </span>
                      {i === 1 && s.done && (
                        <span
                          style={{
                            color: "var(--secondary)",
                            fontSize: "10px",
                            opacity: 0.6,
                          }}
                        >
                          {localPath}\{eventName}\foto_
                          {String(photoIndex.current).padStart(3, "0")}.jpg
                        </span>
                      )}
                      {i === 2 && s.done && (
                        <span
                          style={{
                            color: "var(--secondary)",
                            fontSize: "10px",
                            opacity: 0.6,
                          }}
                        >
                          {cloudFolder}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              {/* Lock path toggle */}
              {processStatus === "idle" && localPath && (
                <button
                  onClick={() => setPathLocked(!pathLocked)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${pathLocked ? "rgba(65,139,250,.4)" : "rgba(0,0,0,.1)"}`,
                    borderRadius: "7px",
                    padding: "7px 14px",
                    cursor: "pointer",
                    color: pathLocked ? "var(--secondary)" : "rgba(0,0,0,.4)",
                    fontFamily: "var(--f)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all .2s",
                  }}
                >
                  {pathLocked ? "🔒 Path terkunci" : "🔓 Kunci path"}
                </button>
              )}
              <div style={{ marginLeft: "auto" }}>
                {processStatus === "idle" && (
                  <button
                    className="primary-btn"
                    onClick={runProcess}
                    style={{
                      borderRadius: "8px",
                      padding: "13px 36px",
                      fontSize: "13px",
                    }}
                  >
                    ⚙ Proses
                  </button>
                )}
                {processStatus === "running" && (
                  <div
                    style={{
                      color: "rgba(0,0,0,.4)",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ animation: "shimmer 1s infinite" }}>⟳</span>{" "}
                    Memproses...
                  </div>
                )}
                {processStatus === "done" && (
                  <div
                    style={{
                      color: "var(--green)",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    ✓ Proses selesai
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* ── 2. PRINT ── */}
          <Section
            title="② CETAK FOTO (tanpa frame)"
            style={{
              borderColor:
                printStatus === "done"
                  ? "rgba(76,175,80,.35)"
                  : !processDone
                    ? "rgba(0,0,0,.1)"
                    : "rgba(0,0,0,.1)",
              opacity: processDone ? 1 : 0.55,
            }}
          >
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  color: "rgba(0,0,0,.4)",
                  fontSize: "11px",
                  marginBottom: "8px",
                }}
              >
                Pilih printer aktif
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={
                    processDone && !printerLocked ? scanPrinters : undefined
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: "9px",
                    background: printerLocked
                      ? "rgba(65,139,250,.04)"
                      : "rgba(255,255,255,.04)",
                    border: `1px solid ${printerLocked ? "rgba(65,139,250,.3)" : printerDropOpen ? "var(--secondary)" : "rgba(0,0,0,.1)"}`,
                    color: selectedPrinter
                      ? "var(--primary)"
                      : "rgba(0,0,0,.4)",
                    fontFamily: "var(--f)",
                    fontSize: "12px",
                    cursor:
                      processDone && !printerLocked ? "pointer" : "not-allowed",
                    transition: "all .2s",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>🖨</span>
                    <span>
                      {selectedPrinter
                        ? selectedPrinter.name
                        : "Klik untuk deteksi printer..."}
                    </span>
                    {selectedPrinter && (
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background:
                            selectedPrinter.status === "ready"
                              ? "rgba(76,175,80,.15)"
                              : "rgba(239,83,80,.15)",
                          color:
                            selectedPrinter.status === "ready"
                              ? "var(--green)"
                              : "var(--red)",
                          border: `1px solid ${selectedPrinter.status === "ready" ? "rgba(76,175,80,.3)" : "rgba(239,83,80,.3)"}`,
                        }}
                      >
                        {selectedPrinter.status}
                      </span>
                    )}
                  </div>
                  {printerLocked ? (
                    <span
                      style={{
                        color: "var(--secondary)",
                        fontSize: "10px",
                        background: "rgba(65,139,250,.1)",
                        border: "1px solid rgba(65,139,250,.25)",
                        borderRadius: "4px",
                        padding: "2px 8px",
                      }}
                    >
                      🔒 Terkunci
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "var(--secondary)",
                        fontSize: "11px",
                        transform: printerDropOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform .2s",
                      }}
                    >
                      ▾
                    </span>
                  )}
                </button>
                {printerDropOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% - 2px)",
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      background: "var(--bg)",
                      border: "1px solid var(--secondary)",
                      borderRadius: "0 0 10px 10px",
                      overflow: "hidden",
                      boxShadow: "0 12px 40px rgba(0,0,0,.7)",
                      animation: "fadeUp .18s ease",
                    }}
                  >
                    {printers.length === 0 ? (
                      <div
                        style={{
                          padding: "14px 16px",
                          color: "rgba(0,0,0,.4)",
                          fontSize: "12px",
                        }}
                      >
                        Mendeteksi printer...
                      </div>
                    ) : (
                      printers.map((p, i) => {
                        const isActive = selectedPrinter?.id === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedPrinter(p);
                              setPrinterDropOpen(false);
                            }}
                            style={{
                              padding: "11px 16px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              background: isActive
                                ? "rgba(65,139,250,.1)"
                                : "transparent",
                              borderBottom:
                                i < printers.length - 1
                                  ? "1px solid rgba(0,0,0,.1)"
                                  : "none",
                              transition: "background .15s",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive)
                                e.currentTarget.style.background =
                                  "rgba(255,255,255,.04)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive)
                                e.currentTarget.style.background =
                                  "transparent";
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>🖨</span>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  color: isActive
                                    ? "var(--secondary)"
                                    : "var(--primary)",
                                  fontSize: "12px",
                                }}
                              >
                                {p.name}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: "9px",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                background:
                                  p.status === "ready"
                                    ? "rgba(76,175,80,.15)"
                                    : "rgba(239,83,80,.15)",
                                color:
                                  p.status === "ready"
                                    ? "var(--green)"
                                    : "var(--red)",
                              }}
                            >
                              {p.status}
                            </span>
                            {isActive && (
                              <span
                                style={{
                                  color: "var(--secondary)",
                                  fontSize: "12px",
                                }}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div
                      onClick={scanPrinters}
                      style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        borderTop: "1px solid rgba(0,0,0,.1)",
                        color: "rgba(0,0,0,.4)",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--secondary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(0,0,0,.4)")
                      }
                    >
                      <span>⟳</span> Scan ulang
                    </div>
                  </div>
                )}
                {printerDropOpen && (
                  <div
                    onClick={() => setPrinterDropOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 49 }}
                  />
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                }}
              >
                <div style={{ color: "rgba(0,0,0,.4)", fontSize: "11px" }}>
                  {printStatus === "done"
                    ? "✓ Terkirim ke printer"
                    : printStatus === "printing"
                      ? "⟳ Mencetak..."
                      : !processDone
                        ? "Selesaikan proses terlebih dahulu"
                        : !selectedPrinter
                          ? "Pilih printer terlebih dahulu"
                          : "Siap cetak"}
                </div>
                {selectedPrinter && processDone && printStatus === "idle" && (
                  <button
                    onClick={() => setSelectedPrinterLocked(!printerLocked)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${printerLocked ? "rgba(65,139,250,.4)" : "rgba(0,0,0,.1)"}`,
                      borderRadius: "7px",
                      padding: "5px 12px",
                      cursor: "pointer",
                      color: printerLocked
                        ? "var(--secondary)"
                        : "rgba(0,0,0,.4)",
                      fontFamily: "var(--f)",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all .2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {printerLocked ? "🔒 Terkunci" : "🔓 Kunci printer"}
                  </button>
                )}
              </div>
              <button
                onClick={runPrint}
                disabled={
                  !processDone || !selectedPrinter || printStatus !== "idle"
                }
                style={{
                  borderRadius: "8px",
                  padding: "12px 28px",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  border: "none",
                  cursor:
                    processDone && selectedPrinter && printStatus === "idle"
                      ? "pointer"
                      : "not-allowed",
                  fontFamily: "var(--f)",
                  fontWeight: 600,
                  transition: "all .3s",
                  background:
                    printStatus === "done"
                      ? "rgba(76,175,80,.2)"
                      : processDone && selectedPrinter && printStatus === "idle"
                        ? "linear-gradient(135deg,var(--gold-d),var(--secondary),var(--gold-l))"
                        : "rgba(255,255,255,.06)",
                  color:
                    printStatus === "done"
                      ? "var(--green)"
                      : processDone && selectedPrinter && printStatus === "idle"
                        ? "#0c0900"
                        : "rgba(0,0,0,.4)",
                  boxShadow:
                    processDone && selectedPrinter && printStatus === "idle"
                      ? "0 4px 20px rgba(65,139,250,.3)"
                      : "none",
                }}
              >
                {printStatus === "done"
                  ? "✓ Tercetak"
                  : printStatus === "printing"
                    ? "Mencetak..."
                    : "🖨 Print"}
              </button>
            </div>
          </Section>

          {/* ── 3. TAMU / WA ── */}
          <Section title="③ KIRIM KE TAMU (opsional)">
            {/* Mode toggle */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "16px",
                background: "rgba(255,255,255,.04)",
                borderRadius: "9px",
                padding: "4px",
              }}
            >
              {[
                { id: "name", icon: "🔍", label: "Nama / ID" },
                { id: "wa", icon: "💬", label: "No. WA" },
                { id: "qr", icon: "▦", label: "Scan QR" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => switchMode(m.id)}
                  style={{
                    flex: 1,
                    padding: "8px 6px",
                    borderRadius: "7px",
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "var(--f)",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    transition: "all .2s",
                    background:
                      guestMode === m.id
                        ? "rgba(65,139,250,.18)"
                        : "transparent",
                    color:
                      guestMode === m.id
                        ? "var(--secondary)"
                        : "rgba(0,0,0,.4)",
                    outline:
                      guestMode === m.id
                        ? "1px solid rgba(65,139,250,.35)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {/* ── MODE: Nama / ID ── */}
            {guestMode === "name" && (
              <div style={{ position: "relative", marginBottom: "14px" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={guestQuery}
                    onChange={(e) => searchGuest(e.target.value)}
                    placeholder="Ketik nama tamu atau ID (cth: G001)..."
                    style={{ paddingLeft: "38px" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      pointerEvents: "none",
                    }}
                  >
                    🔍
                  </span>
                  {guestQuery && (
                    <button
                      onClick={() => {
                        setGuestQuery("");
                        setGuestResults([]);
                        setSelectedGuest(null);
                        setWaStatus("idle");
                      }}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(0,0,0,.4)",
                        fontSize: "14px",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown results */}
                {guestResults.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% - 2px)",
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      background: "var(--bg)",
                      border: "1px solid var(--secondary)",
                      borderRadius: "0 0 10px 10px",
                      overflow: "hidden",
                      boxShadow: "0 12px 40px rgba(0,0,0,.7)",
                      animation: "fadeUp .18s ease",
                    }}
                  >
                    {guestResults.map((g, i) => (
                      <div
                        key={g.id}
                        onClick={() => selectGuest(g)}
                        style={{
                          padding: "11px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          borderBottom:
                            i < guestResults.length - 1
                              ? "1px solid rgba(0,0,0,.1)"
                              : "none",
                          transition: "background .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: "rgba(65,139,250,.1)",
                            border: "1px solid rgba(65,139,250,.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--secondary)",
                            fontSize: "12px",
                            flexShrink: 0,
                          }}
                        >
                          {g.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              color: "var(--primary)",
                              fontSize: "12px",
                            }}
                          >
                            {g.name}
                          </div>
                          <div
                            style={{
                              color: "rgba(0,0,0,.4)",
                              fontSize: "10px",
                              marginTop: "2px",
                            }}
                          >
                            ID: {g.id} · 📱 +{g.wa}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {guestQuery && guestResults.length === 0 && !selectedGuest && (
                  <div
                    style={{
                      marginTop: "8px",
                      color: "rgba(0,0,0,.4)",
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                  >
                    Tidak ada tamu ditemukan
                  </div>
                )}
              </div>
            )}

            {/* ── MODE: Nomor WA langsung ── */}
            {guestMode === "wa" && (
              <div style={{ marginBottom: "14px" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="tel"
                    value={waNumber}
                    onChange={(e) => {
                      setWaNumber(e.target.value);
                      setWaStatus("idle");
                    }}
                    placeholder="cth: 08123456789 atau +6281234..."
                    style={{ paddingLeft: "38px" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      pointerEvents: "none",
                    }}
                  >
                    📱
                  </span>
                  {waNumber && (
                    <button
                      onClick={() => {
                        setWaNumber("");
                        setWaStatus("idle");
                      }}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(0,0,0,.4)",
                        fontSize: "14px",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {waNumber.replace(/\D/g, "").length > 0 &&
                  waNumber.replace(/\D/g, "").length < 9 && (
                    <div
                      style={{
                        marginTop: "6px",
                        color: "rgba(0,0,0,.4)",
                        fontSize: "10px",
                      }}
                    >
                      Nomor terlalu pendek
                    </div>
                  )}
              </div>
            )}

            {/* ── MODE: QR ── */}
            {guestMode === "qr" && (
              <div style={{ marginBottom: "14px" }}>
                {!selectedGuest ? (
                  <button
                    onClick={() => setQrModalOpen(true)}
                    style={{
                      width: "100%",
                      padding: "18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: "rgba(255,255,255,.03)",
                      border: "1px dashed rgba(0,0,0,.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      fontFamily: "var(--f)",
                      transition: "border-color .2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "var(--secondary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(0,0,0,.1)")
                    }
                  >
                    <span style={{ fontSize: "32px", opacity: 0.6 }}>▦</span>
                    <div
                      style={{
                        color: "rgba(0,0,0,.6)",
                        fontSize: "12px",
                        letterSpacing: "1px",
                      }}
                    >
                      Buka kamera scan QR
                    </div>
                    <div style={{ color: "rgba(0,0,0,.4)", fontSize: "10px" }}>
                      Gunakan webcam laptop · data tamu diambil dari database
                    </div>
                  </button>
                ) : (
                  <div
                    style={{
                      color: "rgba(0,0,0,.4)",
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                  >
                    ✓ QR terbaca — tamu ditemukan
                  </div>
                )}
              </div>
            )}

            {/* Selected guest card (nama/ID and QR mode) */}
            {selectedGuest && guestMode !== "wa" && (
              <div
                style={{
                  background: "rgba(65,139,250,.06)",
                  border: "1px solid rgba(65,139,250,.2)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: "fadeUp .2s ease",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(65,139,250,.15)",
                    border: "1px solid rgba(65,139,250,.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--secondary)",
                    fontSize: "15px",
                    fontFamily: "var(--f)",
                    flexShrink: 0,
                  }}
                >
                  {selectedGuest.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "var(--primary)",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {selectedGuest.name}
                  </div>
                  <div
                    style={{
                      color: "rgba(0,0,0,.4)",
                      fontSize: "11px",
                      marginTop: "2px",
                    }}
                  >
                    <span style={{ color: "#25d366" }}>📱</span> +
                    {selectedGuest.wa}
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "rgba(0,0,0,.4)",
                        fontSize: "10px",
                      }}
                    >
                      ID: {selectedGuest.id}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedGuest(null);
                    setGuestQuery("");
                    setWaStatus("idle");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(0,0,0,.4)",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Send button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={sendWa}
                disabled={!canSendWa()}
                style={{
                  padding: "11px 28px",
                  borderRadius: "8px",
                  fontFamily: "var(--f)",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  cursor: canSendWa() ? "pointer" : "not-allowed",
                  border: "none",
                  fontWeight: 600,
                  transition: "all .3s",
                  background:
                    waStatus === "done"
                      ? "rgba(37,211,102,.2)"
                      : waStatus === "sending"
                        ? "rgba(37,211,102,.15)"
                        : canSendWa()
                          ? "#25d366"
                          : "rgba(255,255,255,.06)",
                  color:
                    waStatus === "done"
                      ? "#25d366"
                      : waStatus === "sending"
                        ? "#25d366"
                        : canSendWa()
                          ? "#fff"
                          : "rgba(0,0,0,.4)",
                }}
              >
                {waStatus === "done"
                  ? "✓ Terkirim"
                  : waStatus === "sending"
                    ? "Mengirim..."
                    : "💬 Kirim WA"}
              </button>
            </div>
          </Section>

          {/* ── QR Modal ── */}
          {qrModalOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.85)",
                zIndex: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "rgba(0,0,0,.03)",
                  border: "1px solid rgba(0,0,0,.1)",
                  borderRadius: "16px",
                  padding: "32px",
                  width: "440px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--secondary)",
                      fontFamily: "var(--f)",
                      fontStyle: "italic",
                      fontSize: "18px",
                    }}
                  >
                    Scan QR Tamu
                  </div>
                  <button
                    onClick={() => {
                      setQrModalOpen(false);
                      setQrScanning(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(0,0,0,.4)",
                      fontSize: "20px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Webcam viewfinder mock */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#080808",
                    position: "relative",
                    border: "1px solid rgba(0,0,0,.1)",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "radial-gradient(ellipse at center,#161616,#050505)",
                      color: "#1a1a1a",
                      fontSize: "60px",
                    }}
                  >
                    📷
                  </div>
                  {/* Scan frame */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "160px",
                        height: "160px",
                        position: "relative",
                      }}
                    >
                      {[
                        ["top", "left"],
                        ["top", "right"],
                        ["bottom", "left"],
                        ["bottom", "right"],
                      ].map(([y, x], i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            [y]: "0",
                            [x]: "0",
                            width: "28px",
                            height: "28px",
                            [`border${y[0].toUpperCase() + y.slice(1)}`]:
                              "2.5px solid var(--secondary)",
                            [`border${x[0].toUpperCase() + x.slice(1)}`]:
                              "2.5px solid var(--secondary)",
                            opacity: 0.8,
                          }}
                        />
                      ))}
                      {/* scan line */}
                      {qrScanning && (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            height: "2px",
                            background:
                              "linear-gradient(90deg,transparent,var(--secondary),transparent)",
                            animation: "scanLine 1.5s ease-in-out infinite",
                            top: "50%",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {qrScanning && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(0,0,0,.8)",
                          color: "var(--secondary)",
                          fontSize: "11px",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          letterSpacing: "2px",
                        }}
                      >
                        SCANNING...
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    color: "rgba(0,0,0,.4)",
                    fontSize: "11px",
                    marginBottom: "20px",
                  }}
                >
                  Arahkan QR code tamu ke kamera laptop · data otomatis diambil
                  dari database
                </div>

                {!qrScanning ? (
                  <button
                    className="primary-btn"
                    onClick={simulateQrScan}
                    style={{
                      borderRadius: "8px",
                      padding: "12px 32px",
                      fontSize: "12px",
                    }}
                  >
                    ▶ Mulai Scan
                  </button>
                ) : (
                  <div style={{ color: "rgba(0,0,0,.4)", fontSize: "12px" }}>
                    Mendeteksi QR code...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
