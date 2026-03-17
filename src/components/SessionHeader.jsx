// BAGIAN HOME HEADER SESI PENGATURAN

export default function SessionHeader({ adminUnlocked }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          color: "var(--secondary)",
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h2)",
          fontWeight: "var(--fw-bold)",
          letterSpacing: ".3rem",
        }}
      >
        PENGATURAN SESI
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: ".3rem .3rem",
          borderRadius: ".5rem",
          border: `3px solid ${adminUnlocked ? "var(--green)" : "var(--red)"}`,
          background: adminUnlocked ? "var(--green)" : "var(--red)",
        }}
      >
        <span
          style={{
            color: "var(--white)",
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h3)",
            fontWeight: "var(--fw-semiBold)",
            letterSpacing: ".1rem",
          }}
        >
          {adminUnlocked ? "TERBUKA" : "TERKUNCI"}
        </span>
      </div>
    </div>
  );
}
