// BAGIAN HOME TOMBOL MULAI

export default function StartButton({ onStart }) {
  return (
    <button
      className="start-btn1"
      onClick={() => onStart()}
      style={{
        borderRadius: "3rem",
        padding: "1.5rem 3.5rem",
        marginTop: "2rem",
      }}
    >
      <img
        src="/assets/Luxerna_Submark.webp"
        alt="stic"
        style={{ width: "28px", height: "28px", objectFit: "contain" }}
      />
      <span>&nbsp;MULAI</span>
    </button>
  );
}
