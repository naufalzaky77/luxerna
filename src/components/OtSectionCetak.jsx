// BAGIAN OUTPUT SECTION PRINT KANAN

import { useRef } from "react";

export default function SectCetak({
  printers,
  setPrinters,
  selectedPrinter,
  setSelectedPrinter,
  printerLocked,
  setSelectedPrinterLocked,
  processDone,
  printStatus,
  printCount,
  setPrintCount,
  runPrint,
  printDone,
  printerDropOpen,
  setPrinterDropOpen,
  printerScanning,
  setPrinterScanning,
}) {
  const prtImgRef = useRef(null);

  const handlePrtEnter = () => {
    const img = prtImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "zoomIn .3s ease forwards";
  };

  const handlePrtLeave = () => {
    const img = prtImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "zoomOut .3s ease forwards";
  };

  const scanPrinters = () => {
    setPrinterScanning(true);
    setPrinterDropOpen(true);
    setTimeout(() => {
      const mock = [
        { id: "p1", name: "Canon SELPHY CP1500", status: "ready" },
        { id: "p2", name: "Epson L805", status: "ready" },
        { id: "p3", name: "DNP DS620A", status: "offline" },
      ];
      setPrinters(mock);
      setPrinterScanning(false);
    }, 600);
  };

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
            CETAK FOTO
          </span>

          <span
            style={{
              fontWeight: "var(--fw-semiBold)",
              fontSize: "var(--fs-h3)",
              color: "rgba(0,0,0,.5)",
              marginLeft: ".5rem",
            }}
          >
            (tanpa frame)
          </span>
        </span>
      }
      style={{
        border:
          printStatus === "printing"
            ? ".2rem solid rgba(255,213,0,.5)"
            : printDone
              ? ".2rem solid var(--green)"
              : ".2rem solid rgba(65,139,250,.5)",
        backgroundColor: "var(--white)",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            color: "var(--secondary)",
            fontFamily: "var(--f)",
            fontWeight: "var(--fw-medium)",
            fontSize: "var(--fs-h3)",
            marginBottom: ".5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>Perangkat pencetak</span>
        </div>

        {/* BAGIAN BAR PRINTER */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              if (printerLocked) return;
              if (printerDropOpen) {
                setPrinterDropOpen(false);
              } else {
                setPrinterDropOpen(true);
                scanPrinters();
              }
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: ".7rem 1rem",
              borderRadius: ".5rem",
              background: printerLocked
                ? "rgba(0,0,0,.04)"
                : !selectedPrinter
                  ? "rgba(65,139,250,.04)"
                  : "rgba(65,139,250,.04)",
              border: printerLocked
                ? ".1rem solid rgba(0,0,0,.2)"
                : !selectedPrinter
                  ? ".1rem solid var(--secondary)"
                  : ".1rem solid var(--secondary)",
              color: selectedPrinter ? "var(--primary)" : "rgba(0,0,0,.4)",
              fontFamily: "var(--f)",
              fontWeight: "var(--fw-medium)",
              fontSize: "1rem",
              cursor: !printerLocked ? "pointer" : "default",
              transition: "all .2s",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src="/assets/printer.svg"
                alt="prt"
                className={
                  printerLocked
                    ? "ic-grey"
                    : selectedPrinter
                      ? "ic-blue"
                      : "ic-blue"
                }
                style={{ width: "1.3rem", height: "1.3rem" }}
              />

              <span
                style={{
                  color: printerLocked
                    ? "rgba(0,0,0,.4)"
                    : selectedPrinter
                      ? "var(--primary)"
                      : "rgba(0,0,0,.4)",
                }}
              >
                {selectedPrinter ? selectedPrinter.name : "PILIH PENCETAK!"}
              </span>
            </div>
            <img
              src="/assets/caret-down.svg"
              alt="cdw"
              className="ic-blue"
              style={{
                width: "1rem",
                height: "1rem",
                transform: printerDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform .2s",
              }}
            />
          </button>
          {printerDropOpen && (
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
              {printerScanning ? (
                <div
                  style={{
                    padding: "1rem 1rem",
                    color: "var(--secondary)",
                    fontFamily: "var(--f)",
                    fontWeight: "var(--fw-regular)",
                    fontSize: "var(--fs-h2)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/assets/rotate-clockwise-2.svg"
                    alt="rcw"
                    className="ic-blue"
                    style={{
                      marginRight: ".7rem",
                      width: "1.3rem",
                      height: "1.3rem",
                      animation: "infSpin 0.8s linear infinite",
                    }}
                  />
                  Mencari...
                </div>
              ) : (
                printers.map((p, i) => {
                  const isActive = selectedPrinter?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPrinter(p);
                        setPrinterDropOpen(false);
                      }}
                      style={{
                        padding: ".7rem 1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: ".7rem",
                        background: isActive
                          ? "rgba(65,139,250,.1)"
                          : "transparent",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "rgba(0,0,0,.04)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: ".7rem",
                        }}
                      >
                        {isActive && (
                          <img
                            src="/assets/circle-check.svg"
                            alt="ccc"
                            className="ic-blue"
                            style={{ width: "1.3rem", height: "1.3rem" }}
                          />
                        )}
                        <div
                          style={{
                            color: isActive
                              ? "var(--secondary)"
                              : "var(--primary)",
                            fontFamily: "var(--f)",
                            fontWeight: "var(--fw-semiBold)",
                            fontSize: "1rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.name}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  scanPrinters();
                }}
                className="cam-scan"
                style={{
                  padding: "1rem 3rem",
                  cursor: "pointer",
                  fontFamily: "var(--f)",
                  fontWeight: "var(--fw-medium)",
                  fontSize: "var(--fs-h3)",
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                }}
              >
                <img
                  src="/assets/rotate-clockwise-2.svg"
                  alt="rcw"
                  style={{ width: "1rem", height: "1rem" }}
                />
                PINDAI ULANG
              </div>
            </div>
          )}
          {printerDropOpen && (
            <div
              onMouseDown={() => setPrinterDropOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 49 }}
            />
          )}
        </div>
      </div>

      {/* TOMBOL KUNCI PRINTER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginTop: "1rem",
        }}
      >
        {selectedPrinter && printStatus === "idle" && (
          <button
            onClick={() => setSelectedPrinterLocked(!printerLocked)}
            className="admin-btn"
            style={{
              background: printerLocked ? "var(--secondary)" : "transparent",
              border: "2px solid var(--secondary)",
              borderRadius: ".5rem",
              padding: ".5rem 1rem",
              cursor: "pointer",
              color: printerLocked ? "var(--white)" : "var(--secondary)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h3)",
              fontWeight: "var(--fw-semiBold)",
              letterSpacing: ".1rem",
              display: "flex",
              alignItems: "center",
              gap: ".7rem",
              transition: "all .2s",
            }}
          >
            <img
              src={
                printerLocked ? "/assets/lock-open-2.svg" : "/assets/lock.svg"
              }
              alt="lock"
              className={printerLocked ? "ic-white" : "ic-blue"}
              style={{ width: "16px", height: "16px" }}
            />
            {printerLocked ? "BUKA" : "TERAPKAN"}
          </button>
        )}

        {/* TOMBOL PRINT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "auto",
          }}
        >
          <input
            type="number"
            min={1}
            max={10}
            value={printCount}
            onChange={(e) =>
              setPrintCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            style={{
              width: "auto",
              textAlign: "center",
              border: ".1rem solid var(--secondary)",
              borderRadius: ".5rem",
              padding: ".75rem",
              fontFamily: "var(--f)",
              fontWeight: "var(--fw-semiBold)",
              fontSize: "var(--fs-h2)",
              color: "var(--primary)",
              background: "rgba(65,139,250,.04)",
            }}
          />
          <button
            className="prt-btn"
            onClick={runPrint}
            onMouseEnter={handlePrtEnter}
            onMouseLeave={handlePrtLeave}
            style={{
              pointerEvents:
                !processDone || !selectedPrinter || printStatus !== "idle"
                  ? "none"
                  : "auto",
              opacity:
                !processDone || !selectedPrinter || printStatus !== "idle"
                  ? 0.4
                  : 1,
            }}
          >
            <img
              ref={prtImgRef}
              src="/assets/file-arrow-right.svg"
              alt="flpr"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
              }}
            />
            <span>{printStatus === "printing" ? "MENCETAK..." : "CETAK"}</span>
          </button>
        </div>
      </div>
    </Section>
  );
}
