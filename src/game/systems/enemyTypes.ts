import type { EnemyConfig } from "../entities/Enemy";

export const ENEMY_TYPES: Record<string, EnemyConfig> = {
  normal: { texture: "enemy", scale: 0.7, maxHealth: 100, moveSpeed: 150, shotCooldown: 600 },
  fast: { texture: "fastEnemy", scale: 0.5, maxHealth: 100, moveSpeed: 250, shotCooldown: 500 },
  tank: { texture: "tankEnemy", scale: 0.9, maxHealth: 300, moveSpeed: 70, shotCooldown: 200 },
  boss: { texture: "tankEnemy", scale: 1, maxHealth: 1000, moveSpeed: 50, shotCooldown: 100 },
};
