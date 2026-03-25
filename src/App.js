import { LAYOUTS } from "./data/layoutData";
import { buildCssVars } from "./luxernaTheme";
import { G } from "./styles/global.css";
import { useState, useEffect, useRef } from "react";

import Home from "./screens/Home";
import Capture from "./screens/Capture";
import Output from "./screens/Output";





// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [photos, setPhotos] = useState([]);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [guestDB, setGuestDB] = useState([]);

  // Persistent path settings (locked once set)
  const [localPath, setLocalPath]     = useState("");
  const [cloudFolder, setCloudFolder] = useState("");
  const [pathLocked, setPathLocked]   = useState(false);

  // Persistent printer settings (locked once set)
  const [printers, setPrinters]           = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printerLocked, setPrinterLocked] = useState(false);
  const photoIndex = useRef(1);

  // Global session settings — persist across screens
  const [settings, setSettings] = useState({
    layout: LAYOUTS[0],
    templateFile: null,
    templatePreview: null,
    selectedCamera: null,
    cameras: [],
    eventName: "",
    cameraLocked: false,
    guestCSV: null,
  });

  // Load CSV saat start atau saat path CSV berubah
  useEffect(() => {
    if (!settings.guestCSV) return;
    loadCSV(settings.guestCSV);
  }, [settings.guestCSV]);

  const loadCSV = async (filePath) => {
    try {
      const result = await window.electronAPI.readCSV(filePath);
      if (result.success) {
        setGuestDB(result.data);
        console.log("Guest DB loaded:", result.data.length, "tamu");
      }
    } catch (err) {
      console.error("Load CSV error:", err);
    }
  };


  const handleToggleAdmin = () => {
    setAdminUnlocked(!adminUnlocked);
    };

  

  return (
    <div style={{ width:"100%", height:"100vh", overflow:"hidden auto", background:"var(--bg)", position:"relative" }}>
      <style>{buildCssVars()}{G}</style>

      
      {screen==="home" && (
        <Home
          settings={settings}
          onSettingsChange={setSettings}
          adminUnlocked={adminUnlocked}
          onToggleAdmin={handleToggleAdmin}
          onStart={() => setScreen("capture")}
        />
      )}
      {screen==="capture" && (
        <Capture
          settings={settings}
          onDone={p=>{ setPhotos(p); setScreen("output"); }}
          onBack={()=>setScreen("home")}
        />
      )}
      {screen==="output" && (
        <Output
          photos={photos}
          settings={settings}
          localPath={localPath} setLocalPath={setLocalPath}
          cloudFolder={cloudFolder} setCloudFolder={setCloudFolder}
          pathLocked={pathLocked} setPathLocked={setPathLocked}
          printers={printers} setPrinters={setPrinters}
          selectedPrinter={selectedPrinter} setSelectedPrinter={setSelectedPrinter}
          printerLocked={printerLocked} setSelectedPrinterLocked={setPrinterLocked}
          guestDB={guestDB}
          photoIndex={photoIndex}
          onBack={()=>setScreen("capture")}
        />
      )}
    </div>
  );
}