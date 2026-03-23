export default function ProsesPath({
  localPath,
  setLocalPath,
  cloudFolder,
  setCloudFolder,
  pathLocked,
}) {
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        {/* JALUR PENYIMPANAN LOKAL */}
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
          <span>Lokasi penyimpanan lokal</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <img
              src="/assets/folder-open.svg"
              alt="folder"
              className={pathLocked ? "ic-grey" : "ic-blue"}
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
            <input
              type="text"
              value={localPath}
              onChange={(e) => !pathLocked && setLocalPath(e.target.value)}
              readOnly={pathLocked}
              placeholder={"D:\\Luxerna\\"}
              style={{
                paddingLeft: "2.8rem",
                flex: 1,
                cursor: pathLocked ? "default" : "text",
                border: pathLocked
                  ? ".1rem solid rgba(0,0,0,.2)"
                  : ".1rem solid var(--secondary)",
                background: pathLocked
                  ? "rgba(0,0,0,.04)"
                  : "rgba(65,139,250,.04)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-medium)",
                fontSize: "1rem",
                color: pathLocked ? "rgba(0,0,0,.4)" : "var(--primary)",
              }}
            />
          </div>

          {/* ── TOMBOL BROWSE PATH ── */}
          {!pathLocked && (
            <button
              className="back-btn"
              onClick={async () => {
                if (window.electronAPI?.selectFolder) {
                  const path = await window.electronAPI.selectFolder();
                  if (path) setLocalPath(path);
                }
              }}
              style={{
                padding: ".5rem .5rem",
                cursor: "pointer",
              }}
            >
              <img
                src={"/assets/folder-search.svg"}
                alt="fs"
                className="ic-blue"
                style={{
                  width: "16px",
                  height: "16px",
                }}
              />
              PILIH
            </button>
          )}
        </div>
      </div>

      {/* URL PENYIMPANAN AWAN */}
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
            gap: "6px",
          }}
        >
          <span>Alamat penyimpanan awan (Google Drive)</span>
        </div>
        <div style={{ position: "relative" }}>
          <img
            src="/assets/cloud-up.svg"
            alt="cloud"
            className={pathLocked ? "ic-grey" : "ic-blue"}
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
          <input
            type="text"
            value={cloudFolder}
            onChange={(e) => !pathLocked && setCloudFolder(e.target.value)}
            readOnly={pathLocked}
            placeholder="https://google.drive.com/"
            style={{
              paddingLeft: "2.8rem",
              cursor: pathLocked ? "default" : "text",
              border: pathLocked
                ? ".1rem solid rgba(0,0,0,.2)"
                : ".1rem solid var(--secondary)",
              background: pathLocked
                ? "rgba(0,0,0,.04)"
                : "rgba(65,139,250,.04)",
              fontFamily: "var(--f)",
              fontWeight: "var(--fw-medium)",
              fontSize: "1rem",
              color: pathLocked ? "rgba(0,0,0,.4)" : "var(--primary)",
            }}
          />
        </div>
      </div>
    </>
  );
}
