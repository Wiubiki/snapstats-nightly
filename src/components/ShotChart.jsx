import React from "react";
import ShotChartSVG from "./ShotChartSVG";
import zonePositions from "../data/zonePositions";

export default function ShotChart({ eventLog, playerFilter = null }) {
  const zoneStats = {};

  eventLog.forEach((event) => {
    if (
      event.team === "home" &&
      (event.statType === "2PT" || event.statType === "3PT") &&
      event.zone
    ) {
      if (playerFilter && event.player !== playerFilter) return;
      const zone = event.zone;
      if (!zoneStats[zone]) {
        zoneStats[zone] = { made: 0, attempted: 0 };
      }
      zoneStats[zone].attempted += 1;
      if (event.made) {
        zoneStats[zone].made += 1;
      }
    }
  });

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
      <ShotChartSVG />
      {Object.entries(zoneStats).map(([zone, stats]) => {
        const pos = zonePositions[zone];
        if (!pos) return null;

        const { made, attempted } = stats;
        const pct = attempted > 0 ? Math.round((made / attempted) * 100) : 0;

        return (
          <div
            key={zone}
            style={{
              position: "absolute",
              top: `${pos.y}%`,
              left: `${pos.x}%`,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "black",
              fontWeight: 600,
              fontSize: "12px",
              pointerEvents: "none",
            }}
          >
            {`${pct}%`}
            <div style={{ fontSize: "10px", fontWeight: 400 }}>{`${made}/${attempted}`}</div>
          </div>
        );
      })}
    </div>
  );
}
