import React, { useState, useEffect, useRef } from "react";
import InteractiveCourt from "./components/InteractiveCourt";
import PlayerGrid from "./components/PlayerGrid";
import StatTypeSelector from "./components/StatTypeSelector";
import GameRibbon from "./components/GameRibbon";
import ShotResultModal from "./components/ShotResultModal.jsx";
import TeamConfigPanel from "./components/TeamConfigPanel";
import MyTeamConfig from "./components/MyTeamConfig";
import MenuModal from "./components/MenuModal";
import GameSettingsModal from "./components/GameSettingsModal";
import MyTeamStats from "./components/MyTeamStats";
import Toast from "./Toast";



// helper function to convert hex to RGBA
function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// useStates must be place insude the App component
function App() {

  // State declarations for MenuModal
  
  const [isStartup, setIsStartup] = useState(true); // or false if debugging

  const handleResumeGame = () => {
    const storedTeamConfig = localStorage.getItem("snapstats_teamConfig");
    const storedEventLog = localStorage.getItem("snapstats_eventLog");
    const storedQuarter = localStorage.getItem("snapstats_quarter");
  
    if (storedTeamConfig) setTeamConfig(JSON.parse(storedTeamConfig));
    if (storedEventLog) setEventLog(JSON.parse(storedEventLog));
    if (storedQuarter) setQuarter(parseInt(storedQuarter, 10));
  
    setShowMenu(false);
    setIsStartup(false);
  };
  

  const handleQuickStart = () => {
    console.log("Quick start: reset game with default settings");
  
    const defaultTeamConfig = {
      home: {
        name: "Home",
        color: "#18bd0d", // green
        players: Array.from({ length: 12 }, (_, i) => i + 4)
      },
      away: {
        name: "Away",
        color: "#dc3545", // red
        players: Array.from({ length: 12 }, (_, i) => i + 4)
      }
    };
  
    setTeamConfig(defaultTeamConfig);
    setQuarter(1);
    setEventLog([]);
  
    localStorage.setItem("snapstats_teamConfig", JSON.stringify(defaultTeamConfig));
    localStorage.setItem("snapstats_eventLog", JSON.stringify([]));
  
    setShowMenu(false);
    setIsStartup(false);
  };
  

  const [showGameSettings, setShowGameSettings] = useState(false);

  // Add File Input Logic for Importing Games
  const fileInputRef = useRef();
  
  const handleImportGame = () => {
    console.log("Import Game clicked");
    fileInputRef.current?.click(); // Triggers hidden input
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
    
        if (!imported || !imported.teamConfig || !imported.eventLog || !Array.isArray(imported.eventLog)) {
          alert("Invalid game file format.");
          return;
        }
    
        setTeamConfig(imported.teamConfig);
        setEventLog(imported.eventLog);
    
        // Set quarter from file or infer from latest event
        const latestQuarter = imported.quarter ||
          imported.eventLog.reduce((max, ev) => Math.max(max, ev.quarter || 1), 1);
        setQuarter(latestQuarter);
    
        setShowMenu(false); // optionally close menu
        console.log("Game imported successfully");
      } catch (err) {
        console.error("Error parsing game file:", err);
        alert("Failed to load game file.");
      }
    };
    
    reader.readAsText(file);
  };
  
  
  


  
  // ✅ Teams Configuration section in burger menu
  const [teamConfig, setTeamConfig] = useState(() => {
    const saved = localStorage.getItem("snapstats_teamConfig");
    return saved
      ? JSON.parse(saved)
      : {
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
        };

  });

  // showMenu and showMyTeamConfig boolean
  const [showMenu, setShowMenu] = useState(true);
  const [showMyTeamConfig, setShowMyTeamConfig] = useState(false);

  
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [quarter, setQuarter] = useState(() => {
    const saved = localStorage.getItem("snapstats_quarter");
    return saved ? parseInt(saved, 10) : 1;
  });
  useEffect(() => {
    localStorage.setItem("snapstats_quarter", quarter);
  }, [quarter]);
  
  

  //Define default state for event log toggle
  const [showEventLog, setShowEventLog] = useState(() => {
  	  const saved = localStorage.getItem("snapstats_showLog");
  	  return saved === null ? true : saved === "true";
  	});

  // Helper Function for Event Log toggle
  const toggleEventLog = () => {
  		  setShowEventLog(prev => {
  		    const next = !prev;
  		    localStorage.setItem("snapstats_showLog", next);
  		    return next;
  		  });
  		};
  				
  

  // Define state for configPanel visibility
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  

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
    setToastMsg("✅ Last action undone");
  };

  // Function to Export Game Data as json file
  const exportGameData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      teamConfig,
      eventLog,
    };
  
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snapstats_game_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg("📤 Game exported");
  };
  

  // Shot Result Modal
  const [showModal, setShowModal] = useState(false);
  const [pendingZone, setPendingZone] = useState(null);
  
  // Toast functionality
  const [toastMsg, setToastMsg] = useState("");
  
  

  //Define stat logger function
  const logStatEvent = ({ zoneId = null, made = null, statOverride = null  }) => {
    if (!selectedPlayer || !(statOverride || selectedStat)) return;
  
    const newEvent = {
      type: "STAT",
      playerId: selectedPlayer.playerId,
      team: selectedPlayer.team,
      teamName: teamConfig[selectedPlayer.team].name, // team name as inserted in config panel
      statType: statOverride || selectedStat,
      zoneId,
      made,
      timestamp: Date.now(),
      quarter, // use dynamic quarter state
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

	 // Introducing shotcharts
	 const [showMyTeamStats, setShowMyTeamStats] = useState(false);
	 const [myTeam, setMyTeam] = useState(() => {
	   const stored = localStorage.getItem("snapstats.myTeam");
	   return stored ? JSON.parse(stored) : null;
	 });
  
  
  //Handle Court Taps for Shot Stats
  const handleZoneClick = (zoneId) => {
    if (selectedPlayer) {
      setPendingZone(zoneId);
      setShowModal(true);
    }
   };
    

  

  // ✅ Local storage hydration — must be inside App()
  useEffect(() => {
    const saved = localStorage.getItem("snapstats_eventLog");
    if (saved) {
      setEventLog(JSON.parse(saved));
    }
  }, []);

  // useEffect for teamConfig persistence
  useEffect(() => {
    localStorage.setItem("snapstats_teamConfig", JSON.stringify(teamConfig));
  }, [teamConfig]);

  //Add File Input Logic
  
  


  

return (
    <div className="App" style={{ padding: "1rem", maxWidth:"100vw", overflowX:"hidden", margin: "0 auto" }}>

	{/* Temp for testing MyTeamConfig  
	<div>
	      <MyTeamConfig />
	  </div>  
	*/}

	{/* Render logic for showMenu and showMyTeamConfig  */}
	{showMenu && (
	  <MenuModal
	    isStartup={isStartup}
	    resumeGameExists={!!localStorage.getItem("snapstats_eventLog")}
	    onResumeGame={handleResumeGame}
	    onQuickStart={handleQuickStart}
	    onStartNewGame={() => { setShowGameSettings(true); setShowMenu(false); }}
	    onOpenMyTeam={() => { setShowMyTeamConfig(true); setShowMenu(false); }}
	    onOpenGameSettings={() => { setShowGameSettings(true); setShowMenu(false); }}
	    onImportGame={handleImportGame}
	    onClose={() => setShowMenu(false)}
	  />
	)}
	
	{showMyTeamConfig && (
	  <MyTeamConfig onClose={() => {
	    setShowMyTeamConfig(false);
	    setShowMenu(true);
	  }} />
	)}
	
	
	
	    
    {/* Game Ribbon & Burger Menu Sections */}
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
	          // Filter out PFs
	          setEventLog((prevLog) => {
	            const newLog = prevLog.filter((e) => e.statType !== "PF");
	            localStorage.setItem("snapstats_eventLog", JSON.stringify(newLog));
	            return newLog;
	          });
	        }
	        return next;
	      });
	    }}
	    onToggleConfig={() => setShowGameSettings(true)}
	    homeColor={teamConfig.home.color}
	    awayColor={teamConfig.away.color}
	    
	    
	  />
	  
	  {/* configPanel with click-outside handler */}
	  {showConfigPanel && (
	    <div
	      onClick={(e) => {
	        if (e.target.id === "config-backdrop") {
	          setShowConfigPanel(false);
	        }
	      }}
	      onKeyDown={(e) => {
	        if (e.key === "Escape") {
	          setShowConfigPanel(false);
	        }
	      }}
	      tabIndex={-1}
	      id="config-backdrop"
	      style={{
	        position: "fixed",
	        top: 0,
	        left: 0,
	        width: "100vw",
	        height: "100vh",
	        background: "rgba(0,0,0,0.2)",
	        zIndex: 1000,
	      }}
	    >
	      <TeamConfigPanel
	        teamConfig={teamConfig}
	        setTeamConfig={setTeamConfig}
	      />
	    </div>
	  )}
	  
	  </div>


	  

	  <div className="court-wrapper" style={{ 
	  									width: "100vw",  
	  									maxWidth:"100%", 
	  									height: "auto", 
	  									position:"relative", 
	  									overflow: "hidden",
	  									top: "0px"  }}>

      <InteractiveCourt onZoneClick={handleZoneClick} />
      </div>

      {/* Stat Selector Grid */}	
      <div
        style={{
          
          justifyContent: "space-between",
          marginTop: "0.5rem",
          width: "100%"
        }}
      >
      <StatTypeSelector
              selectedStat={selectedStat}
              onSelect={(statType) => {
                setSelectedStat(statType);
            
                if (statType === "FT" && selectedPlayer) {
                  setPendingZone(null);
                  setSelectedStat("FT");
                  setShowModal(true);
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
      
  
	  {/* Home + Away PlayerGrids */}	
	  <div
	    style={{
	      display: "flex",
	      justifyContent: "space-between",
	      marginTop: "1rem",
	      width: "100%"
	    }}
	  >
	  
	  <div style={{ width: "50%" }}>
      <PlayerGrid
        team="home"
        config={teamConfig.home}
        selectedPlayer={selectedPlayer}
        onSelect={setSelectedPlayer}
        backgroundTint={hexToRGBA(teamConfig.home.color, 0.18)} // changes dynamically with color picked in config panel
        onEdit={(newPlayers) =>
          setTeamConfig((prev) => ({
            ...prev,
            home: { ...prev.home, players: newPlayers }
          }))
        }
      />
      </div>

      <div style={{ width: "50%" }}>
      <PlayerGrid
        team="away"
        config={teamConfig.away}
        selectedPlayer={selectedPlayer}
        onSelect={setSelectedPlayer}
        backgroundTint={hexToRGBA(teamConfig.away.color, 0.18)} // changes dynamically with color picked in config panel
        onEdit={(newPlayers) =>
          setTeamConfig((prev) => ({
            ...prev,
            away: { ...prev.away, players: newPlayers }
          }))
        }
      />
      </div>
  

      </div>

      {/* Stat Result Modal */}
      {showModal && (
        <ShotResultModal
          onSelect={(made) => {
            const shotType =
              selectedStat === "FT" ? "FT" :
              pendingZone?.includes("3") ? "3PT" : "2PT";
        
            logStatEvent({
              zoneId: pendingZone, // null for FT
              made,
              statOverride: shotType
            });
        
            setShowModal(false);
            setPendingZone(null);
          }}
          onCancel={() => {
              setShowModal(false);
              setPendingZone(null);
              setSelectedStat(null); // ⬅️ this clears FT lock
            }}
        />
        
      )}

      {/* Buttons data export, undo action, reseting game and hide/show event log */}
	  <div style= {{
	  	display: "flex",
	  	justifyContent: "space-between",
	  	width: "100%",
	  	marginTop: "1rem", // optional spacing
	  	gap: "0.5rem", //option for minor breathing room if needed
	  }}>
      <button
        onClick={exportGameData}
        style={{
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          
        }}
      >
        Export Game
      </button>
           
      <button
        onClick={() => setShowMyTeamStats(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        📊 View MyTeam Stats
      </button>
      

      <button
        onClick={handleUndo}
        style={{
          
          padding: "0.5rem 1rem",
          backgroundColor: "#6c757d",
          color: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Undo Last
      </button>

	{/* ShowMyTeamStats helper */}
	{showMyTeamStats && myTeam && (
	  <ShotChart
	    eventLog={eventLog}
	    myTeam={myTeam}
	    onClose={() => setShowMyTeamStats(false)}
	  />
	)}
	
	{/* Main UI: Game Ribbon + Court + Player Grid */}
	<div className="GameRibbon">...</div>
	
      
      {/* Adding Toast Component to the Render Tree */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
      
  	</div>

  	
      {/* 🧪 Event Log */}
	<button
	  onClick={toggleEventLog}
	  style={{
	    marginTop: "1rem",
	    marginBottom: "0.25rem",
	    padding: "4px 8px",
	    fontSize: "14px",
	    backgroundColor: "#eee",
	    borderRadius: "6px",
	    cursor: "pointer"
	  }}
	>
	  {showEventLog ? "Hide Event Log" : "Show Event Log"}
	</button>
	 
 		     
     {showEventLog && (
      <div style={{ marginTop: "1rem" }}>
        <ul>
          {[...eventLog].reverse().map((event, index) => (
            <li key={index}>
              <span
                  style={{
                    color: event.team === "home" ? teamConfig.home.color : teamConfig.away.color,
                    fontWeight: "bold",
                  }}
                >
                 #{event.playerId}
              </span>{" "}
              | {event.statType}{" "}
              {event.zoneId ? `@ ${event.zoneId}` : ""}{" "}
              {event.made !== null ? (event.made ? "✅" : "❌") : ""}
            </li>
          ))}
        </ul>
      </div>
     )}

      
     {/* Hidden File Input   */}
     <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {/* Render of the GameSettingsModal  */}
      {showGameSettings && (
        <GameSettingsModal
          onClose={() => setShowGameSettings(false)}
          onSave={(config) => {
            setTeamConfig(config);
            setEventLog([]);
            setQuarter(1);
            localStorage.setItem("snapstats_teamConfig", JSON.stringify(config));
            localStorage.setItem("snapstats_eventLog", JSON.stringify([]));
            localStorage.setItem("snapstats_quarter", 1);
          }}
        />
      )}
      
      
    </div>
  );
  
  
}

export default App;
