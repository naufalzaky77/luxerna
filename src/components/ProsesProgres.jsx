import getAsset from "../utils/getAsset";

export default function ProsesProgres({
  processStatus,
  processProgress,
  processSteps,
  filePath,
  cloudFolder,
}) {
  if (processStatus === "idle") return null;

  return (
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
                  src={getAsset("/assets/circle-check.svg")}
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
                {filePath}
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
  );
}
