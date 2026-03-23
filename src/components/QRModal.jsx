import { useEffect, useRef } from "react";

export default function QRModal({
  qrModalOpen,
  setQrModalOpen,
  selectedCamera,
  simulateQrScan,
  qrScanning,
}) {
  const qrwcImgRef = useRef(null);
  const qrVideoRef = useRef(null);

  const makeAnimHandlers = (ref, enterAnim, leaveAnim) => ({
    onMouseEnter: () => {
      const img = ref.current;
      if (!img) return;
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = enterAnim;
    },
    onMouseLeave: () => {
      const img = ref.current;
      if (!img) return;
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = leaveAnim;
    },
  });

  const qrwcHandlers = makeAnimHandlers(
    qrwcImgRef,
    "zoomIn .3s ease forwards",
    "zoomOut .3s ease forwards",
  );

  useEffect(() => {
    if (!qrModalOpen || !selectedCamera) return;
    let stream;
    const startCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCamera.deviceId } },
        });
        if (qrVideoRef.current) qrVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error("QR cam error:", err);
      }
    };
    startCam();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [qrModalOpen, selectedCamera]);

  if (!qrModalOpen) return null;

  return (
    <div
      onClick={() => {
        setQrModalOpen(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, .85)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg)",
          border: ".3rem solid var(--secondary)",
          borderRadius: "3rem",
          padding: "4rem",
          width: "35rem",
          textAlign: "center",
        }}
      >
        {/* JUDUL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              color: "var(--secondary)",
              fontFamily: "var(--f)",
              fontWeight: "var(--fw-semiBold)",
              fontSize: "var(--fs-h2)",
            }}
          >
            Arahkan QR ke kamera laptop!
          </div>
        </div>

        {/* WEBCAM VIEWFINDER */}
        <div
          style={{
            width: "100%",
            aspectRatio: "4/3",
            borderRadius: "1rem",
            overflow: "hidden",
            background: "var(--primary)",
            position: "relative",
            marginBottom: "1rem",
          }}
        >
          <video
            ref={qrVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* CORNER FRAME */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "15rem",
                height: "15rem",
                position: "relative",
              }}
            >
              {[
                ["top", "left"],
                ["top", "right"],
                ["bottom", "left"],
                ["bottom", "right"],
              ].map(([y, x], i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    [y]: "0",
                    [x]: "0",
                    width: "28px",
                    height: "28px",
                    [`border${y[0].toUpperCase() + y.slice(1)}`]:
                      "2.5px solid var(--secondary)",
                    [`border${x[0].toUpperCase() + x.slice(1)}`]:
                      "2.5px solid var(--secondary)",
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TOMBOL SCAN */}
        {!qrScanning ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className={"qrwc-btn"}
              onClick={simulateQrScan}
              {...qrwcHandlers}
              style={{
                borderRadius: "3rem",
                padding: "1rem 2rem",
              }}
            >
              <img
                ref={qrwcImgRef}
                src="/assets/scan.svg"
                alt="scqr"
                style={{
                  width: "28px",
                  height: "28px",
                  objectFit: "contain",
                }}
              />
              <span>PINDAI</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              color: "var(--secondary)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h2)",
              fontWeight: "var(--fw-bold)",
              letterSpacing: ".1rem",
            }}
          >
            MEMINDAI QR...
          </div>
        )}
      </div>
    </div>
  );
}
