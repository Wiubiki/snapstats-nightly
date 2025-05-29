import React from "react";
import "./PlayerGrid.css"; // optional, or inline styles

const PlayerGrid = ({ team, config, selectedPlayer, onSelect }) => {
  const { players, color } = config;

  return (
    <div className="player-grid">
      <h4 style={{ color }}>{config.name || team}</h4>
      <div className="player-grid-buttons">
        {players.map((number) => {
          const isSelected =
            selectedPlayer &&
            selectedPlayer.playerId === number &&
            selectedPlayer.team === team;

          return (
            <button
              key={number}
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
          );
        })}
      </div>
    </div>
  );
};

export default PlayerGrid;
