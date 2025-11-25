import Phaser from "phaser";
import ActorEntity from "../entities/ActorEntity";
import Bullet from "../entities/Bullet";
import Explosion from "../entities/Explosion";

// --- Type Assertions ---
interface CustomBullet extends Bullet {
  active: boolean;
}

// -----------------------------
// Unified Collision Handlers
// -----------------------------

const hitActor: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
  object1, // This could be the bullet or the target, depending on group order
  object2
) => {
  // Use explicit casts from the generic types
  const bullet = object1 as CustomBullet;
  const target = object2 as ActorEntity;

  if (
    !bullet.active ||
    !target.active ||
    target.isDead ||
    typeof target.takeDamage !== "function"
  )
    return;

  new Explosion(bullet.scene, target.x, target.y, 0.5);
  target.takeDamage(bullet.damage ?? 50);
  bullet.destroy();
};

const hitWall: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
  object1, // This will be the bullet
  // object2 is the wall tile, we don't need to use it
) => {
  const bullet = object1 as CustomBullet;
  if (!bullet.active) return;

  new Explosion(bullet.scene, bullet.x, bullet.y, 0.3);
  bullet.destroy();
};

const actorTouch: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
  object1, // Attacker
  object2 // Target
) => {
  const player = object1 as ActorEntity;
  const enemy = object2 as ActorEntity;

  if (!player.active || player.isDead || !enemy.active) return;
  if (typeof player.takeDamage !== "function") return;

  player.takeDamage(5);
};

// -----------------------------
// Setup function
// -----------------------------
export const setupCollisions = (
  scene: Phaser.Scene,
  playerGroup: Phaser.Physics.Arcade.Group,
  playerBullets: Phaser.Physics.Arcade.Group,
  enemyBullets: Phaser.Physics.Arcade.Group,
  enemiesGroup: Phaser.Physics.Arcade.Group,
  walls: Phaser.Tilemaps.TilemapLayer
): void => {
  const physics = scene.physics;

  // Player bullets → Enemies
  physics.add.overlap(playerBullets, enemiesGroup, hitActor, undefined, scene);

  // Enemy bullets → Player
  physics.add.overlap(enemyBullets, playerGroup, hitActor, undefined, scene);

  // Player ↔ Enemy collision
  physics.add.collider(playerGroup, enemiesGroup, actorTouch, undefined, scene);

  // Bullets → Walls
  physics.add.collider(playerBullets, walls, hitWall, undefined, scene);
  physics.add.collider(enemyBullets, walls, hitWall, undefined, scene);

  // Actors → Walls
  physics.add.collider(playerGroup, walls);
  physics.add.collider(enemiesGroup, walls);
};