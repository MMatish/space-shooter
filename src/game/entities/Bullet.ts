// entities/Bullet.ts
import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed: number = 300; // default speed
  damage: number = 50;
  private scaleFactor: number = 1 / 1.5;

  constructor(scene: Phaser.Scene, x = 0, y = 0) {
    super(scene, x, y, "bullet");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(this.scaleFactor);
    this.setOrigin(0.5, 0.5);
    (this.body as Phaser.Physics.Arcade.Body)?.setSize(10, 10);

    this.setActive(false);
    this.setVisible(false);

    this.scene.sound.play("shot", {volume: 0.02})
  }

  fire(x: number, y: number, rotation: number) {
    this.setPosition(x, y);
    this.setRotation(rotation);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.stop();
    this.scene.physics.velocityFromRotation(rotation, this.speed, body.velocity);

    this.setActive(true);
    this.setVisible(true);

    if (!this.anims.isPlaying) this.play("bulletLoop", true);
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    if (!this.scene.physics.world.bounds.contains(this.x, this.y)) {
      this.scene.sound.play("explosion", {volume: 0.5})
      this.setActive(false);
      this.setVisible(false);
      body.stop();
    }
  }
}
