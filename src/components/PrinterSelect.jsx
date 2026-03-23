export default function PrinterSelect({
  printers,
  setPrinters,
  selectedPrinter,
  setSelectedPrinter,
  printerDropOpen,
  setPrinterDropOpen,
  printerScanning,
  setPrinterScanning,
  printerLocked,
}) {
  const scanPrinters = async () => {
    setPrinterScanning(true);
    setPrinterDropOpen(true);
    try {
      const result = await window.electronAPI.listPrinters();
      setPrinters(result.printers || []);
    } catch (err) {
      console.error("Scan printer error:", err);
      setPrinters([]);
    }
    setPrinterScanning(false);
  };

  return (
    //* ------- BAGIAN BAR PRINTER ------- *//
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          if (printerLocked) return;
          if (printerDropOpen) {
            setPrinterDropOpen(false);
          } else {
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
            : "rgba(65,139,250,.04)",
          border: printerLocked
            ? ".1rem solid rgba(0,0,0,.2)"
            : printerLocked
              ? ".1rem solid rgba(0,0,0,.2)"
              : `.1rem solid ${printerDropOpen ? "var(--secondary)" : "var(--white)"}`,
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
              fontFamily: "var(--f)",
              fontSize: "1rem",
            }}
          >
            {printerScanning
              ? "Mencari pencetak..."
              : selectedPrinter
                ? selectedPrinter.name
                : "Pilih perangkat pencetak..."}
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

      {/* ------- DROPDOWN -------  */}
      {printerDropOpen && !printerLocked && (
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
                padding: "1rem",
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
          ) : printers.length === 0 ? (
            <div
              style={{
                padding: "1rem",
                color: "var(--primary)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h2)",
              }}
            >
              Tidak ada printer terdeteksi
            </div>
          ) : (
            printers.map((p) => {
              const isActive = selectedPrinter?.name === p.name;
              return (
                <div
                  key={p.name}
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
                        color: isActive ? "var(--secondary)" : "var(--primary)",
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

          {!printerScanning && (
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
          )}
        </div>
      )}
      {printerDropOpen && !printerLocked && (
        <div
          onMouseDown={() => setPrinterDropOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
        />
      )}
    </div>
  );
}
