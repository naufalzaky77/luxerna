// BAGIAN CAPTURE TOMBOL SNAP POTRET

export default function SnapButton({ busy, active, allDone, onShoot, onDone }) {
  return (
    <>
      {!allDone && (
        <button
          className={busy ? "snap-btnG" : "snap-btn"}
          onClick={() => !busy && onShoot(active)}
          style={{
            borderRadius: "3rem",
            padding: "1rem 2rem",
          }}
        >
          <img
            src="/assets/photo-sensor.svg"
            alt="spho"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
          <span>&nbsp;{busy ? "MEMOTRET" : `AMBIL FOTO ${active + 1}`}</span>
        </button>
      )}
      {allDone && (
        <button
          className="pros-btn"
          onClick={onDone}
          style={{
            padding: ".5rem .5rem",
            cursor: "pointer",
          }}
        >
          PROSES
        </button>
      )}
    </>
  );
}
