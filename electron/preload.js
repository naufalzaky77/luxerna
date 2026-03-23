// electron/preload.js
// ─── Preload Script ───────────────────────────────────────────────────────────
// Jembatan aman antara main process (Node.js) dan renderer (React)
// contextIsolation: true  → React tidak bisa akses Node langsung
// Semua akses hardware harus lewat window.electronAPI ini

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  // ── File System ──────────────────────────────────────────────────────────
  selectFolder: () =>
    ipcRenderer.invoke("dialog:selectFolder"),

  savePhoto: (args) =>
    ipcRenderer.invoke("file:savePhoto", args),
    // args: { folderPath, eventName, fileName, data (base64) }

  openFolder: (folderPath, eventName) =>
    ipcRenderer.invoke("file:openFolder", folderPath, eventName),

  getLastPhotoIndex: (args) =>
  ipcRenderer.invoke("file:getLastPhotoIndex", args),

  // ── Kamera DSLR ──────────────────────────────────────────────────────────
  listDSLR: () =>
    ipcRenderer.invoke("camera:listDSLR"),
    // returns: { cameras: [{ model, port }] }

  capturePhoto: (args) =>
    ipcRenderer.invoke("camera:capturePhoto", args),
    // args: { savePath? }
    // returns: { success, filePath, base64 }

  // ── Printer ──────────────────────────────────────────────────────────────
  listPrinters: () =>
    ipcRenderer.invoke("printer:list"),
    // returns: { printers: [{ name, status, isDefault }] }

  printPhoto: (args) =>
    ipcRenderer.invoke("printer:print", args),
    // args: { printerName, filePath, copies? }
    // returns: { success, error? }

    // ── WhatsApp ──────────────────────────────────────────────────────────────
  waOpenChat: (args) =>
  ipcRenderer.invoke("wa:openChat", args),
  // args: { waNumber, eventName }


  // ── Load CSV ──────────────────────────────────────
  readCSV: (filePath) =>
  ipcRenderer.invoke("file:readCSV", filePath),

  selectFile: (args) =>
  ipcRenderer.invoke("dialog:selectFile", args),

});
