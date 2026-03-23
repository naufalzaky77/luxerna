import { useRef } from "react";

export default function KirimModeNama({
  guestQuery,
  setGuestQuery,
  searchGuest,
  guestResults,
  setGuestResults,
  selectGuest,
  selectedGuest,
  setSelectedGuest,
  setWaStatus,
}) {
  const delImg1Ref = useRef(null);

  const makeAnimHandlers = (ref, enterAnim, leaveAnim) => ({
    onMouseEnter: () => {
      const img = ref.current;
      if (!img) return;
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = enterAnim;
    },
    onMouseLeave: () => {
      const img = ref.current;
      if (!img) return;
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = leaveAnim;
    },
  });

  const del1Handlers = makeAnimHandlers(
    delImg1Ref,
    "spinLogo .3s ease forwards",
    "spinLogoReverse .3s ease forwards",
  );

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={guestQuery}
          onChange={(e) => {
            const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            searchGuest(val);
          }}
          placeholder="Ketik nama tamu..."
          style={{
            paddingLeft: "2.8rem",
            flex: 1,
            cursor: "text",
            border: ".1rem solid var(--secondary)",
            background: "rgba(65,139,250,.04)",
            fontFamily: "var(--f)",
            fontWeight: "var(--fw-medium)",
            fontSize: "1rem",
            color: "var(--primary)",
          }}
        />
        <img
          src="/assets/search.svg"
          alt="nama"
          className="ic-blue"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1.3rem",
            height: "1.3rem",
            pointerEvents: "none",
          }}
        />
        {guestQuery && (
          <button
            onClick={() => {
              setGuestQuery("");
              setGuestResults([]);
              setSelectedGuest(null);
              setWaStatus("idle");
            }}
            className="del-btn"
            {...del1Handlers}
            style={{
              flexShrink: 0,
              position: "absolute",
              right: ".7rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <img
              ref={delImg1Ref}
              src="/assets/x.svg"
              alt="rmv"
              className="rmv-img"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {guestResults.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--white)",
            borderRadius: "1rem",
            overflow: "hidden",
            animation: "fadeUp .18s ease",
          }}
        >
          {guestResults.map((g) => (
            <div
              key={g.id}
              onClick={() => selectGuest(g)}
              style={{
                padding: "1rem 1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "var(--secondary)",
                    fontFamily: "var(--f)",
                    fontWeight: "var(--fw-medium)",
                    fontSize: ".8rem",
                  }}
                >
                  {g.name}
                </div>
                <div
                  style={{
                    color: "rgba(0,0,0,.4)",
                    fontFamily: "var(--f)",
                    fontWeight: "var(--fw-medium)",
                    fontSize: ".6rem",
                    marginTop: ".2rem",
                  }}
                >
                  +{g.wa}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {guestQuery && guestResults.length === 0 && !selectedGuest && (
        <div
          style={{
            marginTop: ".8rem",
            color: "var(--red)",
            fontFamily: "var(--f)",
            fontWeight: "var(--fw-medium)",
            fontSize: "var(--fs-h3)",
            textAlign: "center",
          }}
        >
          Nama tidak ditemukan
        </div>
      )}
    </div>
  );
}
