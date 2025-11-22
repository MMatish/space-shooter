// systems/collisions.ts
import Phaser from "phaser";
import Bullet from "../entities/Bullet";
import Enemy from "../entities/Enemy";
import Explosion from "../entities/Explosion";

export function setupCollisions(
  scene: Phaser.Scene,
  bullets: Phaser.Physics.Arcade.Group,
  enemies: Phaser.Physics.Arcade.Group,
  walls: Phaser.Tilemaps.TilemapLayer
) {
  // --- Bullets collide with walls ---
  scene.physics.add.collider(bullets, walls, (b: Phaser.GameObjects.GameObject) => {
    const bullet = b as Bullet;
    bullet.setActive(false).setVisible(false);
  });

  // --- Bullets hit enemies ---
  scene.physics.add.overlap(
    bullets,
    enemies,
    (b: Phaser.GameObjects.GameObject, e: Phaser.GameObjects.GameObject) => {
      const bullet = b as Bullet;
      const enemy = e as Enemy;

      bullet.setActive(false).setVisible(false);

      if (!enemy.active) return;

      new Explosion(scene, enemy.x, enemy.y);
      enemy.destroy();
    }
  );
}
