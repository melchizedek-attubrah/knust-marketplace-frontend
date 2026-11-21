import React from "react";

export interface AlertMessage {
  type: "success" | "error" | "info";
  message: string;
}

interface AlertBannerProps {
  alert: AlertMessage | null;
  onClose: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  const bg =
    alert.type === "success"
      ? "#DEF7EC"
      : alert.type === "error"
      ? "#FDE8E8"
      : "#E1EFFE";
  const border =
    alert.type === "success"
      ? "#31C48D"
      : alert.type === "error"
      ? "#F98080"
      : "#76A9FA";
  const text =
    alert.type === "success"
      ? "#03543F"
      : alert.type === "error"
      ? "#9B1C1C"
      : "#1E429F";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "24px",
        zIndex: 9999,
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: "6px",
        padding: "14px 20px",
        color: text,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "420px",
        animation: "rise 0.3s ease both",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: 600, flex: 1 }}>
        {alert.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: text,
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
};
