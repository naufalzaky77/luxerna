// BAGIAN HOME PREVIEW SETTINGNYA

import LayoutPreview from "../components/LayoutPreview";

export default function PreviewSet({ layout, templatePreview }) {
  return (
    <div>
      <div
        style={{
          color: "var(--black)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-medium)",
          letterSpacing: ".1rem",
          marginBottom: "1.5rem",
        }}
      >
        PREVIEW
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LayoutPreview layout={layout} templatePreview={templatePreview} />
      </div>
    </div>
  );
}
