// BAGIAN CAPTURE VIEW LAYAR UNTUK FOTO

export default function ViewFinder({ templatePreview, cd }) {
  return (
    <div
      style={{
        maxWidth: "90rem",
        width: "100%",
        aspectRatio: "16/9",
        position: "relative",
        overflow: "hidden",
        background: "var(--primary)",
      }}
    >
      {/* Bagian Layar Foto Tampil */}
      {templatePreview && (
        <img
          src={templatePreview}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
          }}
          alt=""
        />
      )}

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
