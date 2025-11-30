import React from "react";

interface ErrorOverlayProps {
  message: string;
  onBack: () => void;
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ message, onBack }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        textAlign: "center",
        padding: 20,
        animation: "fadeIn 0.4s ease-out",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          padding: "30px 20px",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          transform: "scale(0.8)",
          animation: "popIn 0.4s forwards",
        }}
      >
        <h2 style={{ marginBottom: 15 }}>🚨 Failed to load the map</h2>
        <p style={{ marginBottom: 25, lineHeight: 1.5 }}>{message}</p>
        <button
          onClick={onBack}
          style={{
            padding: "12px 28px",
            fontSize: 16,
            fontWeight: 600,
            color: "#333",
            background: "linear-gradient(90deg, #ffd966, #ffcc00)",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Back to Map Selection
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ErrorOverlay;
