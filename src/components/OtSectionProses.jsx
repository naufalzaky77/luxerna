// BAGIAN OUTPUT SECTION PROSES KANAN

import { useRef } from "react";
import ProsesPath from "./ProsesPath";
import ProsesProgres from "./ProsesProgres";

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
  const filePath = `${localPath}\\${eventName}\\foto_${String(photoIndex.current).padStart(3, "0")}.jpg`;
  const procsImgRef = useRef(null);

  const handleProcsEnter = () => {
    const img = procsImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogo .3s ease forwards";
  };

  const handleProcsLeave = () => {
    const img = procsImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogoReverse .3s ease forwards";
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
      <ProsesPath
        localPath={localPath}
        setLocalPath={setLocalPath}
        cloudFolder={cloudFolder}
        setCloudFolder={setCloudFolder}
        pathLocked={pathLocked}
      />

      <ProsesProgres
        processStatus={processStatus}
        processProgress={processProgress}
        processSteps={processSteps}
        filePath={filePath}
        cloudFolder={cloudFolder}
      />

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
              onMouseEnter={handleProcsEnter}
              onMouseLeave={handleProcsLeave}
              style={{
                borderRadius: ".5rem",
                padding: ".7rem 1rem",
              }}
            >
              <img
                ref={procsImgRef}
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
