// BAGIAN HOME PREVIEW SETTINGNYA

import LayoutPreview from "./LayoutPreview";

export default function PreviewSet({ layout, templatePreview }) {
  return (
    <div>
      <div
        style={{
          color: "var(--primary)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          letterSpacing: ".1rem",
          marginBottom: "1.5rem",
        }}
      >
        PRATINJAU
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LayoutPreview layout={layout} templatePreview={templatePreview} />
      </div>
    </div>
  );
}
