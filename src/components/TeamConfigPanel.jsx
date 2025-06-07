import React, { useState } from "react";

const TeamConfigPanel = ({ teamConfig, setTeamConfig }) => {
  const handleNameChange = (team, newName) => {
    setTeamConfig((prev) => ({
      ...prev,
      [team]: { ...prev[team], name: newName }
    }));
  };

const [rawInputs, setRawInputs] = useState({
  home: teamConfig.home.players.join(", "),
  away: teamConfig.away.players.join(", ")
});


  const handleColorChange = (team, newColor) => {
    setTeamConfig((prev) => ({
      ...prev,
      [team]: { ...prev[team], color: newColor }
    }));
  };

const handlePlayersChange = (team, rawValue) => {
    setRawInputs((prev) => ({ ...prev, [team]: rawValue }));
  
    const parsed = rawValue
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 99);
  
    console.log(`Raw input for ${team}:`, rawValue);
    console.log("Parsed jersey numbers:", parsed);
  
    setTeamConfig((prev) => {
      const newConfig = {
        ...prev,
        [team]: {
          ...prev[team],
          players: parsed
        }
      };
      localStorage.setItem("snapstats_teamConfig", JSON.stringify(newConfig));
      return newConfig;
    });
  };
  
  

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "10px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "1rem",
        zIndex: 1000,
        width: "90%",
        maxWidth: "360px"
      }}
    >
      {["home", "away"].map((team) => (
        <div key={team} style={{ marginBottom: "1rem" }}>
          <h4>{team.toUpperCase()} Team</h4>

          <label>
            Name:
            <input
              type="text"
              value={teamConfig[team].name}
              onChange={(e) => handleNameChange(team, e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <label>
            Color:
            <input
              type="color"
              value={teamConfig[team].color}
              onChange={(e) => handleColorChange(team, e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </label>

          <label>
            Jersey Numbers (comma-separated):
            <input
              type="text"
              value={rawInputs[team]}
              onChange={(e) => handlePlayersChange(team, e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default TeamConfigPanel;
