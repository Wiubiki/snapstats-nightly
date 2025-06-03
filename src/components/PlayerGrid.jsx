import React from "react";
import "./PlayerGrid.css"; // optional, or inline styles

const PlayerGrid = ({ team, config, selectedPlayer, onSelect, onEdit, backgroundTint }) => {
  const { players, color } = config;

  return (
    <div
      className="player-grid"
      style={{
        backgroundColor: backgroundTint,
        padding: "0.5rem",
        borderRadius: "6px"
      }}
    >
      {/* Comment out team headings <h4 style={{ color }}>{config.name || team}</h4> */}
      <div className="player-grid-buttons">
        {players.map((number, index) => {
          const isSelected =
            selectedPlayer &&
            selectedPlayer.playerId === number &&
            selectedPlayer.team === team;
        
          return (
            <div key={index} className="player-edit-wrapper">
              <input
                type="number"
                value={number}
                min="0"
                max="99"
                onChange={(e) => {
                  const updated = [...players];
                  updated[index] = parseInt(e.target.value, 10) || 0;
                  onEdit(updated); // new prop we'll add
                }}
                className="jersey-input"
              />
              <button
                className={`player-btn ${isSelected ? "selected" : ""}`}
                style={{
                  borderColor: color,
                  backgroundColor: isSelected ? color : "white",
                  color: isSelected ? "white" : color,
                }}
                onClick={() => onSelect({ team, playerId: number })}
              >
                {number}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerGrid;
