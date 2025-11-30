import { useGameStore } from "../dataStore/gameStore";

const GameUi = () => {
  const hp = useGameStore((state) => state.playerHP);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        padding: "12px 16px",
        background: "rgba(0, 0, 0, 0.7)",
        borderRadius: "12px",
        color: "#ff4d4d", // bright red for HP
        fontSize: "24px",
        fontWeight: "bold",
        pointerEvents: "none",
        textShadow: "0 0 12px black, 0 0 8px #ff4d4d", // glowing effect
        border: "2px solid #ff4d4d", // glowing border
      }}
    >
      ❤️ HP: {hp}
    </div>
  );
};

export default GameUi;
