import { useState, useEffect, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import { GUEST_DB } from "../data/mockData";
import HeadBar from "../components/OtHeadBar";
import CompositePreview from "../components/OtCompositePreview";
import StatusBadge from "../components/OtStatusBadge";
import SectProses from "../components/OtSectionProses";
import SectCetak from "../components/OtSectionCetak";
import SectKirim from "../components/OtSectionKirim";
import { renderComposite } from "../utils/renderComposite";

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

  // ── STATE PROSES ──
  const { eventName } = settings;
  const photoIndex = useRef(1); // auto-increment filename counter
  const [processStatus, setProcessStatus] = useState("idle"); // idle | running | done
  const [processSteps, setProcessSteps] = useState([
    { id: "render", label: "Render foto + frame template" },
    { id: "save", label: "Simpan ke disk lokal" },
    { id: "upload", label: "Upload ke cloud storage" },
  ]);
  const [processProgress, setProcessProgress] = useState(0);
  const processDone = processStatus === "done";

  // ── STATE CETAK ──
  const [printerDropOpen, setPrinterDropOpen] = useState(false);
  const [printStatus, setPrintStatus] = useState("idle"); // idle | printing | done
  const [printerScanning, setPrinterScanning] = useState(false);
  const [printCount, setPrintCount] = useState(1);
  const [printDone, setPrintDone] = useState(0);

  // ── STATE KIRIM ──
  const [guestMode, setGuestMode] = useState("name"); // "name" | "wa" | "qr"
  const [guestQuery, setGuestQuery] = useState("");
  const [guestResults, setGuestResults] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [waNumber, setWaNumber] = useState(""); // direct WA input
  const [waStatus, setWaStatus] = useState("idle"); // idle | sending | done | error
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);

  // ── Run PROSES ──
  const runProcess = async () => {
    if (processStatus !== "idle") return;
    if (!pathLocked || !localPath) return;

    setProcessStatus("running");

    try {
      // ── Step 1: Render ──
      setProcessSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, running: true } : s)),
      );
      const base64 = await renderComposite({ layout, photos, templatePreview });
      setProcessSteps((prev) =>
        prev.map((s, i) =>
          i === 0 ? { ...s, done: true, running: false } : s,
        ),
      );
      setProcessProgress(33);

      // ── Step 2: Save ──
      setProcessSteps((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, running: true } : s)),
      );
      const fileName = `foto_${String(photoIndex.current).padStart(3, "0")}.png`;
      const data = base64.replace(/^data:image\/png;base64,/, "");
      const result = await window.electronAPI.savePhoto({
        folderPath: localPath,
        eventName,
        fileName,
        data,
      });
      if (!result.success) throw new Error(result.error);
      photoIndex.current += 1;
      setProcessSteps((prev) =>
        prev.map((s, i) =>
          i === 1 ? { ...s, done: true, running: false } : s,
        ),
      );
      setProcessProgress(66);

      // ── Step 3: Upload cloud (skip kalau belum ada) ──
      setProcessSteps((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, running: true } : s)),
      );
      // TODO: implement Google Drive upload
      await new Promise((r) => setTimeout(r, 500)); // placeholder
      setProcessSteps((prev) =>
        prev.map((s, i) =>
          i === 2 ? { ...s, done: true, running: false } : s,
        ),
      );
      setProcessProgress(100);

      setProcessStatus("done");
    } catch (err) {
      console.error("Process error:", err);
      setProcessStatus("idle");
    }
  };

  // ── Run CETAK (cuma foto tanpa frame) ──
  const runPrint = () => {
    if (!processDone || !selectedPrinter || printStatus !== "idle") return;
    setPrintStatus("printing");
    setTimeout(() => {
      setPrintStatus("idle");
      setPrintDone((prev) => prev + 1);
    }, 2200);
  };

  // ── CARI TAMU ──
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
    if (guestMode === "wa") return waNumber.length >= 9;
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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#dedede",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--f)",
        overflow: "hidden",
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
      />

      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* ── BAGIAN KOLOM KIRI ── */}
        <div
          style={{
            width: "20rem",
            background: "var(--white)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem 2rem",
            gap: "2.5rem",
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
                color: "var(--primary)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-bold)",
                fontSize: "var(--fs-h1)",
                letterSpacing: ".1rem",
                marginTop: ".5rem",
                marginBottom: ".5rem",
              }}
            >
              HASIL AKHIR
            </div>
            <div
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-medium)",
                fontSize: "var(--fs-h3)",
                fontStyle: "italic",
              }}
            >
              ( Foto + Bingkai )
            </div>
          </div>

          <StatusBadge
            processDone={processDone}
            printDone={printDone}
            printStatus={printStatus}
            waStatus={waStatus}
          />
        </div>

        {/* ── BAGIAN KOLOM KANAN ── */}
        {/* Bagian Biar Bisa Scroll kalau mode window */}
        <div
          className="scroll"
          style={{
            flex: 1,
            padding: "2rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <SectProses
            localPath={localPath}
            setLocalPath={setLocalPath}
            cloudFolder={cloudFolder}
            setCloudFolder={setCloudFolder}
            pathLocked={pathLocked}
            setPathLocked={setPathLocked}
            eventName={eventName}
            photoIndex={photoIndex}
            processStatus={processStatus}
            processSteps={processSteps}
            processProgress={processProgress}
            runProcess={runProcess}
          />

          <SectCetak
            printers={printers}
            setPrinters={setPrinters}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            printerLocked={printerLocked}
            setSelectedPrinterLocked={setSelectedPrinterLocked}
            processDone={processDone}
            printStatus={printStatus}
            printCount={printCount}
            setPrintCount={setPrintCount}
            runPrint={runPrint}
            printDone={printDone}
            printerDropOpen={printerDropOpen}
            setPrinterDropOpen={setPrinterDropOpen}
            printerScanning={printerScanning}
            setPrinterScanning={setPrinterScanning}
          />

          <SectKirim
            processDone={processDone}
            waStatus={waStatus}
            setWaStatus={setWaStatus}
            guestMode={guestMode}
            switchMode={switchMode}
            guestQuery={guestQuery}
            setGuestQuery={setGuestQuery}
            searchGuest={searchGuest}
            guestResults={guestResults}
            setGuestResults={setGuestResults}
            selectGuest={selectGuest}
            selectedGuest={selectedGuest}
            setSelectedGuest={setSelectedGuest}
            waNumber={waNumber}
            setWaNumber={setWaNumber}
            sendWa={sendWa}
            canSendWa={canSendWa}
            qrModalOpen={qrModalOpen}
            setQrModalOpen={setQrModalOpen}
            simulateQrScan={simulateQrScan}
            qrScanning={qrScanning}
            selectedCamera={settings.selectedCamera}
          />
        </div>
      </div>
    </div>
  );
}
