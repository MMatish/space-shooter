// systems/mapsConfig.ts
import { ENEMY_TYPES } from "./enemyTypes";

export type EnemyTypeKey = keyof typeof ENEMY_TYPES;

export type SpawnPointConfig = {
  id: string; // spawn point name from Tiled
  enemyKey: EnemyTypeKey; // ***CHANGED to use the key name string***
  delay?: number; // optional delay before spawning
};

export type WaveConfig = {
  spawns: SpawnPointConfig[];
};

export type MapConfig = {
  key: string;
  waves: WaveConfig[];
};

export const MAPS: MapConfig[] = [
  {
    key: "map",
    waves: [
      // --- Wave 1: Easy start ---
      {
        spawns: [
          { id: "enemy_spawn_1", enemyKey: "normal" },
          { id: "enemy_spawn_2", enemyKey: "normal" },
        ],
      },

      // --- Wave 2: Slightly harder ---
      {
        spawns: [
          { id: "enemy_spawn_1", enemyKey: "fast", delay: 200 },
          { id: "enemy_spawn_2", enemyKey: "normal" },
          { id: "enemy_spawn_3", enemyKey: "fast", delay: 400 },
        ],
      },

      // --- Wave 3: Mix of normal and tank ---
      {
        spawns: [
          { id: "enemy_spawn_1", enemyKey: "tank" },
          { id: "enemy_spawn_2", enemyKey: "normal" },
          { id: "enemy_spawn_3", enemyKey: "fast" },
          { id: "enemy_spawn_1", enemyKey: "fast", delay: 500 },
        ],
      },

      // --- Wave 4: More fast enemies, tank support ---
      {
        spawns: [
          { id: "enemy_spawn_1", enemyKey: "fast" },
          { id: "enemy_spawn_2", enemyKey: "fast", delay: 150 },
          { id: "enemy_spawn_3", enemyKey: "tank" },
          { id: "enemy_spawn_2", enemyKey: "normal", delay: 300 },
          { id: "enemy_spawn_1", enemyKey: "fast", delay: 500 },
        ],
      },

      // --- Wave 5: Boss-ish wave, all types ---
      {
        spawns: [
          { id: "enemy_spawn_1", enemyKey: "tank" },
          { id: "enemy_spawn_2", enemyKey: "tank", delay: 200 },
          { id: "enemy_spawn_3", enemyKey: "fast" },
          { id: "enemy_spawn_1", enemyKey: "fast", delay: 400 },
          { id: "enemy_spawn_2", enemyKey: "normal", delay: 600 },
          { id: "enemy_spawn_3", enemyKey: "normal", delay: 800 },
        ],
      },
      // --- Wave 6: Boss ---
      {
        spawns: [
            {
                id: "enemy_spawn_1", enemyKey: "boss"
            },
            { id: "enemy_spawn_2", enemyKey: "normal" },
            { id: "enemy_spawn_2", enemyKey: "normal", delay: 10000 },
            { id: "enemy_spawn_2", enemyKey: "normal", delay: 20000 },
            { id: "enemy_spawn_2", enemyKey: "normal", delay: 30000 },
            { id: "enemy_spawn_2", enemyKey: "normal", delay: 40000 },
        ]
      }
    ],
  },
  {
    key: "map2",
    waves: [
      {
        spawns: [
          { id: "spawn_a", enemyKey: "normal" },
          { id: "spawn_b", enemyKey: "fast" },
        ],
      },
    ],
  },
];
