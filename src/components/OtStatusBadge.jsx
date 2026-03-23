// BAGIAN OUTPUT STATUS BADGE DI KIRI

export default function StatusBadge({
  processDone,
  printDone,
  printStatus,
  waStatus,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
      }}
    >
      {/* STATUS BADGE PROSES */}
      {processDone && (
        <div className="done-yes">
          <img
            src="/assets/circle-check.svg"
            alt="done"
            className="ic-green"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />
          <div>
            <div
              style={{
                color: "var(--green)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h3)",
              }}
            >
              PROSES SELESAI
            </div>
            <div
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h3)",
                marginTop: ".2rem",
              }}
            >
              file tersimpan & terunggah
            </div>
          </div>
        </div>
      )}

      {/* STATUS BADGE PRINT - Sudah Tercetak */}
      {Array.from({ length: printDone }).map((_, i) => (
        <div key={i} className="done-yes">
          <img
            src="/assets/circle-check.svg"
            alt="done"
            className="ic-green"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />
          <div>
            <div
              style={{
                color: "var(--green)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h3)",
              }}
            >
              FOTO TERCETAK
            </div>
            <div
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h3)",
                marginTop: ".2rem",
              }}
            >
              foto berhasil dicetak
            </div>
          </div>
        </div>
      ))}

      {/* STATUS BADGE PRINT - Sedang Cetak */}
      {printStatus === "printing" && (
        <div className="done-wait">
          <img
            src="/assets/clock.svg"
            alt="done"
            className="ic-yellow"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />
          <div>
            <div
              style={{
                color: "var(--yellow)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h3)",
              }}
            >
              SEDANG CETAK
            </div>
            <div
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h3)",
                marginTop: ".2rem",
              }}
            >
              foto sedang dicetak
            </div>
          </div>
        </div>
      )}

      {/* STATUS BADGE KIRIM */}
      {waStatus === "done" && (
        <div className="done-yes">
          <img
            src="/assets/circle-check.svg"
            alt="done"
            className="ic-green"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
            }}
          />
          <div>
            <div
              style={{
                color: "var(--green)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h3)",
              }}
            >
              FOTO TERKIRIM
            </div>
            <div
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h3)",
                marginTop: ".2rem",
              }}
            >
              file foto terkirim ke tamu
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
