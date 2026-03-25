// electron/main.js

const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs   = require("fs");
const http = require("http");
const os   = require("os");
const googleDrive = require("./googleDriveManager");

const platform = os.platform(); // "win32" | "darwin"

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
    console.log("[DCC] DSLR support tidak tersedia (digiCamControl tidak terinstall)");
    console.log("[DCC] Kamera OBS Virtual dan USB tetap berfungsi normal");
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
    title: "Luxerna Photobooth",
    icon: path.join(__dirname, "../build/assets/icon.ico"),
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
  if (platform === "win32") await launchDCC();
  createWindow();
});

app.on("before-quit", () => {
  if (platform === "win32") killDCC();
});

app.on("window-all-closed", () => {
  if (platform === "win32") killDCC();
  if (platform !== "darwin") app.quit();
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

ipcMain.handle("file:openFolder", async (_, folderPath, eventName) => {
  const fullPath = eventName
    ? path.join(folderPath, sanitizeFolderName(eventName))
    : folderPath;
  shell.openPath(fullPath);
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

// ─── Kamera universal (Windows: DCC | macOS: gphoto2) ─────────────────────────

let liveViewCancelled = false; // ✅ di atas semua handler kamera

ipcMain.handle("camera:listDSLR", async () => {
  if (platform === "win32") {
    try {
      const res  = await fetch("http://localhost:5513/api/list");
      const data = await res.json();
      const list = data?.Data ?? data?.data ?? [];
      return {
        cameras: list.map((cam, i) => {
          return {
            deviceId: `dslr_${i}`,
            label: cam.DisplayName || cam.DeviceName || cam.Name || `DSLR ${i + 1}`,
            model: cam.DeviceName || cam.Name || "",
            type: "dslr",
          };
        })
      };
    } catch (err) {
      return { cameras: [] };
    }
  }

  if (platform === "darwin") {
    return new Promise((resolve) => {
      const proc = spawn("gphoto2", ["--auto-detect"]);
      let output = "";
      proc.stdout.on("data", (d) => output += d.toString());
      proc.on("close", () => {
        const lines = output.split("\n").slice(2).filter(Boolean);
        const cameras = lines.map((line, i) => {
          const parts = line.trim().split(/\s{2,}/);
          return {
            deviceId: `dslr_${i}`,
            label: parts[0] || `DSLR ${i + 1}`,
            model: parts[0] || "",
            port: parts[1] || "",
            type: "dslr",
          };
        });
        resolve({ cameras });
      });
      proc.on("error", () => resolve({ cameras: [] }));
    });
  }

  return { cameras: [] };
});

ipcMain.handle("camera:liveViewStart", async () => {
  if (platform === "win32") {
    try {
      await fetch("http://localhost:5513/?cmd=LiveViewWnd_Show");
      return { success: true, mode: "http-poll" };
    } catch {
      return { success: false };
    }
  }

  if (platform === "darwin") {
    liveViewCancelled = false;
    const tmpPath = path.join(app.getPath("temp"), "liveview_mac.jpg");

    const pollFrame = () => {
      if (liveViewCancelled) return;
      const proc = spawn("gphoto2", [
        "--capture-preview",
        "--filename", tmpPath,
        "--force-overwrite"
      ]);
      proc.on("close", (code) => {
        if (liveViewCancelled) return;
        if (code === 0 && fs.existsSync(tmpPath)) {
          try {
            const base64 = fs.readFileSync(tmpPath).toString("base64");
            if (mainWindow) {
              mainWindow.webContents.send(
                "tether:frame",
                `data:image/jpeg;base64,${base64}`
              );
            }
          } catch {}
        }
        setTimeout(pollFrame, 150);
      });
      proc.on("error", () => {
        if (!liveViewCancelled) setTimeout(pollFrame, 500);
      });
    };

    pollFrame();
    return { success: true, mode: "ipc-stream" };
  }

  return { success: false };
});

ipcMain.handle("camera:liveViewStop", async () => {
  liveViewCancelled = true;
  return { success: true };
});

ipcMain.handle("camera:capture", async () => {
  if (platform === "win32") {
    try {
      await fetch("http://localhost:5513/api/capture");
      await new Promise(r => setTimeout(r, 1500));
      const lastRes  = await fetch("http://localhost:5513/api/lastcaptured");
      const lastData = await lastRes.json();
      const filePath = lastData?.Data || lastData?.data;
      if (!filePath) return { success: false, error: "Path file tidak ditemukan" };
      const fileRes = await fetch(
        `http://localhost:5513/image?file=${encodeURIComponent(filePath)}`
      );
      const buffer = Buffer.from(await fileRes.arrayBuffer());
      return {
        success: true,
        base64: `data:image/jpeg;base64,${buffer.toString("base64")}`
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (platform === "darwin") {
    return new Promise((resolve) => {
      const tmpPath = path.join(app.getPath("temp"), `capture_${Date.now()}.jpg`);
      const proc = spawn("gphoto2", [
        "--capture-image-and-download",
        "--filename", tmpPath,
        "--force-overwrite"
      ]);
      proc.on("close", (code) => {
        if (code !== 0 || !fs.existsSync(tmpPath)) {
          resolve({ success: false, error: "gphoto2 capture gagal" });
          return;
        }
        const base64 = `data:image/jpeg;base64,${fs.readFileSync(tmpPath).toString("base64")}`;
        fs.unlinkSync(tmpPath);
        resolve({ success: true, base64 });
      });
      proc.on("error", () => resolve({
        success: false,
        error: "gphoto2 tidak terinstall. Install via: brew install gphoto2"
      }));
    });
  }

  return { success: false, error: "Platform tidak didukung" };
});

// ─── Printer ──────────────────────────────────────────────────────────────────
ipcMain.handle("printer:list", async () => {
  if (!printer) return { printers: [], error: "node-printer not available" };
  
  try {
    const { exec } = require("child_process");
    
    return new Promise((resolve) => {
      // Use PowerShell to list ALL printers via WMI (including offline ones)
      const cmd = `powershell -NoProfile -Command "Get-WmiObject Win32_Printer -Filter \\"NOT PortName LIKE 'FILE%'\\" | Select-Object Name, PrinterStatus, @{Name='Status';Expression={switch($_.PrinterStatus){0{'ready'}1{'paused'}2{'error'}3{'deleting'}4{'paper-jam'}5{'paper-out'}6{'manual-feed'}7{'power-save'}default{'offline'}}}} | ConvertTo-Json"`;
      
      exec(cmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
          console.error("[Printer Error] Failed to list printers:", error.message);
          return resolve({ printers: [], error: error.message });
        }
        
        try {
          let printers = [];
          const data = JSON.parse(stdout);
          
          // Handle both single printer (object) and multiple printers (array)
          const printerList = Array.isArray(data) ? data : (data ? [data] : []);
          
          console.log("[Printer Debug] Raw WMI data:", printerList);
          
          printers = printerList.map((p) => ({
            name: p.Name,
            status: p.Status === 'ready' ? 'ready' : 'offline',
            isDefault: false,
            rawStatus: p.Status,
          }));
          
          console.log("[Printer Debug] Found printers:", printers);
          resolve({ printers });
        } catch (parseErr) {
          console.error("[Printer Error] Failed to parse printer list:", parseErr.message);
          resolve({ printers: [], error: parseErr.message });
        }
      });
    });
  } catch (err) {
    console.error("[Printer Error]", err);
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

// ─── Google Drive ─────────────────────────────────────────────────────────────
ipcMain.handle("google:setupCredentials", async (_, credentialsData) => {
  return await googleDrive.setupCredentials(credentialsData);
});

ipcMain.handle("google:authenticate", async () => {
  return await googleDrive.authenticate();
});

ipcMain.handle("google:isAuthenticated", async () => {
  return { authenticated: googleDrive.isAuthenticated() };
});

ipcMain.handle("google:findFolder", async (_, folderIdOrName) => {
  return await googleDrive.findFolder(folderIdOrName);
});

ipcMain.handle("google:uploadFile", async (_, { filePath, fileName, folderId }) => {
  return await googleDrive.uploadFile(filePath, fileName, folderId);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sanitizeFolderName(name) {
  return name.replace(/[<>:"/\\|?*]/g, "_").trim() || "Untitled";
}