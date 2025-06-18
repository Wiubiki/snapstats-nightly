import { useState } from "react";
import InteractiveCourt from "./InteractiveCourt";
import ShotChart from "./ShotChart";


export default function MyTeamStats({ eventLog, myTeam, onClose }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState("ALL");

  const getFilteredShots = () => {
    return eventLog.filter((e) => {
      if (e.statType !== "FG" && e.statType !== "3PT") return false;
      if (selectedPlayerId === "ALL") return true;
      return e.playerId === selectedPlayerId;
    });
  };

  const getPlayerStats = () => {
    const stats = {};
    for (const p of myTeam.players.filter((p) => p.inRoster)) {
      stats[p.id] = {
        jersey: p.jersey,
        name: p.name,
        pts: 0,
        fgMade: 0,
        fgAtt: 0,
        tpMade: 0,
        tpAtt: 0,
        ftMade: 0,
        ftAtt: 0,
        trb: 0,
        drb: 0,
        orb: 0,
        stl: 0,
        blk: 0,
        pf: 0,
        to: 0,
      };
    }

    for (const e of eventLog) {
      const s = stats[e.playerId];
      if (!s) continue;

      switch (e.statType) {
        case "FG":
          s.fgAtt++;
          if (e.result === "Made") {
            s.fgMade++;
            s.pts += 2;
          }
          break;
        case "3PT":
          s.tpAtt++;
          if (e.result === "Made") {
            s.tpMade++;
            s.pts += 3;
          }
          break;
        case "FT":
          s.ftAtt++;
          if (e.result === "Made") {
            s.ftMade++;
            s.pts += 1;
          }
          break;
        case "TRB":
          s.trb++;
          break;
        case "DRB":
          s.drb++;
          break;
        case "ORB":
          s.orb++;
          break;
        case "STL":
          s.stl++;
          break;
        case "BLK":
          s.blk++;
          break;
        case "PF":
          s.pf++;
          break;
        case "TO":
          s.to++;
          break;
      }
    }

    return stats;
  };

  const stats = getPlayerStats();
  const filteredShots = getFilteredShots();

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📊 {myTeam.teamName || "MyTeam"} Stats</h2>
      <button
        onClick={onClose}
        style={{
          marginBottom: "12px",
          padding: "6px 12px",
          border: "none",
          backgroundColor: "#ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⬅️ Back to Game
      </button>

      {/* COURT */}
      <InteractiveCourt shots={filteredShots} />

      {/* DROPDOWN */}
      <div style={{ margin: "1rem 0" }}>
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          style={{ padding: "6px", fontSize: "1rem" }}
        >
          <option value="ALL">All Players</option>
          {myTeam.players
            .filter((p) => p.inRoster)
            .map((p) => (
              <option key={p.id} value={p.id}>
                #{p.jersey} {p.name}
              </option>
            ))}
        </select>
      </div>

      {/* PLAYER STATS TABLE */}
      <div
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          borderTop: "1px solid #ccc",
          paddingTop: "0.5rem",
        }}
      >
        <table style={{ borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              <th style={{ padding: "4px" }}>#</th>
              <th style={{ padding: "4px" }}>Name</th>
              <th style={{ padding: "4px" }}>PTS</th>
              <th style={{ padding: "4px" }}>FG%</th>
              <th style={{ padding: "4px" }}>FGM</th>
              <th style={{ padding: "4px" }}>FGA</th>
              <th style={{ padding: "4px" }}>3P%</th>
              <th style={{ padding: "4px" }}>3PM</th>
              <th style={{ padding: "4px" }}>3PA</th>
              <th style={{ padding: "4px" }}>FT%</th>
              <th style={{ padding: "4px" }}>FTM</th>
              <th style={{ padding: "4px" }}>FTA</th>
              <th style={{ padding: "4px" }}>TRB</th>
              <th style={{ padding: "4px" }}>DRB</th>
              <th style={{ padding: "4px" }}>ORB</th>
              <th style={{ padding: "4px" }}>STL</th>
              <th style={{ padding: "4px" }}>BLK</th>
              <th style={{ padding: "4px" }}>PF</th>
              <th style={{ padding: "4px" }}>TO</th>
            </tr>
          </thead>
          <tbody>
            {myTeam.players
              .filter((p) => p.inRoster)
              .map((p) => {
                const s = stats[p.id];
                const fmt = (made, att) =>
                  att ? Math.round((made / att) * 100) + "%" : "-";
                return (
                  <tr key={p.id}>
                    <td style={{ padding: "4px" }}>{p.jersey}</td>
                    <td style={{ padding: "4px" }}>{p.name}</td>
                    <td style={{ padding: "4px" }}>{s.pts}</td>
                    <td style={{ padding: "4px" }}>{fmt(s.fgMade, s.fgAtt)}</td>
                    <td style={{ padding: "4px" }}>{s.fgMade}</td>
                    <td style={{ padding: "4px" }}>{s.fgAtt}</td>
                    <td style={{ padding: "4px" }}>{fmt(s.tpMade, s.tpAtt)}</td>
                    <td style={{ padding: "4px" }}>{s.tpMade}</td>
                    <td style={{ padding: "4px" }}>{s.tpAtt}</td>
                    <td style={{ padding: "4px" }}>{fmt(s.ftMade, s.ftAtt)}</td>
                    <td style={{ padding: "4px" }}>{s.ftMade}</td>
                    <td style={{ padding: "4px" }}>{s.ftAtt}</td>
                    <td style={{ padding: "4px" }}>{s.trb}</td>
                    <td style={{ padding: "4px" }}>{s.drb}</td>
                    <td style={{ padding: "4px" }}>{s.orb}</td>
                    <td style={{ padding: "4px" }}>{s.stl}</td>
                    <td style={{ padding: "4px" }}>{s.blk}</td>
                    <td style={{ padding: "4px" }}>{s.pf}</td>
                    <td style={{ padding: "4px" }}>{s.to}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
