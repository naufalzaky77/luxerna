// BAGIAN HOME JAM DAN TANGGAL

import { useState, useEffect } from "react";

export default function TimeDate({
  showDate = true,
  timeSize = "var(--fs-h0)",
  timeWeight = "var(--fw-black)",
  noMargin = false,
  timeColor = "var(--primary)",
  timeSpacing = 1,
}) {
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
      {/* BAGIAN JAM */}
      <div
        style={{
          fontFamily: "var(--f)",
          fontSize: timeSize,
          fontWeight: timeWeight,
          color: timeColor,
          letterSpacing: timeSpacing,
          marginBottom: noMargin ? 0 : "1.5rem",
          textAlign: "center",
        }}
      >
        {timeStr}
      </div>

      {/* BAGIAN TANGGAL */}
      {showDate && (
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
      )}
    </>
  );
}
