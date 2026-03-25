import getAsset from "../utils/getAsset";

export default function KirimModeQR({ selectedGuest, setQrModalOpen }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {!selectedGuest && (
        <button
          className="qr-btn"
          onClick={() => setQrModalOpen(true)}
          style={{ fontFamily: "var(--f)" }}
        >
          <img
            src={getAsset("/assets/qrcode.svg")}
            alt="qr"
            className="qr-img"
            style={{ width: "3rem", height: "3rem" }}
          />
          <div
            className="qr-text"
            style={{
              fontFamily: "var(--f)",
              fontWeight: "var(--fw-semiBold)",
              fontSize: "var(--fs-h2)",
              letterSpacing: ".1rem",
            }}
          >
            Klik untuk buka kamera laptop
          </div>
        </button>
      )}
    </div>
  );
}
