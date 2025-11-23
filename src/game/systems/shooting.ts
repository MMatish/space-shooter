// systems/shooting.ts
import Phaser from "phaser";
import Bullet from "../entities/Bullet";

/**
 * Fire a bullet from a given group.
 * Ownership is implicit: whoever owns the group.
 */
export function shoot(
  bullets: Phaser.Physics.Arcade.Group,
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  speed?: number
) {
  const bullet = bullets.get() as Bullet;
  if (!bullet) return;

  const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);

  if (speed !== undefined) bullet.speed = speed;

  bullet.fire(x, y, angle);
}
