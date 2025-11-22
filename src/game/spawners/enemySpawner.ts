import Phaser from "phaser";
import Enemy from "../entities/Enemy";

export function spawnEnemies(
  scene: Phaser.Scene,
  amount: number,
  mapWidth: number,
  mapHeight: number,
  walls: Phaser.Tilemaps.TilemapLayer
) {
  const enemies: Enemy[] = [];

  for (let i = 0; i < amount; i++) {
    const enemy = new Enemy(
      scene,
      Phaser.Math.Between(100, mapWidth - 100),
      Phaser.Math.Between(100, mapHeight - 100),
      "enemy"
    );

    scene.physics.add.collider(enemy, walls);
    enemies.push(enemy);
  }

  return enemies;
}
