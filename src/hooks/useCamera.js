// src/hooks/useCamera.js
// ─── useCamera Hook ───────────────────────────────────────────────────────────
// Mengelola koneksi kamera:
//   - Webcam  → pakai getUserMedia (browser API, jalan di Electron & browser)
//   - DSLR    → pakai IPC ke main process (Electron only)

import { useState, useRef, useCallback } from "react";
import { useElectron } from "./useElectron";

export function useCamera() {
  const { capturePhoto, listDSLR } = useElectron();

  const [mode, setMode]           = useState("webcam"); // "webcam" | "dslr"
  const [stream, setStream]       = useState(null);
  const [dslrCameras, setDslrCameras] = useState([]);
  const [error, setError]         = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef(null);  // ref ke <video> element untuk webcam preview
  const canvasRef = useRef(null); // ref ke <canvas> untuk snapshot

  // ── Mulai webcam preview ───────────────────────────────────────────────────
  const startWebcam = useCallback(async (deviceId = null) => {
    try {
      // Stop stream sebelumnya kalau ada
      if (stream) stream.getTracks().forEach((t) => t.stop());

      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: 1920, height: 1080 }
          : { width: 1920, height: 1080, facingMode: "user" },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [stream]);

  // ── Stop webcam ───────────────────────────────────────────────────────────
  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stream]);

  // ── Ambil foto dari webcam (snapshot canvas) ──────────────────────────────
  const captureWebcam = useCallback(() => {
    if (!videoRef.current) return null;

    const video  = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width  = video.videoWidth  || 1920;
    canvas.height = video.videoHeight || 1080;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.92); // base64 JPEG
  }, []);

  // ── Scan DSLR yang terhubung ──────────────────────────────────────────────
  const scanDSLR = useCallback(async () => {
    const result = await listDSLR();
    setDslrCameras(result.cameras || []);
    return result;
  }, [listDSLR]);

  // ── Trigger shutter DSLR ─────────────────────────────────────────────────
  // Returns base64 string foto hasil
  const captureDSLR = useCallback(async (savePath) => {
    setIsCapturing(true);
    try {
      const result = await capturePhoto({ savePath });
      return result; // { success, filePath, base64 }
    } finally {
      setIsCapturing(false);
    }
  }, [capturePhoto]);

  // ── Universal capture ─────────────────────────────────────────────────────
  // Pilih mode secara otomatis
  const capture = useCallback(async (savePath) => {
    setIsCapturing(true);
    try {
      if (mode === "dslr") {
        return await captureDSLR(savePath);
      } else {
        const dataUrl = captureWebcam();
        if (!dataUrl) return { success: false, error: "Webcam not ready" };
        // Strip prefix "data:image/jpeg;base64,"
        const base64 = dataUrl.split(",")[1];
        return { success: true, base64, dataUrl };
      }
    } finally {
      setIsCapturing(false);
    }
  }, [mode, captureDSLR, captureWebcam]);

  return {
    mode, setMode,
    videoRef, canvasRef,
    stream, error, isCapturing,
    dslrCameras,
    startWebcam, stopWebcam,
    captureWebcam,
    scanDSLR, captureDSLR,
    capture,
  };
}
