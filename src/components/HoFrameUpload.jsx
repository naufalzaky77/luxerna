// BAGIAN HOME UPLOAD TEMPLATE FRAME

import { useRef } from "react";
import getAsset from "../utils/getAsset";

export default function FrameUpload({
  templateFile,
  templatePreview,
  locked,
  settings,
  onSettingsChange,
}) {
  const fileRef = useRef();
  const rmvImgRef = useRef(null);

  const handleRmvEnter = () => {
    const img = rmvImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogo .6s ease forwards";
  };

  const handleRmvLeave = () => {
    const img = rmvImgRef.current;
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "spinLogoReverse .6s ease forwards";
  };

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSettingsChange({ ...settings, templateFile: file, templatePreview: url });
  };

  const removeTemplate = () => {
    onSettingsChange({
      ...settings,
      templateFile: null,
      templatePreview: null,
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <div
        style={{
          color: "var(--primary)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          letterSpacing: ".1rem",
          marginBottom: ".5rem",
        }}
      >
        DESAIN FRAME
      </div>

      {/* BAGIAN ZONA UPLOAD */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleTemplateUpload}
      />
      {!templateFile ? (
        <div
          className="upload-zone"
          onClick={() => !locked && fileRef.current.click()}
          style={{ cursor: locked ? "default" : "pointer" }}
        >
          <img
            src={getAsset("/assets/upload.svg")}
            alt="up"
            className="up-img"
            style={{
              width: "3rem",
              height: "3rem",
            }}
          />
          <div
            className="up-text"
            style={{
              fontFamily: "var(--f)",
              fontWeight: "var(--fw-semiBold)",
              fontSize: "var(--fs-h2)",
              letterSpacing: ".1rem",
            }}
          >
            Klik untuk unggah desain frame
          </div>
        </div>
      ) : (
        <div
          className="upload-zone has-file"
          style={{
            flexDirection: "row",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "82px",
              flexShrink: 0,
            }}
          >
            <img
              src={templatePreview}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              alt=""
            />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "var(--secondary)",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-medium)",
                fontSize: "var(--fs-h2)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
              }}
            >
              <img
                src={getAsset("/assets/file.svg")}
                alt="file"
                className="ic-blue"
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
              {templateFile.name}
            </div>
          </div>
          {!locked && (
            <button
              onClick={removeTemplate}
              className="ghost-btn"
              onMouseEnter={handleRmvEnter}
              onMouseLeave={handleRmvLeave}
              style={{
                flexShrink: 0,
              }}
            >
              <img
                ref={rmvImgRef}
                src={getAsset("/assets/x.svg")}
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
      )}
    </div>
  );
}
