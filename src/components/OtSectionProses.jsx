// BAGIAN OUTPUT SECTION PROSES KANAN

export default function SectProses({
  localPath,
  setLocalPath,
  cloudFolder,
  setCloudFolder,
  pathLocked,
  setPathLocked,
  eventName,
  photoIndex,
  processStatus,
  processSteps,
  processProgress,
  runProcess,
}) {
  const processDone = processStatus === "done";

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
            PROSES
          </span>

          <span
            style={{
              fontWeight: "var(--fw-semiBold)",
              fontSize: "var(--fs-h3)",
              color: "rgba(0,0,0,.5)",
              marginLeft: ".5rem",
            }}
          >
            (Render + Save + Upload)
          </span>
        </span>
      }
      style={{
        border: processDone
          ? ".2rem solid var(--green)"
          : processStatus === "running"
            ? ".2rem solid rgba(255,213,0,.5)"
            : ".2rem solid rgba(65,139,250,.5)",
        backgroundColor: "var(--white)",
      }}
    >
      {/* JALUR PENYIMPANAN LOKAL */}
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
              placeholder="D:\Luxerna\"
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

      {/* PROGRESS BAR */}
      {processStatus !== "idle" && (
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-medium)",
                fontSize: "var(--fs-h3)",
              }}
            >
              KEMAJUAN
            </span>

            <span
              style={{
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-medium)",
                fontSize: "var(--fs-h3)",
              }}
            >
              {processProgress}%
            </span>
          </div>
          <div
            style={{
              background: "rgba(0,0,0,.1)",
              borderRadius: ".5rem",
              height: ".5rem",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "var(--green)",
                width: `${processProgress}%`,
                transition: "width .5s ease",
                borderRadius: ".5rem",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            {processSteps.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "transparent",
                    border: `.15rem solid ${s.done ? "transparent" : "rgba(0,0,0,.3)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--f)",
                    fontWeight: "var(--fw-semiBold)",
                    fontSize: "10px",
                    color: s.done ? "transparent" : "rgba(0,0,0,.3)",
                    transition: "all .35s",
                  }}
                >
                  {s.done ? (
                    <img
                      src="/assets/circle-check.svg"
                      alt="prodo"
                      className="ic-green"
                      style={{
                        width: "1.3rem",
                        height: "1.3rem",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  style={{
                    color: s.done ? "var(--primary)" : "rgba(0,0,0,.3)",
                    fontFamily: "var(--f)",
                    fontWeight: "var(--fw-regular)",
                    fontSize: ".8rem",
                    transition: "color .3s",
                  }}
                >
                  {s.label}
                </span>
                {i === 1 && s.done && (
                  <span
                    style={{
                      color: "var(--secondary)",
                      fontFamily: "var(--f)",
                      fontWeight: "var(--fw-regular)",
                      fontSize: ".8rem",
                      opacity: 0.7,
                    }}
                  >
                    {localPath}\{eventName}\foto_
                    {String(photoIndex.current).padStart(3, "0")}.jpg
                  </span>
                )}
                {i === 2 && s.done && (
                  <span
                    style={{
                      color: "var(--secondary)",
                      fontFamily: "var(--f)",
                      fontWeight: "var(--fw-regular)",
                      fontSize: ".8rem",
                      opacity: 0.6,
                    }}
                  >
                    {cloudFolder}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {/* TOMBOL KUNCI SECTION */}
        <button
          onClick={() => setPathLocked(!pathLocked)}
          className="admin-btn"
          style={{
            background: pathLocked ? "var(--secondary)" : "transparent",
            border: "2px solid var(--secondary)",
            borderRadius: ".5rem",
            padding: ".5rem 1rem",
            cursor: "pointer",
            color: pathLocked ? "var(--white)" : "var(--secondary)",
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
            src={pathLocked ? "/assets/lock-open-2.svg" : "/assets/lock.svg"}
            alt="lock"
            className={pathLocked ? "ic-white" : "ic-blue"}
            style={{
              width: "16px",
              height: "16px",
            }}
          />
          {pathLocked ? "BUKA" : "TERAPKAN"}
        </button>

        {/* TOMBOL PROSES */}
        <div style={{ marginLeft: "auto" }}>
          {processStatus === "idle" && (
            <button
              className="procs-btn"
              onClick={runProcess}
              style={{
                borderRadius: ".5rem",
                padding: ".7rem 1rem",
              }}
            >
              <img
                src="/assets/settings.svg"
                alt="procs"
                style={{
                  width: "28px",
                  height: "28px",
                  objectFit: "contain",
                }}
              />
              <span>PROSES</span>
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}
