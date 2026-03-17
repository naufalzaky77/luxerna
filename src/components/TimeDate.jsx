// BAGIAN HOME JAM DAN TANGGAL

import { useState, useEffect } from "react";

export default function TimeDate() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div
        style={{
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h0)",
          fontWeight: "var(--fw-black)",
          color: "var(--primary)",
          letterSpacing: 6,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        {timeStr}
      </div>
      <div
        style={{
          fontFamily: "var(--f)",
          fontSize: "var(--fs-h1)",
          fontWeight: "var(--fw-bold)",
          color: "var(--secondary)",
          letterSpacing: 1,
          marginBottom: "5rem",
          textAlign: "center",
        }}
      >
        {dateStr}
      </div>
    </>
  );
}
