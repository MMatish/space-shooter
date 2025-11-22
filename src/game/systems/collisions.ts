import Phaser from "phaser";
import Bullet from "../entities/Bullet";
import Enemy from "../entities/Enemy";
import Explosion from "../entities/Explosion";

export function setupCollisions(
  scene: Phaser.Scene,
  bullets: Phaser.Physics.Arcade.Group,
  enemies: Enemy[],
  walls: Phaser.Tilemaps.TilemapLayer
) {
  // Bullets collide with walls
  scene.physics.add.collider(bullets, walls, (bullet: Bullet) => {
    bullet.setActive(false).setVisible(false);
  });

  // Bullets hit enemies
  scene.physics.add.overlap(bullets, enemies, (bullet: Bullet, enemy: Enemy) => {
    bullet.setActive(false).setVisible(false);

    if (!enemy.active) return;

    new Explosion(scene, enemy.x, enemy.y);

    enemy.destroy();
    const index = enemies.indexOf(enemy);
    if (index !== -1) enemies.splice(index, 1);
  });
}
