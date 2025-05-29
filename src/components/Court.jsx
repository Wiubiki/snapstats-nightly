import React from "react";
import "./Court.css"; // Optional if you want to style hover/click feedback

const shotZones = [
  { id: "left-corner", label: "Left Corner", x: 10, y: 180 },
  { id: "left-wing", label: "Left Wing", x: 50, y: 100 },
  { id: "top-key", label: "Top of Key", x: 150, y: 60 },
  { id: "right-wing", label: "Right Wing", x: 250, y: 100 },
  { id: "right-corner", label: "Right Corner", x: 290, y: 180 },
  { id: "paint-left", label: "Paint Left", x: 100, y: 140 },
  { id: "paint-right", label: "Paint Right", x: 200, y: 140 },
  { id: "center-paint", label: "Paint Center", x: 150, y: 130 },
  { id: "left-elbow", label: "Left Elbow", x: 110, y: 100 },
  { id: "right-elbow", label: "Right Elbow", x: 190, y: 100 },
  { id: "free-throw", label: "Free Throw", x: 150, y: 90 },
];

const Court = ({ onZoneClick }) => {
  const handleZoneClick = (zoneId) => {
    console.log(`Zone clicked: ${zoneId}`);
    if (onZoneClick) onZoneClick(zoneId);
  };

  return (
    <svg
      viewBox="0 0 300 200"
      width="100%"
      height="auto"
      className="court-svg"
    >
      {/* Half-court background */}
      <rect width="300" height="200" fill="#f4f4f4" stroke="#999" />

      {/* Zones as transparent circles (clickable areas) */}
      {shotZones.map((zone) => (
        <circle
          key={zone.id}
          cx={zone.x}
          cy={zone.y}
          r={15}
          fill="rgba(0, 123, 255, 0.1)"
          stroke="#007bff"
          onClick={() => handleZoneClick(zone.id)}
          className="court-zone"
        >
          <title>{zone.label}</title>
        </circle>
      ))}
    </svg>
  );
};

export default Court;
