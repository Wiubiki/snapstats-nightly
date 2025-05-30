import React from "react";
import "./StatTypeSelector.css"; // optional for styling

const STAT_TYPES = [
  { type: "FT", label: "FT" },
  { type: "ORB", label: "ORB" },
  { type: "DRB", label: "DRB" },
  { type: "AST", label: "AST" },
  { type: "STL", label: "STL" },
  { type: "TO", label: "TO" },
  { type: "BLK", label: "BLK" },
  { type: "PF", label: "PF" }
];


const StatTypeSelector = ({ selectedStat, onSelect }) => {
  return (
    <div className="stat-grid">
      {STAT_TYPES.map(({ type, label }) => (
        <button
          key={type}
          className={`stat-btn ${selectedStat === type ? "selected" : ""}`}
          onClick={() => onSelect(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default StatTypeSelector;
