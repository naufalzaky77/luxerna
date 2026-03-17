// electron/main.js
// ─── Main process Electron ────────────────────────────────────────────────────
// Handles: window management, camera (DSLR via gphoto2), printer, file system

const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path   = require("path");
const fs     = require("fs");
const isDev  = process.env.NODE_ENV === "development" || !app.isPackaged;

// ─── Printer ──────────────────────────────────────────────────────────────────
// node-printer memberikan akses ke printer Windows/Mac/Linux lewat native API
let printer;
try {
  printer = require("node-printer");
} catch (e) {
  console.warn("node-printer not installed:", e.message);
}

// ─── DSLR via gphoto2 ────────────────────────────────────────────────────────
// node-gphoto2 adalah wrapper untuk libgphoto2 (Linux/Mac)
// Di Windows: pakai digiCamControl CLI sebagai alternatif
let gphoto2;
try {
  const GPhoto = require("node-gphoto2");
  gphoto2 = new GPhoto.GPhoto2();
} catch (e) {
  console.warn("node-gphoto2 not installed:", e.message);
}

// ─── Window ───────────────────────────────────────────────────────────────────
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    fullscreen: false,        // set true untuk kiosk produksi
    kiosk: false,             // set true untuk lock ke fullscreen
    frame: true,
    backgroundColor: "#07060e",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,  // PENTING: false untuk keamanan
    },
  });

  // Dev: load dari React dev server
  // Production: load dari build folder
  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startUrl);

  if (isDev) mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// =============================================================================
// IPC HANDLERS — dipanggil dari React via window.electronAPI
// =============================================================================

// ─── FILE SYSTEM ─────────────────────────────────────────────────────────────

// Buka dialog pilih folder
ipcMain.handle("dialog:selectFolder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

// Simpan foto ke disk
// data: base64 string | Buffer
// returns: path file yang disimpan
ipcMain.handle("file:savePhoto", async (_, { folderPath, eventName, fileName, data }) => {
  try {
    const eventFolder = path.join(folderPath, sanitizeFolderName(eventName));
    fs.mkdirSync(eventFolder, { recursive: true });
    const filePath = path.join(eventFolder, fileName);
    const buffer = Buffer.from(data, "base64");
    fs.writeFileSync(filePath, buffer);
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Buka folder di Explorer
ipcMain.handle("file:openFolder", async (_, folderPath) => {
  shell.openPath(folderPath);
});

function sanitizeFolderName(name) {
  return name.replace(/[<>:"/\\|?*]/g, "_").trim() || "Untitled";
}

// ─── KAMERA DSLR ─────────────────────────────────────────────────────────────

// Detect kamera DSLR yang terhubung
// Returns: array of { model, port }
ipcMain.handle("camera:listDSLR", async () => {
  if (!gphoto2) return { cameras: [], error: "gphoto2 not available" };

  return new Promise((resolve) => {
    gphoto2.list((list) => {
      if (!list || list.length === 0) {
        resolve({ cameras: [] });
      } else {
        resolve({
          cameras: list.map((cam) => ({
            model: cam.model,
            port:  cam.port,
          })),
        });
      }
    });
  });
});

// Trigger shutter DSLR dan ambil foto
// Returns: { success, filePath, base64 }
ipcMain.handle("camera:capturePhoto", async (_, { savePath }) => {
  if (!gphoto2) return { success: false, error: "gphoto2 not available" };

  return new Promise((resolve) => {
    gphoto2.list((list) => {
      if (!list || list.length === 0) {
        resolve({ success: false, error: "No DSLR connected" });
        return;
      }

      const camera = list[0]; // gunakan kamera pertama
      const tmpPath = savePath || path.join(app.getPath("temp"), `snapbooth_${Date.now()}.jpg`);

      camera.takePicture({ download: true, keep: false, targetPath: tmpPath }, (err, file) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        try {
          const base64 = fs.readFileSync(file || tmpPath).toString("base64");
          resolve({ success: true, filePath: file || tmpPath, base64 });
        } catch (readErr) {
          resolve({ success: false, error: readErr.message });
        }
      });
    });
  });
});

// ─── PRINTER ─────────────────────────────────────────────────────────────────

// List semua printer yang terinstall di sistem
// Returns: [{ name, status, isDefault }]
ipcMain.handle("printer:list", async () => {
  if (!printer) return { printers: [], error: "node-printer not available" };

  try {
    const list = printer.getPrinters();
    return {
      printers: list.map((p) => ({
        name:      p.name,
        status:    p.status === "IDLE" || p.status === "READY" ? "ready" : p.status.toLowerCase(),
        isDefault: p.isDefault || false,
      })),
    };
  } catch (err) {
    return { printers: [], error: err.message };
  }
});

// Print foto (tanpa frame) ke printer yang dipilih
// Untuk thermal: kirim langsung ke printer
// Untuk inkjet: buka file dengan default viewer lalu print
ipcMain.handle("printer:print", async (_, { printerName, filePath, copies = 1 }) => {
  if (!printer) return { success: false, error: "node-printer not available" };

  try {
    // node-printer mendukung print langsung dari file
    printer.printFile({
      filename:    filePath,
      printer:     printerName,
      success:     (jobID) => console.log("Print job:", jobID),
      error:       (err)   => console.error("Print error:", err),
    });

    return { success: true };
  } catch (err) {
    // Fallback: Windows shell print command
    // Cocok untuk thermal printer dengan driver standard
    const { exec } = require("child_process");
    const cmd = `"${filePath}" /pt "${printerName}"`;
    exec(`SumatraPDF.exe -print-to "${printerName}" "${filePath}"`, (error) => {
      if (error) console.error("Fallback print error:", error);
    });
    return { success: true, note: "Using fallback print method" };
  }
});
