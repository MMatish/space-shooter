import React from "react";

interface GameMenuProps {
  onContinue: () => void;
  onQuit: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onContinue, onQuit }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-gray-900 bg-opacity-50 border border-gray-700 rounded-xl p-10 flex flex-col items-center text-center shadow-lg"
        style={{ minWidth: 300 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 animate-pulse">⏸ Game Paused</h2>
        <button
          onClick={onContinue}
          className="w-full mb-4 px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Continue
        </button>
        <button
          onClick={onQuit}
          className="w-full px-8 py-3 bg-linear-to-r from-red-500 to-yellow-400 hover:from-yellow-400 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Quit to Map Selection
        </button>
      </div>
    </div>
  );
};

export default GameMenu;
