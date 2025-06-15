// src/components/MenuModal.jsx
import React from "react";

export default function MenuModal({
  isStartup,
  onClose,
  onResumeGame,
  onQuickStart,
  onStartNewGame,
  onOpenMyTeam,
  onOpenGameSettings,
  onImportGame,
  resumeGameExists = false,
  version = "1.2.0",
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "360px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {isStartup ? `Welcome to SnapStats (v${version})` : "SnapStats Menu"}
        </h2>

        {isStartup && resumeGameExists && (
			
          <button className="menu-btn" onClick={onResumeGame}>▶️ Resume Game</button>
        )}

        <button className="menu-btn" onClick={onQuickStart}>⚡ Quick Start</button>
        <button className="menu-btn" onClick={onStartNewGame}>🎯 Start New Game</button>
        <button className="menu-btn" onClick={onOpenMyTeam}>🛠 Configure MyTeam</button>

        {!isStartup && (
          <button className="menu-btn" onClick={onOpenGameSettings}>⚙️ Game Settings</button>
        )}

        <button className="menu-btn" onClick={onImportGame}>📥 Import Game</button>

        <hr style={{ margin: "16px 0" }} />

        <button
          className="menu-btn"
          onClick={onClose}
          style={{ backgroundColor: "#ccc", color: "#333" }}
        >
          ❌ Close
        </button>
      </div>
    </div>
  );
}
