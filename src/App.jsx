import React from "react";
import InteractiveCourt from "./components/InteractiveCourt";

function App() {
  const handleZoneClick = (zoneId) => {
    console.log("You clicked zone:", zoneId);
  };

  return (
    <div className="App" style={{ padding: "1rem" }}>
      <h2>SnapStats Court</h2>
      <InteractiveCourt onZoneClick={handleZoneClick} />
    </div>
  );
}

export default App;
