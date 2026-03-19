import { G } from "../styles/global.css";
import { buildCssVars } from "../luxernaTheme";
import TimeDate from "../components/HoTimeDate";
import EventNameInput from "../components/HoEventNameInput";
import StartButton from "../components/HoStartButton";
import AdminButton from "../components/HoAdminButton";
import SessionHeader from "../components/HoSessionHeader";
import LayoutSelect from "../components/HoLayoutSelect";
import CameraSelect from "../components/HoCameraSelect";
import FrameUpload from "../components/HoFrameUpload";
import PreviewSet from "../components/HoPreviewSet";

export default function Home({
  settings,
  onSettingsChange,
  adminUnlocked,
  onToggleAdmin,
  onStart,
}) {
  const { layout, templateFile, templatePreview } = settings;
  const locked = !adminUnlocked;

  const disabledOverlay = locked
    ? {
        opacity: 0.5,
        pointerEvents: "none",
        userSelect: "none",
        filter: "grayscale(0.3)",
      }
    : {};

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>
        {buildCssVars()}
        {G}
      </style>

      {/* ── KOLOM KIRI ── */}
      <div
        style={{
          width: "46%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "52px 44px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "3rem" }}>
          <img
            src="/assets/Luxerna_Full.webp"
            alt="logo"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "contain",
              margin: "auto",
              display: "block",
            }}
          />
        </div>

        <TimeDate />

        <div style={disabledOverlay}>
          <EventNameInput
            eventName={settings.eventName}
            locked={locked}
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </div>

        <StartButton onStart={onStart} />
        <AdminButton
          adminUnlocked={adminUnlocked}
          onToggleAdmin={onToggleAdmin}
        />
      </div>

      {/* ── KOLOM KANAN ── */}
      <div
        className="scroll"
        style={{
          flex: 1,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          zIndex: 2,
        }}
      >
        <SessionHeader adminUnlocked={adminUnlocked} />
        <div style={disabledOverlay}>
          <LayoutSelect
            layout={layout}
            locked={locked}
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </div>

        <div style={disabledOverlay}>
          <CameraSelect
            locked={locked}
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </div>

        <div style={disabledOverlay}>
          <FrameUpload
            templateFile={templateFile}
            templatePreview={templatePreview}
            locked={locked}
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </div>

        <PreviewSet layout={layout} templatePreview={templatePreview} />
      </div>
    </div>
  );
}
