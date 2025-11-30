import { useNavigate } from "react-router-dom";
import { useGameStore } from "../dataStore/gameStore";

const maps = [
  { id: "map", label: "Nebula Outpost" },
  { id: "map2", label: "Asteroid Belt" }, // placeholder
  { id: "map3", label: "Omega Station" }  // placeholder
];

export default function MapSelectPage() {
  const navigate = useNavigate();
  const setSelectedMap = useGameStore((s) => s.setSelectedMap);

  const chooseMap = (id: string) => {
    setSelectedMap(id);
    navigate("/game");
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-4">
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-10 text-white drop-shadow-[0_0_12px_rgba(0,255,255,0.7)] animate-pulse">
          Select The Map
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {maps.map((m) => (
            <div
              key={m.id}
              onClick={() => chooseMap(m.id)}
              className="cursor-pointer px-8 py-6 bg-linear-to-br from-blue-700 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl shadow-2xl hover:scale-105 transition-transform transform"
            >
              <h2 className="text-2xl font-bold mb-2">{m.label}</h2>
              <p className="text-gray-200">Explore this map and test your skills!</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
