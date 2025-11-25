import { create } from "zustand";

interface GameState {
  playerHP: number;
  setPlayerHP: (hp: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerHP: 100,
  setPlayerHP: (hp) => set({ playerHP: hp }),
}));
