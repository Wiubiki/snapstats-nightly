import React, { useState, useEffect } from "react";
import InteractiveCourt from "./components/InteractiveCourt";
import PlayerGrid from "./components/PlayerGrid";
import StatTypeSelector from "./components/StatTypeSelector";
import GameRibbon from "./components/GameRibbon";




function App() {
  // ✅ useState must be inside App component
  const [teamConfig, setTeamConfig] = useState({
    home: {
      name: "Home",
      color: "#18bd0d",
      players: Array.from({ length: 12 }, (_, i) => i + 4)
    },
    away: {
      name: "Away",
      color: "#dc3545",
      players: Array.from({ length: 12 }, (_, i) => i + 4)
    }
  });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [quarter, setQuarter] = useState(1);

  // Helper functions for team score + fouls
  const getScoreForTeam = (team) => {
    return eventLog.reduce((sum, e) => {
      if (e.team === team && e.made) {
        if (e.statType === "3PT") return sum + 3;
        if (e.statType === "2PT") return sum + 2;
        if (e.statType === "FT") return sum + 1;
      }
      return sum;
    }, 0);
  };
  
  const getFoulsForTeam = (team) => {
    return eventLog.filter((e) => e.team === team && e.statType === "PF").length;
  };

  // Function to handle undo events
  const handleUndo = () => {
    if (eventLog.length === 0) return;
  
    const updatedLog = [...eventLog.slice(0, -1)];
    setEventLog(updatedLog);
    localStorage.setItem("snapstats_eventLog", JSON.stringify(updatedLog));
  };
  
  

  //Define stat logger function
  const logStatEvent = ({ zoneId = null, made = null, statOverride = null  }) => {
    if (!selectedPlayer || !(statOverride || selectedStat)) return;
  
    const newEvent = {
      type: "STAT",
      playerId: selectedPlayer.playerId,
      team: selectedPlayer.team,
      statType: statOverride || selectedStat,
      zoneId,
      made,
      timestamp: Date.now(),
      quarter: 1, // default for now
      metadata: {} // reserved for future use
    };

    console.log("Logged Event:", newEvent); // console logs in browser dev tools
  
    setEventLog((prev) => {
      const updated = [...prev, newEvent];
      localStorage.setItem("snapstats_eventLog", JSON.stringify(updated));
      return updated;
    });
    
  
    // Reset interaction
    setSelectedStat(null);
  };
  
  //Handle Court Taps for Shot Stats
  const handleZoneClick = (zoneId) => {
    if (!selectedPlayer) return;
  
    const shotType = zoneId.includes("3") ? "3PT" : "2PT";
    const made = window.confirm(`${shotType} attempt — made? OK = Yes, Cancel = No`);
  
    logStatEvent({ zoneId, made, statOverride: shotType });
  };
  

  // ✅ Local storage hydration — must be inside App()
  useEffect(() => {
    const saved = localStorage.getItem("snapstats_eventLog");
    if (saved) {
      setEventLog(JSON.parse(saved));
    }
  }, []);


  

return (
    <div className="App" style={{ padding: "1rem", maxWidth:"100vw", overflowX:"hidden", margin: "0 auto" }}>
    <div className="GameRibbon" style={{ width: "100%",  maxWidth:"100vw", height: "auto"  }}>
	  <GameRibbon
	    homeScore={getScoreForTeam("home")}
	    awayScore={getScoreForTeam("away")}
	    homeFouls={getFoulsForTeam("home")}
	    awayFouls={getFoulsForTeam("away")}
	    quarter={quarter}
	    onQuarterChange={(delta) => {
	      setQuarter((prev) => {
	        const next = Math.max(1, Math.min(prev + delta, 4));
	        if (next !== prev) {
	          // Reset foul-related events only (optional enhancement)
	          setEventLog((prevLog) =>
	            prevLog.filter((e) => e.statType !== "PF")
	          );
	          localStorage.setItem(
	            "snapstats_eventLog",
	            JSON.stringify(
	              eventLog.filter((e) => e.statType !== "PF")
	            )
	          );
	        }
	        return next;
	      });
	    }}
	    
	  />
	  </div>

	  <div className="court-wrapper" style={{ 
	  									width: "100vw",  
	  									maxWidth:"100%", 
	  									height: "auto", 
	  									position:"relative", 
	  									overflow: "hidden"  }}>

      <InteractiveCourt onZoneClick={handleZoneClick} />
      </div>
  
	  <div
	    style={{
	      display: "flex",
	      justifyContent: "space-between",
	      marginTop: "1rem",
	      width: "100%"
	    }}
	  >
	  {/* Home + Away PlayerGrids */}
	  <div style={{ width: "66.66%" }}>
      <PlayerGrid
        team="home"
        config={teamConfig.home}
        selectedPlayer={selectedPlayer}
        onSelect={setSelectedPlayer}
        onEdit={(newPlayers) =>
          setTeamConfig((prev) => ({
            ...prev,
            home: { ...prev.home, players: newPlayers }
          }))
        }
      />
      
      <PlayerGrid
        team="away"
        config={teamConfig.away}
        selectedPlayer={selectedPlayer}
        onSelect={setSelectedPlayer}
        onEdit={(newPlayers) =>
          setTeamConfig((prev) => ({
            ...prev,
            away: { ...prev.away, players: newPlayers }
          }))
        }
      />
      </div>
  
      {/* 🧮 Stat Type Selector */}
      <div style={{ width: "33.33%" }}>
      <StatTypeSelector
        selectedStat={selectedStat}
        onSelect={(statType) => {
          setSelectedStat(statType);
      
          if (statType === "FT" && selectedPlayer) {
            const made = window.confirm("Free throw made? OK = Yes, Cancel = No");
            logStatEvent({ made, statOverride: "FT" }); // pass it manually
          }
      
          if (
            !["FT", "2PT", "3PT"].includes(statType) &&
            selectedPlayer
          ) {
            logStatEvent({ statOverride: statType });
          }
        }}
      />
      </div>
      </div>

      {/* Button for changing quarter, undo action and  reseting game */}

      <button
        onClick={() => setQuarter((prev) => Math.min(prev + 1, 4))}
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Next Quarter
      </button>
      
      <button
        onClick={() => {
          if (window.confirm("Reset all logged events?")) {
            localStorage.removeItem("snapstats_eventLog");
            setEventLog([]);
          }
        }}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Reset Game
      </button>

      <button
        onClick={handleUndo}
        style={{
          marginTop: "1rem",
          marginRight: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Undo Last
      </button>
  
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
