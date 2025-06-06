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
        background: "#ffffffcc",
        padding: "6px 8px",
        zIndex: 999,
        fontSize: "14px"
      }}
    >
      {/* Left: Home score + fouls */}
      <div style={{ width: "25%", textAlign: "left", color: homeColor }}>
        <div style={{ fontSize: "18px" }}>{homeScore}</div>
        <FoulBoxes count={homeFouls} />
      </div>
    
      {/* Center: Quarter */}
      <div style={{ width: "50%", textAlign: "center", fontWeight: "bold" }}>
        Q{quarter}
        <div>
          <button onClick={() => onQuarterChange(-1)}>{"<"}</button>
          <button onClick={() => onQuarterChange(1)}>{">"}</button>
        </div>
      </div>
    
      {/* Right: Away score + fouls + burger */}
      <div style={{ width: "25%", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ textAlign: "right", color: awayColor }}>
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
