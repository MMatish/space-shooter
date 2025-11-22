import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  private scaleFactor: number = 1 / 1.5;

  constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
    super(scene, x, y, "bullet", 0); // start with frame 0

    this.speed = 500;

    // Add sprite to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Scale & origin
    this.setScale(this.scaleFactor);
    this.setOrigin(0.5, 0.5);

    // Update physics body to match scaled sprite
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width * this.scaleFactor, this.height * this.scaleFactor);
    body.setOffset(0, 0);

    this.setActive(false);
    this.setVisible(false);

    // ---- Start the loop animation ----
    this.play("bulletLoop"); // <- here, after adding to the scene
  }

  fire(x: number, y: number, rotation: number) {
    this.setPosition(x, y);
    this.setRotation(rotation);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.stop();
    this.scene.physics.velocityFromRotation(rotation, this.speed, body.velocity);

    this.setActive(true);
    this.setVisible(true);
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    if (!this.scene.physics.world.bounds.contains(this.x, this.y)) {
      this.setActive(false);
      this.setVisible(false);
      body.stop();
    }
  }
}
