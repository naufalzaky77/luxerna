// Setup Google Drive component untuk Home screen
import { useState } from "react";
import getAsset from "../utils/getAsset";

export default function HoGoogleDriveSetup({ settings, onSettingsChange }) {
  const [showSetup, setShowSetup] = useState(false);
  const [credentialsJson, setCredentialsJson] = useState("");
  const [setupStatus, setSetupStatus] = useState("idle"); // idle | loading | success | error
  const [setupMessage, setSetupMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await window.electronAPI.googleIsAuthenticated();
      if (result.authenticated) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleSetupCredentials = async () => {
    if (!credentialsJson.trim()) {
      setSetupMessage("*Tempelkan Credentials JSON dulu!");
      return;
    }

    setSetupStatus("loading");
    try {
      const credentials = JSON.parse(credentialsJson);
      const result =
        await window.electronAPI.googleSetupCredentials(credentials);

      if (result.success) {
        setSetupStatus("success");
        setSetupMessage("Credentials berhasil disimpan!");
        setCredentialsJson("");
        setTimeout(() => {
          setShowSetup(false);
          setSetupStatus("idle");
        }, 1500);
      } else {
        setSetupStatus("error");
        setSetupMessage(`*${result.error}`);
      }
    } catch (err) {
      setSetupStatus("error");
      setSetupMessage(`Format JSON invalid: ${err.message}`);
    }
  };

  const handleAuthenticate = async () => {
    setSetupStatus("loading");
    try {
      const result = await window.electronAPI.googleAuthenticate();
      if (result.success) {
        setSetupStatus("success");
        setSetupMessage("Autentikasi berhasil!");
        setTimeout(() => {
          setShowSetup(false);
          setSetupStatus("idle");
        }, 1500);
      } else {
        setSetupStatus("error");
        setSetupMessage(`*${result.error}`);
      }
    } catch (err) {
      setSetupStatus("error");
      setSetupMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      {!showSetup && (
        <button
          onClick={() => (isAuthenticated ? null : setShowSetup(true))}
          className="admin-btn"
          style={{
            width: "100%",
            padding: ".5rem",
            background: isAuthenticated ? "var(--green)" : "var(--secondary)",
            border: ".2rem solid var(--secondary)",
            borderRadius: ".7rem",
            cursor: isAuthenticated ? "default" : "pointer",
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h2)",
            fontWeight: "var(--fw-semiBold)",
            color: "var(--white)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: ".7rem",
            transition: "all .2s",
          }}
        >
          <img
            src={getAsset("/assets/brand-google-drive.svg")}
            alt="gdrive"
            className="ic-white"
            style={{ width: "2rem", height: "2rem" }}
          />
          {isAuthenticated ? "GOOGLE DRIVE TERHUBUNG" : "ATUR GOOGLE DRIVE"}
        </button>
      )}

      {showSetup && (
        <div
          style={{
            width: "100%",
            padding: ".5rem",
            background: "rgba(65,139,250,.05)",
            border: ".2rem solid var(--secondary)",
            borderRadius: ".5rem",
            cursor: "default",
            fontFamily: "var(--f)",
            fontSize: "var(--fs-h3)",
            fontWeight: "var(--fw-semiBold)",
            color: "var(--secondary)",
            alignItems: "center",
            transition: "all .2s",
          }}
        >
          {/* Step 1: Upload Credentials */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-bold)",
                fontSize: "var(--fs-h3)",
                color: "var(--secondary)",
                marginBottom: ".5rem",
                letterSpacing: ".1rem",
              }}
            >
              TEMPEL CREDENTIALS JSON
            </div>
            <textarea
              value={credentialsJson}
              onChange={(e) => setCredentialsJson(e.target.value)}
              placeholder="Tempel isi dari credentials.json dari Google Console"
              style={{
                width: "100%",
                minHeight: "120px",
                padding: ".75rem",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-regular)",
                fontSize: "var(--fs-h2)",
                borderRadius: ".5rem",
                background: "var(--white)",
                color: "var(--primary)",
                lineHeight: "1.5rem",
              }}
            />
          </div>

          <div
            style={{
              width: "100%",
              padding: ".75rem",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {/* Step 2: Save Credentials */}
            <button
              onClick={handleSetupCredentials}
              disabled={setupStatus === "loading"}
              style={{
                width: "100%",
                background:
                  setupStatus === "loading"
                    ? "var(--yellow)"
                    : "var(--secondary)",
                color: "var(--white)",
                border: "none",
                borderRadius: ".5rem",
                cursor: setupStatus === "loading" ? "default" : "pointer",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h2)",
                transition: "all .2s",
              }}
            >
              {setupStatus === "loading" ? "Menyimpan..." : "SIMPAN"}
            </button>

            {/* Step 2b: Authenticate */}
            <button
              onClick={handleAuthenticate}
              disabled={setupStatus === "loading"}
              style={{
                width: "100%",
                padding: ".5rem",
                background:
                  setupStatus === "loading"
                    ? "var(--yellow)"
                    : "var(--secondary)",
                color: "var(--white)",
                border: "none",
                borderRadius: ".5rem",
                cursor: setupStatus === "loading" ? "default" : "pointer",
                fontFamily: "var(--f)",
                fontWeight: "var(--fw-semiBold)",
                fontSize: "var(--fs-h2)",
                transition: "all .2s",
              }}
            >
              {setupStatus === "loading" ? "MENGAUTENTIKASI..." : "AUTENTIKASI"}
            </button>
          </div>

          {/* PESAN STATUS */}
          {setupMessage && (
            <div
              style={{
                padding: ".5rem",
                color:
                  setupStatus === "success" ? "var(--green)" : "var(--red)",
                fontFamily: "var(--f)",
                fontSize: "var(--fs-h2)",
                fontWeight: "var(--fw-regular)",
              }}
            >
              {setupMessage}
            </div>
          )}

          {/* TOMBOL TUTUP */}
          <button
            onClick={() => {
              setShowSetup(false);
              setSetupStatus("idle");
              setSetupMessage("");
            }}
            style={{
              marginTop: ".75rem",
              width: "100%",
              padding: ".5rem",
              background: "var(--red)",
              border: "none",
              borderRadius: ".5rem",
              cursor: "pointer",
              color: "var(--white)",
              fontFamily: "var(--f)",
              fontSize: "var(--fs-h2)",
              fontWeight: "var(--fw-bold)",
            }}
          >
            TUTUP
          </button>
        </div>
      )}
    </div>
  );
}
