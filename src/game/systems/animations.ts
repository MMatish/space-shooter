import Phaser from "phaser";

export function registerAnimations(scene: Phaser.Scene) {
  // Explosion animation
  if (!scene.anims.exists("explode")) {
    scene.anims.create({
      key: "explode",
      frames: scene.anims.generateFrameNumbers("explosion", { start: 0, end: 6 }),
      frameRate: 15,
      repeat: 0,
    });
  }

  // Bullet loop animation
  if (!scene.anims.exists("bulletLoop")) {
    scene.anims.create({
      key: "bulletLoop",
      frames: scene.anims.generateFrameNumbers("bullet", { start: 0, end: 1 }), // adjust to your frames
      frameRate: 10,
      repeat: -1, // loop forever
    });
  }
}
