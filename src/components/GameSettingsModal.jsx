import React, { useState, useEffect } from "react";

export default function GameSettingsModal({ onClose, onSave }) {
  const [home, setHome] = useState({
    useMyTeam: false,
    name: "Home",
    primaryColor: "#18bd0d",
    secondaryColor: "#ffffff",
    players: Array.from({ length: 12 }, (_, i) => i + 4).join(",")
  });

  const [away, setAway] = useState({
    useMyTeam: false,
    name: "Away",
    primaryColor: "#dc3545",
    secondaryColor: "#ffffff",
    players: Array.from({ length: 12 }, (_, i) => i + 4).join(",")
  });

  const [myTeam, setMyTeam] = useState(null);
  const foulLimit = 5; // fixed
  const periodLength = 10; // fixed

  useEffect(() => {
    const stored = localStorage.getItem("snapstats.myTeam");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMyTeam(parsed);
    }
  }, []);

  const applyMyTeam = (toHome) => {
    if (!myTeam) return;
    const target = {
      name: myTeam.teamName || "MyTeam",
      primaryColor: myTeam.primaryColor,
      secondaryColor: myTeam.secondaryColor,
      players: myTeam.players.filter((p) => p.inRoster).map((p) => p.jersey).join(",")
    };
    if (toHome) {
      setHome((prev) => ({ ...target, useMyTeam: true }));
    } else {
      setAway((prev) => ({ ...target, useMyTeam: true }));
    }
  };

  const clearMyTeam = (toHome) => {
    const defaultTeam = {
      name: toHome ? "Home" : "Away",
      primaryColor: toHome ? "#18bd0d" : "#dc3545",
      secondaryColor: "#ffffff",
      players: Array.from({ length: 12 }, (_, i) => i + 4).join(","),
      useMyTeam: false
    };
    toHome ? setHome(defaultTeam) : setAway(defaultTeam);
  };

  const handleSave = () => {
    const teamConfig = {
      home: {
        name: home.name,
        color: home.primaryColor,
        players: home.players
          .split(",")
          .map((num) => parseInt(num.trim(), 10))
          .filter((n) => !isNaN(n))
      },
      away: {
        name: away.name,
        color: away.primaryColor,
        players: away.players
          .split(",")
          .map((num) => parseInt(num.trim(), 10))
          .filter((n) => !isNaN(n))
      },
      meta: {
        foulLimit,
        periodLength
      }
    };
    onSave(teamConfig);
    onClose();
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>Game Settings</h2>

      {[{ label: "Home Team", data: home, setData: setHome, isHome: true }, { label: "Away Team", data: away, setData: setAway, isHome: false }].map(
        ({ label, data, setData, isHome }) => (
          <div key={label} style={{ marginTop: 24, padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
            <h4>{label}</h4>
            {myTeam && (
              <button
                onClick={() =>
                  data.useMyTeam ? clearMyTeam(isHome) : applyMyTeam(isHome)
                }
                style={{ marginBottom: 8 }}
              >
                {data.useMyTeam ? `❌ Cancel MyTeam` : `🔧 Use MyTeam`}
              </button>
            )}

            <label>
              Team Name:
              <input
                type="text"
                disabled={data.useMyTeam}
                value={data.name}
                onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>
            <br />
            <label>
              Primary Color:
              <input
                type="color"
                disabled={data.useMyTeam}
                value={data.primaryColor}
                onChange={(e) => setData((prev) => ({ ...prev, primaryColor: e.target.value }))}
              />
            </label>
            <label>
              Secondary Color:
              <input
                type="color"
                disabled={data.useMyTeam}
                value={data.secondaryColor}
                onChange={(e) => setData((prev) => ({ ...prev, secondaryColor: e.target.value }))}
              />
            </label>
            <br />
            <label>
              Jersey Numbers (comma-separated):
              <input
                type="text"
                disabled={data.useMyTeam}
                value={data.players}
                onChange={(e) => setData((prev) => ({ ...prev, players: e.target.value }))}
              />
            </label>
          </div>
        )
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSave} style={{ backgroundColor: "#28a745", color: "white" }}>
          ✅ Start Game
        </button>
      </div>
    </div>
  );
}
