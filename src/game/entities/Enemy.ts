// entities/Enemy.ts
import BaseEntity from "./BaseEntity";

export default class Enemy extends BaseEntity {
  private speed = 100;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "enemy"
  ) {
    super(scene, x, y, texture);
    this.setScale(1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
  }

  update() {
    if (!this.active) return; // <--- skip if destroyed or inactive
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // <--- extra safety

    // Simple AI: move randomly
    if (Phaser.Math.Between(0, 100) < 2) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      body.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed
      );
    }
  }
}
