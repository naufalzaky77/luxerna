// electron/main.js
const { app, BrowserWindow, ipcMain, dialog, shell, session } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

// ─── Printer ──────────────────────────────────────────────────────────────────
let printer;
try {
  printer = require("node-printer");
} catch (e) {
  console.warn("node-printer not installed:", e.message);
}

// ─── DSLR via gphoto2 ────────────────────────────────────────────────────────
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

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);
  });

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    return true;
  });

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
    const buffer = Buffer.from(data, "base64");
    fs.writeFileSync(filePath, buffer);
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("file:openFolder", async (_, folderPath) => {
  shell.openPath(folderPath);
});

function sanitizeFolderName(name) {
  return name.replace(/[<>:"/\\|?*]/g, "_").trim() || "Untitled";
}

ipcMain.handle("camera:listDSLR", async () => {
  if (!gphoto2) return { cameras: [], error: "gphoto2 not available" };
  return new Promise((resolve) => {
    gphoto2.list((list) => {
      if (!list || list.length === 0) {
        resolve({ cameras: [] });
      } else {
        resolve({ cameras: list.map((cam) => ({ model: cam.model, port: cam.port })) });
      }
    });
  });
});

ipcMain.handle("camera:capturePhoto", async (_, { savePath }) => {
  if (!gphoto2) return { success: false, error: "gphoto2 not available" };
  return new Promise((resolve) => {
    gphoto2.list((list) => {
      if (!list || list.length === 0) {
        resolve({ success: false, error: "No DSLR connected" });
        return;
      }
      const camera = list[0];
      const tmpPath = savePath || path.join(app.getPath("temp"), `snapbooth_${Date.now()}.jpg`);
      camera.takePicture({ download: true, keep: false, targetPath: tmpPath }, (err, file) => {
        if (err) { resolve({ success: false, error: err.message }); return; }
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

ipcMain.handle("printer:list", async () => {
  if (!printer) return { printers: [], error: "node-printer not available" };
  try {
    const list = printer.getPrinters();
    return {
      printers: list.map((p) => ({
        name: p.name,
        status: p.status === "IDLE" || p.status === "READY" ? "ready" : p.status.toLowerCase(),
        isDefault: p.isDefault || false,
      })),
    };
  } catch (err) {
    return { printers: [], error: err.message };
  }
});

ipcMain.handle("printer:print", async (_, { printerName, filePath, copies = 1 }) => {
  if (!printer) return { success: false, error: "node-printer not available" };
  try {
    printer.printFile({
      filename: filePath,
      printer: printerName,
      success: (jobID) => console.log("Print job:", jobID),
      error: (err) => console.error("Print error:", err),
    });
    return { success: true };
  } catch (err) {
    const { exec } = require("child_process");
    exec(`SumatraPDF.exe -print-to "${printerName}" "${filePath}"`, (error) => {
      if (error) console.error("Fallback print error:", error);
    });
    return { success: true, note: "Using fallback print method" };
  }
});