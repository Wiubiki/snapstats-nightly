import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500); // Auto-dismiss after 2.5 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#333",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      zIndex: 9999,
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
    }}>
      {message}
    </div>
  );
}
