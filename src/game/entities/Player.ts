import Phaser from "phaser";
import BaseEntity from "./BaseEntity";

export default class Player extends BaseEntity {
  private speed = 200;
  private rotationSpeed = 0.05;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, scale?: number) {
    super(scene, x, y, texture, scale);

    // Physics setup
    this.setDamping(true);
    this.setDrag(100);
    this.setMaxVelocity(300);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.left?.isDown) this.rotation -= this.rotationSpeed;
    if (cursors.right?.isDown) this.rotation += this.rotationSpeed;
    if (cursors.up?.isDown)
      this.scene.physics.velocityFromRotation(this.rotation, this.speed, this.body.velocity);
    if (cursors.down?.isDown)
      this.scene.physics.velocityFromRotation(this.rotation, -this.speed / 2, this.body.velocity);
  }
}
