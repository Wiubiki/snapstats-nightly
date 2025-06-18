import React from "react";
import courtSVG from "../assets/snapstatsShotZones.svg";

export default function ShotChartSVG() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <img
        src={courtSVG}
        alt="Court shot chart"
        style={{ width: "100%", display: "block" }}
      />
    </div>
  );
}
