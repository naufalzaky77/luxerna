// src/hooks/usePrinter.js
// ─── usePrinter Hook ──────────────────────────────────────────────────────────
// Mengelola printer: list, pilih, dan print foto
// Print yang dikirim adalah foto TANPA frame/template

import { useState, useCallback, useEffect } from "react";
import { useElectron } from "./useElectron";

export function usePrinter({ autoDetect = true } = {}) {
  const { listPrinters, printPhoto } = useElectron();

  const [printers, setPrinters]         = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printStatus, setPrintStatus]   = useState("idle"); // idle | printing | done | error
  const [printError, setPrintError]     = useState(null);
  const [isLoading, setIsLoading]       = useState(false);

  // ── Auto-detect saat pertama mount ────────────────────────────────────────
  useEffect(() => {
    if (autoDetect) scan();
  }, []);

  // ── Scan printer ──────────────────────────────────────────────────────────
  const scan = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listPrinters();
      const list   = result.printers || [];
      setPrinters(list);

      // Auto-pilih printer default, atau yang pertama ready
      if (!selectedPrinter && list.length > 0) {
        const def   = list.find((p) => p.isDefault && p.status === "ready");
        const ready = list.find((p) => p.status === "ready");
        setSelectedPrinter(def || ready || list[0]);
      }

      return list;
    } catch (err) {
      setPrinters([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [listPrinters, selectedPrinter]);

  // ── Print foto ────────────────────────────────────────────────────────────
  // filePath: path ke file FOTO SAJA (tanpa frame) yang sudah disimpan di disk
  // copies: jumlah cetak
  const print = useCallback(async ({ filePath, copies = 1 } = {}) => {
    if (!selectedPrinter) {
      setPrintError("Pilih printer terlebih dahulu");
      return { success: false, error: "No printer selected" };
    }
    if (!filePath) {
      setPrintError("File foto belum tersedia");
      return { success: false, error: "No file path" };
    }

    setPrintStatus("printing");
    setPrintError(null);

    try {
      const result = await printPhoto({
        printerName: selectedPrinter.name,
        filePath,
        copies,
        layout,
      });

      if (result.success) {
        setPrintStatus("done");
        return { success: true };
      } else {
        setPrintStatus("error");
        setPrintError(result.error || "Print gagal");
        return { success: false, error: result.error };
      }
    } catch (err) {
      setPrintStatus("error");
      setPrintError(err.message);
      return { success: false, error: err.message };
    }
  }, [selectedPrinter, printPhoto]);

  const reset = () => {
    setPrintStatus("idle");
    setPrintError(null);
  };

  return {
    printers,
    selectedPrinter, setSelectedPrinter,
    printStatus, printError,
    isLoading,
    scan,
    print,
    reset,
  };
}
