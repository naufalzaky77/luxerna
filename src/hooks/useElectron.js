// src/hooks/useElectron.js
// ─── useElectron Hook ─────────────────────────────────────────────────────────
// Wraps window.electronAPI dengan fallback mock untuk development di browser
// Di Electron  → pakai API nyata (hardware)
// Di browser   → pakai mock/simulasi (untuk development prototype)

const isElectron = typeof window !== "undefined" && !!window.electronAPI;

// ─── Mock data untuk development di browser ───────────────────────────────────
const MOCK_PRINTERS = [
  { name: "Canon SELPHY CP1500", status: "ready",   isDefault: true  },
  { name: "Epson L805",          status: "ready",   isDefault: false },
  { name: "DNP DS620A",          status: "offline", isDefault: false },
];

const MOCK_CAMERAS = [
  { model: "Canon EOS 200D", port: "usb:001,005" },
  { model: "Nikon D3500",    port: "usb:001,006" },
];

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useElectron() {

  // ── Pilih folder (browse) ──────────────────────────────────────────────────
  const selectFolder = async () => {
    if (isElectron) {
      return await window.electronAPI.selectFolder();
    }
    // Browser mock: return dummy path
    return "D:\\Photobooth";
  };

  // ── Simpan foto ke disk ────────────────────────────────────────────────────
  // data: base64 string dari canvas
  const savePhoto = async ({ folderPath, eventName, fileName, data }) => {
    if (isElectron) {
      return await window.electronAPI.savePhoto({ folderPath, eventName, fileName, data });
    }
    // Mock: simulasi delay save
    await delay(400);
    return { success: true, filePath: `${folderPath}\\${eventName}\\${fileName}` };
  };

  // ── Buka folder di Explorer ────────────────────────────────────────────────
  const openFolder = async (folderPath) => {
    if (isElectron) {
      return await window.electronAPI.openFolder(folderPath);
    }
    console.log("Open folder:", folderPath);
  };

  // ── List kamera DSLR ───────────────────────────────────────────────────────
  // Untuk webcam: gunakan navigator.mediaDevices langsung di React
  // Untuk DSLR: lewat IPC ini
  const listDSLR = async () => {
    if (isElectron) {
      return await window.electronAPI.listDSLR();
    }
    await delay(800);
    return { cameras: MOCK_CAMERAS };
  };

  // ── Trigger shutter DSLR ──────────────────────────────────────────────────
  const capturePhoto = async ({ savePath } = {}) => {
    if (isElectron) {
      return await window.electronAPI.capturePhoto({ savePath });
    }
    // Mock: return placeholder base64 image
    await delay(500);
    return {
      success: true,
      filePath: savePath || "C:\\temp\\snapbooth_mock.jpg",
      base64: MOCK_PHOTO_BASE64,
    };
  };

  // ── List printer ──────────────────────────────────────────────────────────
  const listPrinters = async () => {
    if (isElectron) {
      return await window.electronAPI.listPrinters();
    }
    await delay(600);
    return { printers: MOCK_PRINTERS };
  };

  // ── Cetak foto ────────────────────────────────────────────────────────────
  const printPhoto = async ({ printerName, filePath, copies = 1 }) => {
    if (isElectron) {
      return await window.electronAPI.printPhoto({ printerName, filePath, copies });
    }
    await delay(1500);
    console.log(`[Mock] Print "${filePath}" → "${printerName}" (${copies}x)`);
    return { success: true };
  };

  return {
    isElectron,
    selectFolder,
    savePhoto,
    openFolder,
    listDSLR,
    capturePhoto,
    listPrinters,
    printPhoto,
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Tiny 1x1 transparent PNG sebagai mock foto
const MOCK_PHOTO_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
