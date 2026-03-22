// BAGIAN CAPTURE VIEW LAYAR UNTUK FOTO

import { useEffect, useRef } from "react";

export default function ViewFinder({ cd, selectedCamera, videoRef }) {
  useEffect(() => {
    if (!selectedCamera) return;
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCamera.deviceId } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("KAMERA EROR", err);
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [selectedCamera]);

  return (
    <div
      style={{
        maxWidth: "90rem",
        width: "100%",
        aspectRatio: "1.543",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Bagian Layar Foto Tampil */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Bagian Countdown Timer */}
      {cd !== null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "15rem",
              height: "15rem",
              borderRadius: "50%",
              background: "rgba(65,139,250,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulseRing 1s ease-out infinite",
            }}
          >
            <div
              style={{
                fontSize: cd === "SIAP" ? "5rem" : "13rem",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                color: "rgba(65,139,250,1)",
                letterSpacing: cd === "SIAP" ? ".3rem" : 0,
              }}
            >
              {cd}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
