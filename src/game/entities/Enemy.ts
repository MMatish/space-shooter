import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  private scaleFactor: number = 1 / 1.5; // scale down to match other entities

  constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
    super(scene, x, y, "bullet", 0); // start with frame 0

    this.speed = 500;

    // --- Add sprite to scene & physics ---
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // --- Scale & origin ---
    this.setScale(this.scaleFactor);
    this.setOrigin(0.5, 0.5);

    // --- Adjust physics body to match scaled sprite ---
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width * this.scaleFactor, this.height * this.scaleFactor);
    body.setOffset(0, 0);

    this.setActive(false);
    this.setVisible(false);

    // --- Start looping animation ---
    if (scene.anims.exists("bulletLoop")) {
      this.play("bulletLoop", true);
    }
  }

  fire(x: number, y: number, rotation: number) {
    this.setPosition(x, y);
    this.setRotation(rotation);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.stop();

    // --- Velocity from rotation ---
    this.scene.physics.velocityFromRotation(rotation, this.speed, body.velocity);

    this.setActive(true);
    this.setVisible(true);

    // --- Play animation if not already ---
    if (!this.anims.isPlaying && this.scene.anims.exists("bulletLoop")) {
      this.play("bulletLoop", true);
    }
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    const world = this.scene.physics.world.bounds;
    const left = body.x;
    const right = body.x + body.width;
    const top = body.y;
    const bottom = body.y + body.height;

    // --- Deactivate when fully outside world bounds ---
    if (right < world.left || left > world.right || bottom < world.top || top > world.bottom) {
      this.setActive(false);
      this.setVisible(false);
      body.stop();
    }
  }
}
