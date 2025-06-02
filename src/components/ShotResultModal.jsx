import React from "react";

export default function ShotResultModal({ onSelect, onCancel }) {
  return (
	<div
      onClick={onCancel} // tapping overlay cancels
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
    <div
      onClick={(e) => e.stopPropagation()} // prevents modal click from closing
      style={{
        position: "absolute",
        top: "30%", // now vertically centered
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        gap: "24px",
        zIndex: 1000,
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
      }}
    >
    
      <button
        style={{
          width: "70px",
          height: "70px",
          backgroundColor: "green",
          color: "white",
          fontSize: "30px",
          border: "none",
          borderRadius: "8px"
        }}
        onClick={() => onSelect(true)}
      >
        ✔
      </button>
      <button
        style={{
          width: "70px",
          height: "70px",
          backgroundColor: "red",
          color: "white",
          fontSize: "30px",
          border: "none",
          borderRadius: "8px"
        }}
        onClick={() => onSelect(false)}
      >
        ✘
      </button>
    </div>
   </div>
  );
}
