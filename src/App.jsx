import React, { useState } from "react";
import InteractiveCourt from "./components/InteractiveCourt";
import PlayerGrid from "./components/PlayerGrid";
import StatTypeSelector from "./components/StatTypeSelector";


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
  const [selectedStat, setSelectedStat] = useState(null);
  const [eventLog, setEventLog] = useState([]);

  //Define stat logger function
  const logStatEvent = ({ zoneId = null, made = null }) => {
    if (!selectedPlayer || !selectedStat) return;
  
    const newEvent = {
      type: "STAT",
      playerId: selectedPlayer.playerId,
      team: selectedPlayer.team,
      statType: selectedStat,
      zoneId,
      made,
      timestamp: Date.now(),
      quarter: 1, // default for now
      metadata: {} // reserved for future use
    };
  
    setEventLog((prev) => [...prev, newEvent]);
    console.log("Logged Event:", newEvent);
  
    // Reset interaction
    setSelectedStat(null);
  };
  
  //Handle Court Taps for Shot Stats
  const handleZoneClick = (zoneId) => {
    if (!selectedStat || !selectedPlayer) return;
  
    if (selectedStat === "2PT" || selectedStat === "3PT") {
      const made = window.confirm("Shot made? OK = Yes, Cancel = No");
      logStatEvent({ zoneId, made });
    }
  };
  

return (
    <div className="App" style={{ padding: "1rem" }}>
      <h2>SnapStats Court</h2>
  
      <InteractiveCourt onZoneClick={handleZoneClick} />
  
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
  
      {/* 🧮 Stat Type Selector */}
      <StatTypeSelector
        selectedStat={selectedStat}
        onSelect={(statType) => {
          setSelectedStat(statType);
          if (statType !== "2PT" && statType !== "3PT" && selectedPlayer) {
            logStatEvent({});
          }
        }}
      />
  
      {/* 🧪 Event Log */}
      <div style={{ marginTop: "1rem" }}>
        <h4>Event Log:</h4>
        <ul>
          {eventLog.map((event, index) => (
            <li key={index}>
              #{event.playerId} | {event.statType}{" "}
              {event.zoneId ? `@ ${event.zoneId}` : ""}{" "}
              {event.made !== null ? (event.made ? "✅" : "❌") : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  
}

export default App;
