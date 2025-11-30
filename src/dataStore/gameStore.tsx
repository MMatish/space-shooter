import { create } from "zustand";

interface GameState {
  playerHP: number;
  setPlayerHP: (hp: number) => void;

  selectedMap: string | null;
  setSelectedMap: (map: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerHP: 100,
  setPlayerHP: (hp) => set({ playerHP: hp }),

  selectedMap: null,
  setSelectedMap: (map) => set({ selectedMap: map }),
}));
