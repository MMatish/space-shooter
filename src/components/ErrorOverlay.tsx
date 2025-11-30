import React from "react";

interface ErrorOverlayProps {
  message: string;
  onBack: () => void;
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ message, onBack }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-center animate-fadeIn">
      <div className="max-w-md p-8 rounded-xl bg-black/30 border border-white/20 shadow-2xl transform scale-90 animate-popIn">
        <h2 className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_0_12px_rgba(255,255,0,0.8)]">
          🚨 Failed to load the map
        </h2>
        <p className="text-lg mb-6 text-gray-200 leading-relaxed">{message}</p>
        <button
          onClick={onBack}
          className="px-10 py-4 bg-linear-to-r from-yellow-400 to-yellow-300 rounded-full text-xl font-bold text-black shadow-lg hover:scale-105 transition-transform"
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
          .animate-fadeIn { animation: fadeIn 0.4s ease-out; }

          @keyframes popIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-popIn { animation: popIn 0.4s forwards; }
        `}
      </style>
    </div>
  );
};

export default ErrorOverlay;
