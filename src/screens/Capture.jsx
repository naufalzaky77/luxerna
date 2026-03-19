import { useState, useRef } from "react";
import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import { MOCK } from "../data/mockData";
import HeadBar from "../components/CapHeadBar";
import ViewFinder from "../components/CapViewFinder";
import SnapButton from "../components/CapSnapButton";
import SideBar from "../components/CapSideBar";

export default function Capture({ settings, onDone, onBack }) {
  const { layout, templatePreview } = settings;
  const total = layout.shots;
  const [photos, setPhotos] = useState(Array(total).fill(null));
  const [active, setActive] = useState(0);
  const [cd, setCd] = useState(null);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);
  const allDone = photos.every(Boolean);

  const shoot = (slot) => {
    if (busy) return;
    setBusy(true);
    setCd("SIAP");
    setTimeout(() => {
      let n = 3;
      setCd(n);
      timerRef.current = setInterval(() => {
        n--;
        if (n === 0) {
          clearInterval(timerRef.current);
          setCd(null);
          setTimeout(() => {
            const np = [...photos];
            np[slot] = MOCK[slot % MOCK.length];
            setPhotos(np);
            setBusy(false);
            const nx = np.findIndex((p) => p === null);
            if (nx !== -1) setActive(nx);
          }, 380);
        } else setCd(n);
      }, 1000);
    }, 1000);
  };

  const retake = (slot) => {
    if (busy) return;
    const np = [...photos];
    np[slot] = null;
    setPhotos(np);
    setActive(slot);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--f)",
      }}
    >
      <style>
        {buildCssVars()}
        {G}
      </style>

      <HeadBar
        onBack={onBack}
        settings={settings}
        layout={layout}
        photos={photos}
        active={active}
        total={total}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--white)",
            alignItems: "center",
            justifyContent: "center",
            gap: "3rem",
            padding: "28px",
          }}
        >
          <ViewFinder templatePreview={templatePreview} cd={cd} />
          <SnapButton
            busy={busy}
            active={active}
            allDone={allDone}
            onShoot={shoot}
            onDone={() => onDone(photos)}
          />
        </div>

        <SideBar
          layout={layout}
          photos={photos}
          active={active}
          busy={busy}
          setActive={setActive}
          retake={retake}
          total={total}
        />
      </div>
    </div>
  );
}
