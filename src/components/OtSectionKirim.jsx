// BAGIAN OUTPUT SECTION KIRIM KANAN

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
}) {
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
        {/* Mode toggle */}
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

        {/* ── MODE: Nama / ID ── */}
        {guestMode === "name" && (
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={guestQuery}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  searchGuest(val);
                }}
                placeholder="Ketik nama tamu..."
                style={{
                  paddingLeft: "2.8rem",
                  flex: 1,
                  cursor: "text",
                  border: ".1rem solid var(--secondary)",
                  background: "rgba(65,139,250,.04)",
                  fontFamily: "var(--f)",
                  fontWeight: "var(--fw-medium)",
                  fontSize: "1rem",
                  color: "var(--primary)",
                }}
              />

              <img
                src="/assets/search.svg"
                alt="nama"
                className="ic-blue"
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "1.3rem",
                  height: "1.3rem",
                  pointerEvents: "none",
                }}
              />

              {guestQuery && (
                <button
                  onClick={() => {
                    setGuestQuery("");
                    setGuestResults([]);
                    setSelectedGuest(null);
                    setWaStatus("idle");
                  }}
                  className="del-btn"
                  style={{
                    flexShrink: 0,
                    position: "absolute",
                    right: ".7rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <img
                    src="/assets/x.svg"
                    alt="rmv"
                    className="rmv-img"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {guestResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  background: "var(--white)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  animation: "fadeUp .18s ease",
                }}
              >
                {guestResults.map((g, i) => (
                  <div
                    key={g.id}
                    onClick={() => selectGuest(g)}
                    style={{
                      padding: "1rem 1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: "var(--secondary)",
                          fontFamily: "var(--f)",
                          fontWeight: "var(--fw-medium)",
                          fontSize: ".8rem",
                        }}
                      >
                        {g.name}
                      </div>
                      <div
                        style={{
                          color: "rgba(0,0,0,.4)",
                          fontFamily: "var(--f)",
                          fontWeight: "var(--fw-medium)",
                          fontSize: ".6rem",
                          marginTop: ".2rem",
                        }}
                      >
                        +{g.wa}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {guestQuery && guestResults.length === 0 && !selectedGuest && (
              <div
                style={{
                  marginTop: ".8rem",
                  color: "var(--red)",
                  fontFamily: "var(--f)",
                  fontWeight: "var(--fw-medium)",
                  fontSize: "var(--fs-h3)",
                  textAlign: "center",
                }}
              >
                Nama tidak ditemukan
              </div>
            )}
          </div>
        )}

        {/* ── MODE: Nomor WA langsung ── */}
        {guestMode === "wa" && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="tel"
                value={waNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setWaNumber(val);
                  setWaStatus("idle");
                }}
                placeholder="Ketik nomor WhatsApp tamu..."
                style={{
                  paddingLeft: "2.8rem",
                  flex: 1,
                  cursor: "text",
                  border: ".1rem solid var(--secondary)",
                  background: "rgba(65,139,250,.04)",
                  fontFamily: "var(--f)",
                  fontWeight: "var(--fw-medium)",
                  fontSize: "1rem",
                  color: "var(--primary)",
                }}
              />

              <img
                src="/assets/brand-whatsapp.svg"
                alt="nama"
                className="ic-blue"
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "1.5rem",
                  height: "1.5rem",
                  pointerEvents: "none",
                }}
              />

              {waNumber && (
                <button
                  onClick={() => {
                    setWaNumber("");
                    setWaStatus("idle");
                  }}
                  className="del-btn"
                  style={{
                    flexShrink: 0,
                    position: "absolute",
                    right: ".7rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <img
                    src="/assets/x.svg"
                    alt="rmv"
                    className="rmv-img"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                </button>
              )}
            </div>

            {waNumber.length > 0 && waNumber.length < 9 && (
              <div
                style={{
                  marginTop: ".8rem",
                  marginLeft: ".8rem",
                  color: "var(--red)",
                  fontFamily: "var(--f)",
                  fontWeight: "var(--fw-medium)",
                  fontSize: "var(--fs-h3)",
                }}
              >
                Nomor terlalu pendek
              </div>
            )}
          </div>
        )}

        {/* ── MODE: QR ── */}
        {/* ── area tengah zona ── */}
        {guestMode === "qr" && (
          <div style={{ marginBottom: "1rem" }}>
            {!selectedGuest ? (
              <button
                className="qr-btn"
                onClick={() => setQrModalOpen(true)}
                style={{
                  fontFamily: "var(--f)",
                }}
              >
                <img
                  src="/assets/qrcode.svg"
                  alt="qr"
                  className="qr-img"
                  style={{
                    width: "3rem",
                    height: "3rem",
                  }}
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
            ) : null}
          </div>
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
              style={{
                flexShrink: 0,
                position: "absolute",
                right: ".7rem",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <img
                src="/assets/x.svg"
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

        {/* Send button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="send-btn"
            onClick={sendWa}
            style={{
              pointerEvents: !canSendWa() ? "none" : "auto",
              opacity: !canSendWa() ? 0.4 : 1,
            }}
          >
            <img
              src="/assets/send-2.svg"
              alt="wa"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
              }}
            />
            <span>
              {waStatus === "sending"
                ? "MENGIRIM..."
                : waStatus === "done"
                  ? "TERKIRIM"
                  : "KIRIM"}
            </span>
          </button>
        </div>
      </Section>

      {/* ── QR Modal ── */}
      {qrModalOpen && (
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

            {/* Webcam viewfinder mock */}
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
              {/* Scan frame pojokan */}
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

            {/* tombol pindai */}
            {!qrScanning ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className={"qrwc-btn"}
                  onClick={simulateQrScan}
                  style={{
                    borderRadius: "3rem",
                    padding: "1rem 2rem",
                  }}
                >
                  <img
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
      )}
    </>
  );
}
