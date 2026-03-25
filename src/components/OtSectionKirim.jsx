// BAGIAN OUTPUT SECTION KIRIM KANAN

import { useRef } from "react";
import KirimModeNama from "./KirimModeNama";
import KirimModeWA from "./KirimModeWA";
import KirimModeQR from "./KirimModeQR";
import QRModal from "./QRModal";
import getAsset from "../utils/getAsset";

export default function SectKirim({
  processDone,
  waStatus,
  setWaStatus,
  guestMode,
  switchMode,
  guestQuery,
  setGuestQuery,
  searchGuest,
  guestResults,
  setGuestResults,
  selectGuest,
  selectedGuest,
  setSelectedGuest,
  waNumber,
  setWaNumber,
  sendWa,
  canSendWa,
  qrModalOpen,
  setQrModalOpen,
  simulateQrScan,
  qrScanning,
  selectedCamera,
  guestDB = [],
}) {
  const sendImgRef = useRef(null);
  const delImg3Ref = useRef(null);

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

  const sendHandlers = makeAnimHandlers(
    sendImgRef,
    "slideLeftFar .6s ease forwards",
    "slideRightFar .6s ease forwards",
  );

  const del3Handlers = makeAnimHandlers(
    delImg3Ref,
    "spinLogo .3s ease forwards",
    "spinLogoReverse .3s ease forwards",
  );

  const Section = ({ title, children, style = {} }) => (
    <div className="card" style={{ padding: "20px 22px", ...style }}>
      <div
        style={{
          color: "rgba(0,0,0,.6)",
          fontSize: "10px",
          letterSpacing: "3px",
          marginBottom: "16px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <>
      <Section
        title={
          <span
            style={{
              fontFamily: "var(--f)",
              letterSpacing: ".1rem",
            }}
          >
            <span
              style={{
                fontWeight: "var(--fw-black)",
                fontSize: "var(--fs-h2)",
                color: "var(--secondary)",
              }}
            >
              KIRIM
            </span>
            <span
              style={{
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h3)",
                color: "rgba(0,0,0,.5)",
                marginLeft: ".5rem",
              }}
            >
              (opsional)
            </span>
          </span>
        }
        style={{
          border:
            waStatus === "done"
              ? ".2rem solid var(--green)"
              : waStatus === "sending"
                ? ".2rem solid rgba(255,213,0,.5)"
                : ".2rem solid rgba(65,139,250,.5)",
          backgroundColor: "var(--white)",
        }}
      >
        {/* MODE TOGGLE GESER */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            background: "var(--white)",
            padding: "4px",
          }}
        >
          {[
            { id: "name", label: "NAMA TAMU" },
            { id: "wa", label: "WHATSAPP" },
            { id: "qr", label: "SCAN QR" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              style={{
                flex: 1,
                padding: ".5rem 1rem",
                borderRadius: "7px",
                cursor: "pointer",
                border: "none",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-bold)",
                fontSize: "var(--fs-h3)",
                letterSpacing: ".1rem",
                transition: "all .2s",
                background:
                  guestMode === m.id ? "var(--secondary)" : "transparent",
                color: guestMode === m.id ? "var(--white)" : "rgba(0,0,0,.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {guestMode === "name" && (
          <KirimModeNama
            guestQuery={guestQuery}
            setGuestQuery={setGuestQuery}
            searchGuest={searchGuest}
            guestResults={guestResults}
            setGuestResults={setGuestResults}
            selectGuest={selectGuest}
            selectedGuest={selectedGuest}
            setSelectedGuest={setSelectedGuest}
            setWaStatus={setWaStatus}
          />
        )}

        {guestMode === "wa" && (
          <KirimModeWA
            waNumber={waNumber}
            setWaNumber={setWaNumber}
            setWaStatus={setWaStatus}
          />
        )}

        {guestMode === "qr" && (
          <KirimModeQR
            selectedGuest={selectedGuest}
            setQrModalOpen={setQrModalOpen}
          />
        )}

        {/* cardnya muncul (nama/ID and QR mode) */}
        {selectedGuest && guestMode !== "wa" && (
          <div
            style={{
              position: "relative",
              background: "rgba(65,139,250,.05)",
              borderRadius: "1rem",
              padding: "1rem 1rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              animation: "fadeUp .2s ease",
            }}
          >
            <div style={{ flex: 1, marginLeft: ".5rem" }}>
              <div
                style={{
                  color: "var(--secondary)",
                  fontFamily: "var(--f)",
                  fontSize: "var(--fs-h2)",
                  fontWeight: "var(--fw-bold)",
                  letterSpacing: ".1rem",
                }}
              >
                {selectedGuest.name}
              </div>
              <div
                style={{
                  color: "var(--primary)",
                  fontFamily: "var(--f)",
                  fontSize: ".8rem",
                  fontWeight: "var(--fw-semiBold)",
                  letterSpacing: ".05rem",
                  marginTop: ".4rem",
                }}
              >
                +{selectedGuest.wa}
                <span
                  style={{
                    marginLeft: "1rem",
                    color: "rgba(0,0,0,.2)",
                    fontFamily: "var(--f)",
                    fontSize: ".8rem",
                    fontWeight: "var(--fw-semiBold)",
                  }}
                >
                  ID: {selectedGuest.id}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedGuest(null);
                setGuestQuery("");
                setWaStatus("idle");
              }}
              className="del-btn"
              {...del3Handlers}
              style={{
                flexShrink: 0,
                position: "absolute",
                right: ".7rem",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <img
                ref={delImg3Ref}
                src={getAsset("/assets/x.svg")}
                alt="rmv"
                className="rmv-img"
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
            </button>
          </div>
        )}

        {/* TOMBOL KIRIM */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="send-btn"
            onClick={sendWa}
            {...sendHandlers}
            style={{
              pointerEvents: !canSendWa() ? "none" : "auto",
              opacity: !canSendWa() ? 0.4 : 1,
            }}
          >
            <img
              ref={sendImgRef}
              src={getAsset("/assets/send-2.svg")}
              alt="wa"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
              }}
            />
            <span>
              {waStatus === "sending"
                ? "MEMBUKA..."
                : waStatus === "done"
                  ? "TERBUKA"
                  : waStatus === "error"
                    ? "GAGAL"
                    : "KIRIM"}
            </span>
          </button>
        </div>
      </Section>

      <QRModal
        qrModalOpen={qrModalOpen}
        setQrModalOpen={setQrModalOpen}
        selectedCamera={selectedCamera}
        simulateQrScan={simulateQrScan}
        qrScanning={qrScanning}
      />
    </>
  );
}
