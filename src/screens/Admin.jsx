import { useState } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";

export default function Admin({ onBack }) {
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const tryPin = () => {
    if (pin === "1234") {
      setOk(true);
      setErr(false);
    } else {
      setErr(true);
      setPin("");
    }
  };

  if (!ok)
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>
          {buildCssVars()}
          {G}
        </style>
        <div
          className="card"
          style={{ padding: "44px 38px", width: "330px", textAlign: "center" }}
        >
          <div style={{ fontSize: "34px", marginBottom: "14px" }}>🔐</div>
          <h2
            style={{
              fontFamily: "var(--f)",
              color: "var(--primary)",
              fontSize: "26px",
              marginBottom: "6px",
            }}
          >
            Admin Panel
          </h2>
          <p
            style={{
              color: "rgba(0,0,0,.4)",
              fontSize: "11px",
              marginBottom: "24px",
              letterSpacing: "2px",
            }}
          >
            MASUKKAN PIN
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryPin()}
            placeholder="••••"
            maxLength={6}
            style={{
              textAlign: "center",
              fontSize: "22px",
              letterSpacing: "8px",
              borderColor: err ? "var(--red)" : "rgba(0,0,0,.1)",
            }}
          />
          {err && (
            <div
              style={{
                color: "var(--red)",
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              PIN salah
            </div>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <button
              className="ghost-btn"
              onClick={onBack}
              style={{ flex: 1, justifyContent: "center", display: "flex" }}
            >
              Batal
            </button>
            <button
              className="primary-btn"
              onClick={tryPin}
              style={{
                flex: 1,
                borderRadius: "8px",
                padding: "10px",
                fontSize: "12px",
              }}
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>
        {buildCssVars()}
        {G}
      </style>
      <div
        style={{
          padding: "13px 22px",
          background: "rgba(0,0,0,.03)",
          borderBottom: "1px solid rgba(0,0,0,.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "var(--secondary)",
            fontFamily: "var(--f)",
            fontStyle: "italic",
            fontSize: "18px",
          }}
        >
          Admin Panel
        </span>
        <button className="ghost-btn" onClick={onBack}>
          ← Keluar
        </button>
      </div>
      <div
        className="scroll"
        style={{
          flex: 1,
          padding: "26px 30px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "12px",
          }}
        >
          {[
            { icon: "📸", v: 42, l: "Total Sesi" },
            { icon: "🖼", v: 84, l: "Foto Tersimpan" },
            { icon: "🖨", v: 38, l: "Print Hari Ini" },
          ].map((s) => (
            <div
              key={s.l}
              className="card"
              style={{ padding: "18px", textAlign: "center" }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {s.icon}
              </div>
              <div
                style={{
                  color: "var(--secondary)",
                  fontSize: "28px",
                  fontFamily: "var(--f)",
                  fontWeight: 700,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  color: "rgba(0,0,0,.4)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  marginTop: "4px",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: "18px" }}>
          <div
            style={{
              color: "rgba(0,0,0,.6)",
              fontSize: "11px",
              letterSpacing: "3px",
              marginBottom: "12px",
            }}
          >
            FOLDER PENYIMPANAN
          </div>
          <input type="text" defaultValue="D:\Photobooth\" />
        </div>
        <div className="card" style={{ padding: "18px" }}>
          <div
            style={{
              color: "rgba(0,0,0,.6)",
              fontSize: "11px",
              letterSpacing: "3px",
              marginBottom: "12px",
            }}
          >
            GANTI PIN ADMIN
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="password"
              placeholder="PIN baru"
              style={{ maxWidth: "200px" }}
            />
            <button
              className="primary-btn"
              style={{
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "12px",
              }}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
