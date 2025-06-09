import React from "react";

const FoulBoxes = ({ count }) => {
  const boxes = Array.from({ length: 5 }, (_, i) => i < count);
  return (
    <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
      {boxes.map((filled, idx) => (
        <div
          key={idx}
          style={{
            width: "8px",
            height: "5px",
            backgroundColor: filled ? "red" : "transparent",
            border: "1px solid red",
            borderRadius: "1px"
          }}
        />
      ))}
    </div>
    
    
  );
};

export default function GameRibbon({
  homeScore,
  awayScore,
  homeFouls,
  awayFouls,
  quarter,
  onQuarterChange,
  onToggleConfig,
  homeColor,
  awayColor
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: "#ffffff",
        padding: "6px 8px",
        zIndex: 999,
        fontSize: "14px",
        position: "sticky"
      }}
    >
      {/* Left: Home score + fouls */}
      <div style={{ flex: 1, textAlign: "left", color: homeColor }}>
        <div style={{ fontSize: "18px" }}>{homeScore}</div>
        <FoulBoxes count={homeFouls} />
      </div>
    
      {/* Center: Quarter Selector */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2px",
        marginTop: "4px"  // Add vertical spacing if needed
      }}>
        <button
          onClick={() => onQuarterChange(-1)}
          style={{
            padding: "4px ",
            border: "none",
            background: "none",
            fontSize: "20px",
            minWidth: "30px",
            
          }}
          aria-label="Previous quarter"
        >
          ◀
        </button>
      
        <div style={{
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: "#f0f0f0",
          fontWeight: "bold",
          fontSize: "20px",
          minWidth: "48px",
          textAlign: "center"
        }}>
          Q{quarter}
        </div>
      
        <button
          onClick={() => onQuarterChange(1)}
          style={{
            padding: "4px ",
            border: "none",
            background: "none",
            fontSize: "20px",
            minWidth: "30px",
            
          }}
          aria-label="Next quarter"
        >
          ▶
        </button>
      </div>
      
      
    
      {/* Right: Away score + fouls + burger */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem", textAlign: "right", color: awayColor }}>
        <div>
          <div style={{ fontSize: "18px" }}>{awayScore}</div>
          <FoulBoxes count={awayFouls} />
        </div>
        <button
          onClick={onToggleConfig}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0"
          }}
        >
          ☰
        </button>
      </div>
      
    </div>
    
    
  );
}
