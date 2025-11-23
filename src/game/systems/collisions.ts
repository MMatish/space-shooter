// systems/collisions.ts
import Phaser from "phaser";
import Bullet from "../entities/Bullet";
import Explosion from "../entities/Explosion";

/**
 * Setup collisions between a bullet group and a target group,
 * plus optional collision with walls.
 * 
 * @param scene Phaser scene
 * @param bullets Bullet group (playerBullets or enemyBullets)
 * @param targets Target group (enemies, player, etc.)
 * @param walls Optional tilemap layer for bullet-wall collision
 * @param explodeOnHit If true, create explosion when target hit
 */
export function setupCollisions(
  scene: Phaser.Scene,
  bullets: Phaser.Physics.Arcade.Group,
  targets: Phaser.Physics.Arcade.Group | Phaser.GameObjects.Sprite,
  walls?: Phaser.Tilemaps.TilemapLayer,
  explodeOnHit = true
) {
  // --- Bullets collide with walls ---
  if (walls) {
    scene.physics.add.collider(bullets, walls, (b: Phaser.GameObjects.GameObject) => {
      const bullet = b as Bullet;
      destroyBullet(bullet);
    });
  }

  // --- Bullets hit targets ---
  scene.physics.add.overlap(
    bullets,
    targets,
    (b: Phaser.GameObjects.GameObject, t: Phaser.GameObjects.GameObject) => {
      const bullet = b as Bullet;
      destroyBullet(bullet);

      if (!t.active) return;

      if (explodeOnHit) {
        new Explosion(scene, t.x, t.y);
      }

      // Destroy the target if it has a destroy method
      if ("destroy" in t) {
        t.destroy();
      }
    }
  );
}

// Helper function to destroy bullet safely
function destroyBullet(bullet: Bullet) {
  if (!bullet || !bullet.body) return;

  const body = bullet.body as Phaser.Physics.Arcade.Body;
  body.stop();     // stop any movement
  bullet.destroy(); // remove from scene entirely
}
