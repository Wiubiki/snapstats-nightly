import React, { useState } from "react";
import InteractiveCourt from "./components/InteractiveCourt";
import PlayerGrid from "./components/PlayerGrid";

// Config can stay outside App (perfectly done)
const teamConfig = {
  home: {
    name: "Home",
    color: "#007bff",
    players: Array.from({ length: 12 }, (_, i) => i + 4),
  },
  away: {
    name: "Away",
    color: "#dc3545",
    players: Array.from({ length: 12 }, (_, i) => i + 4),
  }
};

function App() {
  // ✅ useState must be inside App component
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleZoneClick = (zoneId) => {
    console.log("You clicked zone:", zoneId);
  };

  return (
    <div className="App" style={{ padding: "1rem" }}>
      <h2>SnapStats Court</h2>

      {/* 🏀 Interactive court */}
      <InteractiveCourt onZoneClick={handleZoneClick} />

      {/* 👕 Player grids */}
      <PlayerGrid
        team="home"
        config={teamConfig.home}
        selectedPlayer={selectedPlayer}
        onSelect={setSelectedPlayer}
      />

      <PlayerGrid
        team="away"
        config={teamConfig.away}
        selectedPlayer={selectedPlayer}
        onSelect={setSelectedPlayer}
      />
    </div>
  );
}

export default App;
