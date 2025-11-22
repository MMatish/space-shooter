import BaseEntity from "./BaseEntity";

export default class Explosion extends BaseEntity {
  constructor(scene: Phaser.Scene, x: number, y: number, scale?: number) {
    super(scene, x, y, "explosion", scale);

    // Play explosion animation
    this.play("explode");

    // Destroy after animation completes
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.destroy());
  }
}
