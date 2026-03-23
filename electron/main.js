// electron/main.js

const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs   = require("fs");
const http = require("http");

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

// ─── digiCamControl ───────────────────────────────────────────────────────────
const DCC_EXE = app.isPackaged
  ? path.join(process.resourcesPath, "digiCamControl", "CameraControl.exe")
  : "C:\\Program Files (x86)\\digiCamControl\\CameraControl.exe";

const DCC_PORT = 5513;
let dccProcess = null;

function isDCCRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${DCC_PORT}/api/list`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => { req.destroy(); resolve(false); });
  });
}

async function launchDCC() {
  const alreadyRunning = await isDCCRunning();
  if (alreadyRunning) {
    console.log("[DCC] sudah berjalan, skip launch");
    return;
  }
  if (!fs.existsSync(DCC_EXE)) {
    console.warn("[DCC] executable tidak ditemukan di:", DCC_EXE);
    return;
  }
  console.log("[DCC] meluncurkan...");
  dccProcess = spawn(DCC_EXE, [], {
    detached: false,
    stdio: "ignore",
  });
  dccProcess.on("error", (err) => {
    console.error("[DCC] gagal launch:", err.message);
    dccProcess = null;
  });
  dccProcess.on("exit", (code) => {
    console.log("[DCC] keluar dengan kode:", code);
    dccProcess = null;
  });
  await waitForDCC(8000);
}

function waitForDCC(timeoutMs = 8000) {
  return new Promise((resolve) => {
    const start    = Date.now();
    const interval = setInterval(async () => {
      const running = await isDCCRunning();
      if (running) {
        clearInterval(interval);
        console.log("[DCC] siap");
        resolve(true);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        console.warn("[DCC] timeout");
        resolve(false);
      }
    }, 500);
  });
}

function killDCC() {
  if (!dccProcess) return;
  try {
    dccProcess.kill();
    console.log("[DCC] proses dihentikan");
  } catch (err) {
    console.warn("[DCC] gagal kill:", err.message);
  }
  dccProcess = null;
}

// ─── Printer ──────────────────────────────────────────────────────────────────
let printer;
try {
  printer = require("node-printer");
} catch (e) {
  console.warn("node-printer not installed:", e.message);
}

// ─── Window ───────────────────────────────────────────────────────────────────
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    fullscreen: false,
    kiosk: false,
    frame: true,
    backgroundColor: "#07060e",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.session.setPermissionRequestHandler((_, permission, callback) => {
    callback(true);
  });

  mainWindow.webContents.session.setPermissionCheckHandler(() => {
    return true;
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: blob:; " +
          "media-src 'self' blob: mediastream:; " +
          "connect-src 'self' http://localhost:5513",
        ],
      },
    });
  });

  if (isDev) mainWindow.webContents.openDevTools();
}

// ─── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  await launchDCC();
  createWindow();
});

app.on("before-quit", () => killDCC());

app.on("window-all-closed", () => {
  killDCC();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// =============================================================================
// IPC HANDLERS
// =============================================================================

ipcMain.handle("dialog:selectFolder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("file:savePhoto", async (_, { folderPath, eventName, fileName, data }) => {
  try {
    const eventFolder = path.join(folderPath, sanitizeFolderName(eventName));
    fs.mkdirSync(eventFolder, { recursive: true });
    const filePath = path.join(eventFolder, fileName);
    fs.writeFileSync(filePath, Buffer.from(data, "base64"));
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("file:openFolder", async (_, folderPath) => {
  shell.openPath(folderPath);
});

ipcMain.handle("file:getLastPhotoIndex", async (_, { folderPath, eventName }) => {
  try {
    const eventFolder = path.join(folderPath, sanitizeFolderName(eventName));
    if (!fs.existsSync(eventFolder)) return { lastIndex: 0 };
    const files = fs.readdirSync(eventFolder).filter(f => f.match(/^IMG_(\d+)\.png$/));
    if (files.length === 0) return { lastIndex: 0 };
    const indices = files.map(f => parseInt(f.match(/^IMG_(\d+)\.png$/)[1]));
    return { lastIndex: Math.max(...indices) };
  } catch {
    return { lastIndex: 0 };
  }
});

ipcMain.handle("file:readCSV", async (_, filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines   = content.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const data = lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      return {
        id:   values[headers.indexOf("id")]    || "",
        name: values[headers.indexOf("name")]  || values[headers.indexOf("nama")] || "",
        wa:   values[headers.indexOf("wa")]    || values[headers.indexOf("whatsapp")] || "",
      };
    }).filter(g => g.id || g.name);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("dialog:selectFile", async (_, { filters }) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: filters || [],
  });
  return result.canceled ? null : result.filePaths[0];
});

// ─── Printer ──────────────────────────────────────────────────────────────────
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

ipcMain.handle("printer:print", async (_, { printerName, filePath }) => {
  if (!printer) return { success: false, error: "node-printer not available" };
  try {
    printer.printFile({
      filename: filePath,
      printer:  printerName,
      success:  (jobID) => console.log("Print job:", jobID),
      error:    (err)   => console.error("Print error:", err),
    });
    return { success: true };
  } catch (err) {
    // Fallback ke SumatraPDF
    const { exec } = require("child_process");
    exec(`SumatraPDF.exe -print-to "${printerName}" "${filePath}"`, (error) => {
      if (error) console.error("Fallback print error:", error);
    });
    return { success: true, note: "Using fallback print method" };
  }
});

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
ipcMain.handle("wa:openChat", async (_, { waNumber, eventName }) => {
  try {
    const text = encodeURIComponent(`${eventName}\nTerima kasih sudah hadir! Ini foto sebagai kenang-kenangan.`);
    shell.openExternal(`https://wa.me/${waNumber}?text=${text}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sanitizeFolderName(name) {
  return name.replace(/[<>:"/\\|?*]/g, "_").trim() || "Untitled";
}