import { useRef } from "react";

export default function KirimModeWA({ waNumber, setWaNumber, setWaStatus }) {
  const delImg2Ref = useRef(null);

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

  const del2Handlers = makeAnimHandlers(
    delImg2Ref,
    "spinLogo .3s ease forwards",
    "spinLogoReverse .3s ease forwards",
  );

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ position: "relative" }}>
        <input
          type="tel"
          value={waNumber}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            setWaNumber(val);
            setWaStatus("idle");
          }}
          placeholder="Ketik nomor WhatsApp tamu..."
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
          src="/assets/brand-whatsapp.svg"
          alt="nama"
          className="ic-blue"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1.5rem",
            height: "1.5rem",
            pointerEvents: "none",
          }}
        />
        {waNumber && (
          <button
            onClick={() => {
              setWaNumber("");
              setWaStatus("idle");
            }}
            className="del-btn"
            {...del2Handlers}
            style={{
              flexShrink: 0,
              position: "absolute",
              right: ".7rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <img
              ref={delImg2Ref}
              src="/assets/x.svg"
              alt="rmv"
              className="rmv-img"
              style={{ width: "1.5rem", height: "1.5rem" }}
            />
          </button>
        )}
      </div>

      {waNumber.length > 0 && waNumber.length < 9 && (
        <div
          style={{
            marginTop: ".8rem",
            marginLeft: ".8rem",
            color: "var(--red)",
            fontFamily: "var(--f)",
            fontWeight: "var(--fw-medium)",
            fontSize: "var(--fs-h3)",
          }}
        >
          Nomor terlalu pendek
        </div>
      )}
    </div>
  );
}
