import BaseEntity from "./BaseEntity";

export default class Enemy extends BaseEntity {
  private speed = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, scale?: number) {
    super(scene, x, y, texture, scale);
    this.setCollideWorldBounds(true);
  }

  // Simple left-right patrol
  patrol(leftBound = 100, rightBound = 300) {
    if (this.x <= leftBound) this.setVelocityX(this.speed);
    else if (this.x >= rightBound) this.setVelocityX(-this.speed);
  }

  update() {
    this.patrol();
  }
}
