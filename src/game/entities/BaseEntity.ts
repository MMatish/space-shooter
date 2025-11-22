import Phaser from "phaser";

export default class BaseEntity extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    scale: number = 1 / 1.5
  ) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.setScale(scale);

    // Update physics body to match the scaled sprite
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(this.width * scale, this.height * scale);
      body.setOffset(0, 0);
    }
  }
}
