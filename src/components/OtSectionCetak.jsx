// BAGIAN OUTPUT SECTION PRINT KANAN

import PrinterSelect from "./PrinterSelect";
import PrinterControl from "./PrinterControl";

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

        <PrinterSelect
          printers={printers}
          setPrinters={setPrinters}
          selectedPrinter={selectedPrinter}
          setSelectedPrinter={setSelectedPrinter}
          printerDropOpen={printerDropOpen}
          setPrinterDropOpen={setPrinterDropOpen}
          printerScanning={printerScanning}
          setPrinterScanning={setPrinterScanning}
          printerLocked={printerLocked}
        />
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

        <PrinterControl
          printCount={printCount}
          setPrintCount={setPrintCount}
          runPrint={runPrint}
          processDone={processDone}
          selectedPrinter={selectedPrinter}
          printStatus={printStatus}
        />
      </div>
    </Section>
  );
}
