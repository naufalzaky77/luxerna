// BAGIAN HOME TOMBOL KUNCI ADMIN

export default function AdminButton({ adminUnlocked, onToggleAdmin }) {
  return (
    <button
      className="admin-btn"
      onClick={onToggleAdmin}
      style={{
        position: "absolute",
        bottom: "3rem",
        left: "3rem",
        background: adminUnlocked ? "var(--secondary)" : "transparent",
        border: "2px solid var(--secondary)",
        borderRadius: ".5rem",
        padding: ".5rem 1rem",
        cursor: "pointer",
        color: adminUnlocked ? "var(--white)" : "var(--secondary)",
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
        src={adminUnlocked ? "/assets/lock-open-2.svg" : "/assets/lock.svg"}
        alt="lock"
        className={adminUnlocked ? "ic-white" : "ic-blue"}
        style={{
          width: "16px",
          height: "16px",
        }}
      />
      {adminUnlocked ? "TUTUP KUNCI" : "BUKA KUNCI"}
    </button>
  );
}
