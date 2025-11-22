import Phaser from "phaser";
import Bullet from "../entities/Bullet";

export function createBulletGroup(scene: Phaser.Scene) {
  const bullets = scene.physics.add.group({
    classType: Bullet,
    maxSize: 20,
    runChildUpdate: true,
  });

  return bullets;
}
