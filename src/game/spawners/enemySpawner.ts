// spawners/enemySpawner.ts
import Phaser from "phaser";
import Enemy from "../entities/Enemy";

export function spawnEnemies(
  scene: Phaser.Scene,
  count: number,
  mapWidth: number,
  mapHeight: number,
  walls: Phaser.Tilemaps.TilemapLayer
): Enemy[] {
  const enemies: Enemy[] = [];

  for (let i = 0; i < count; i++) {
    // Random spawn within map bounds, avoiding walls
    const x = Phaser.Math.Between(50, mapWidth - 50);
    const y = Phaser.Math.Between(50, mapHeight - 50);

    const enemy = new Enemy(scene, x, y, "enemy");
    scene.physics.add.collider(enemy, walls); // collide with walls
    enemies.push(enemy);
  }

  return enemies;
}
