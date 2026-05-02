import { useState, useEffect, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
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
  guestDB,
  photoIndex,
}) {
  const { layout, templatePreview } = settings;
  const [lastSavedPath, setLastSavedPath] = useState(null);

  // ── STATE PROSES ──
  const { eventName } = settings;
  const [processStatus, setProcessStatus] = useState("idle"); // idle | running | done
  const [processSteps, setProcessSteps] = useState([
    { id: "render", label: "Render foto + frame template" },
    { id: "save", label: "Simpan ke disk lokal" },
    { id: "upload", label: "Upload ke cloud storage" },
  ]);
  const [processProgress, setProcessProgress] = useState(0);
  const processDone = processStatus === "done" && !!lastSavedPath;

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

  useEffect(() => {
    if (!pathLocked || !localPath || !eventName) return;
    const checkLastIndex = async () => {
      const result = await window.electronAPI.getLastPhotoIndex({
        folderPath: localPath,
        eventName,
      });
      if (result.lastIndex) {
        photoIndex.current = result.lastIndex + 1;
      }
    };
    checkLastIndex();
  }, [pathLocked]);

  useEffect(() => {
    setProcessStatus("idle");
    setLastSavedPath(null);
    setProcessProgress(0);
    setProcessSteps([
      { id: "render", label: "Render foto + frame template" },
      { id: "save", label: "Simpan ke disk lokal" },
      { id: "upload", label: "Upload ke cloud storage" },
    ]);
    setPrintStatus("idle");
    setPrintDone(0);

    if (!pathLocked || !localPath || !eventName) return;
    const recheck = async () => {
      const result = await window.electronAPI.getLastPhotoIndex({
        folderPath: localPath,
        eventName,
      });
      photoIndex.current = (result.lastIndex || 0) + 1;
    };
    recheck();
  }, [layout.id]);

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
      const base64 = await renderComposite({
        layout,
        photos,
        templatePreview,
        forPrint: false,
      });
      const tempImg = new Image();
      tempImg.onload = () => (tempImg.src = base64);
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
      const fileName = `IMG_${String(photoIndex.current).padStart(3, "0")}.png`;
      const data = base64.replace(/^data:image\/png;base64,/, "");
      const result = await window.electronAPI.savePhoto({
        folderPath: localPath,
        eventName,
        fileName,
        data,
      });
      if (!result.success) throw new Error(result.error);
      setLastSavedPath(result.filePath);
      photoIndex.current += 1;
      setProcessSteps((prev) =>
        prev.map((s, i) =>
          i === 1 ? { ...s, done: true, running: false } : s,
        ),
      );
      setProcessProgress(66);

      // ── Step 3: Upload cloud ──
      setProcessSteps((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, running: true } : s)),
      );

      if (cloudFolder && cloudFolder.trim() !== "") {
        try {
          // Extract folder ID atau nama dari cloudFolder
          let folderId = cloudFolder;

          // Jika URL, extract folder ID
          if (cloudFolder.includes("/folders/")) {
            const match = cloudFolder.match(/\/folders\/([a-zA-Z0-9-_]+)/);
            if (match) folderId = match[1];
          } else if (cloudFolder.includes("?usp=sharing")) {
            // Remove ?usp=sharing parameter
            folderId = cloudFolder.replace("?usp=sharing", "").split("/").pop();
          }

          // Find folder untuk validate
          const folderCheck =
            await window.electronAPI.googleFindFolder(folderId);

          if (folderCheck.success) {
            // Upload foto
            await window.electronAPI.googleUploadFile({
              filePath: result.filePath,
              fileName: fileName,
              folderId: folderCheck.folderId,
            });
          }
        } catch (err) {
          // Continue process meski upload gagal
        }
      }

      setProcessSteps((prev) =>
        prev.map((s, i) =>
          i === 2 ? { ...s, done: true, running: false } : s,
        ),
      );
      setProcessProgress(100);

      setProcessStatus("done");
    } catch (err) {
      setProcessStatus("idle");
    }
  };

  // ── Run CETAK (cuma foto tanpa frame) ──
  const runPrint = async () => {
    if (!processDone || !selectedPrinter || printStatus !== "idle") return;
    if (!lastSavedPath) return;
    if (selectedPrinter.status === "offline") {
      alert("Printer offline atau tidak tersambung. Periksa koneksi printer.");
      return;
    }

    setPrintStatus("printing");

    try {
      // Render ulang khusus print (dengan rotasi landscape)
      const printBase64 = await renderComposite({
        layout,
        photos,
        templatePreview,
        forPrint: true,
      });

      if (window.electronAPI && window.electronAPI.printPhoto) {
        const result = await window.electronAPI.printPhoto({
          printerName: selectedPrinter.name,
          imageData: printBase64, // ← base64, bukan filePath
          copies: printCount,
          layoutId: layout.id,
        });

        if (!result.success) throw new Error(result.error || "Print gagal");
        setPrintDone((prev) => prev + printCount);
      }
    } catch (err) {
      // error handling
    } finally {
      setPrintStatus("idle");
    }
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
    const r = guestDB.filter(
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

  const sendWa = async () => {
    const raw = guestMode === "wa" ? waNumber : selectedGuest?.wa;
    if (!raw || waStatus !== "idle") return;
    if (guestMode !== "wa" && !processDone) return;

    // ✅ Normalisasi nomor WA
    let target = raw.replace(/\D/g, ""); // hapus semua selain angka
    if (target.startsWith("0")) {
      target = "62" + target.slice(1); // 08xxx → 628xxx
    }
    if (!target.startsWith("62")) {
      target = "62" + target; // tambah kode negara kalau belum ada
    }

    setWaStatus("sending");
    try {
      if (localPath && eventName) {
        await window.electronAPI.openFolder(localPath, eventName);
      }
      await window.electronAPI.waOpenChat({
        waNumber: target,
        eventName: settings.eventName,
      });
      setWaStatus("done");
    } catch (err) {
      setWaStatus("error");
    }
  };

  const canSendWa = () => {
    if (waStatus !== "idle") return false;
    if (guestMode === "wa") return waNumber.length >= 9;
    if (!processDone) return false;
    return !!selectedGuest;
  };

  // Simulate QR scan — finds guest from DB by mock QR code
  const simulateQrScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      if (guestDB.length > 0) {
        const found = guestDB[Math.floor(Math.random() * guestDB.length)];
        setSelectedGuest(found);
        setGuestQuery(found.name);
      }
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
            guestDB={guestDB}
          />
        </div>
      </div>
    </div>
  );
}
