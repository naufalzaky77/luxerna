// BAGIAN HOME BAR NAMA ACARA

export default function EventNameInput({
  eventName,
  locked,
  settings,
  onSettingsChange,
}) {
  const set = (key, val) => onSettingsChange({ ...settings, [key]: val });

  return (
    <div style={{ width: "100%", maxWidth: "360px", marginBottom: "28px" }}>
      <div
        style={{
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h3)",
          fontWeight: "var(--fw-semiBold)",
          color: "var(--primary)",
          letterSpacing: 2,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        NAMA ACARA
      </div>

      {/* BAGIAN BAR INPUT */}
      <input
        type="text"
        value={eventName}
        onChange={(e) => !locked && set("eventName", e.target.value)}
        placeholder="Luxius & Erna"
        readOnly={locked}
        style={{
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h2)",
          fontWeight: "var(--fw-medium)",
          fontStyle: "italic",
          textAlign: "center",
          border: `3px solid ${locked ? "var(--ash)" : "#418bfa"}`,
          cursor: locked ? "default" : "text",
          background: locked ? "var(--ash)" : "transparent",
          color: locked ? "var(--white)" : "var(--primary)",
        }}
      />
    </div>
  );
}
