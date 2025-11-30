import { useNavigate } from "react-router-dom";
import { useGameStore } from "../dataStore/gameStore";

const maps = [
  { id: "map", label: "Nebula Outpost" },
  { id: "map2", label: "Asteroid Belt" }, // placeholder for now
  { id: "map3", label: "Omega Station" }  // placeholder for now
];

export default function MapSelectPage() {
  const navigate = useNavigate();
  const setSelectedMap = useGameStore((s) => s.setSelectedMap);

  const chooseMap = (id: string) => {
    setSelectedMap(id);
    navigate("/game");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-10">Select Your Map</h1>

      <div className="flex flex-col gap-6">
        {maps.map((m) => (
          <button
            key={m.id}
            onClick={() => chooseMap(m.id)}
            className="px-10 py-4 bg-blue-600 rounded-xl text-xl font-semibold
                       hover:bg-blue-500 hover:scale-105 transition-all shadow-xl"
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
