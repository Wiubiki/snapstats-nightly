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
  onQuarterChange
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        background: "#ffffffcc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 8px",
        zIndex: 999,
        fontSize: "14px"
      }}
    >
      {/* Home */}
      <div style={{ textAlign: "left", color: "#007b00" }}>
        <div style={{ fontWeight: "bold" }}>{homeScore}</div>
        <FoulBoxes count={homeFouls} />
      </div>

      {/* Quarter + Controls */}
      <div style={{ textAlign: "center", fontWeight: "bold" }}>
        <button onClick={() => onQuarterChange(-1)}>&lt;</button>
        &nbsp;Q{quarter}&nbsp;
        <button onClick={() => onQuarterChange(1)}>&gt;</button>
      </div>

      {/* Away + Menu */}
      <div style={{ textAlign: "right", color: "#cc0000" }}>
        <div style={{ fontWeight: "bold" }}>{awayScore}</div>
        <FoulBoxes count={awayFouls} />
      </div>
    </div>
  );
}
