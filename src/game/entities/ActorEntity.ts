// entities/ActorEntity.ts
import Phaser from "phaser";
import Bullet from "./Bullet";
import Explosion from "./Explosion";

export default class ActorEntity extends Phaser.Physics.Arcade.Sprite {
  public maxHealth = 100;
  public health = 100;
  public isDead = false;

  // Every actor may have its own bullet group (player / enemy)
  public bullets?: Phaser.Physics.Arcade.Group;

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

    this.setOrigin(0.5);
    this.setScale(scale);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setCollideWorldBounds(true);
      body.setSize(this.width * scale, this.height * scale);
    }

    // Automatically create a bullet group for this actor
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: false,
      maxSize: 2,
    });
  }

  /** Actor takes damage */
  takeDamage(amount: number) {
    if (this.isDead) return;

    this.health -= amount;
    if (this.health <= 0) {
      this.kill();
    }
  }

  /** Mark as dead + stop physics + hide */
  kill() {
    if (this.isDead) return;

    this.isDead = true;

    // --- Explosion on death ---
    new Explosion(this.scene, this.x, this.y);

    this.setActive(false);
    this.setVisible(false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setEnable(false);
      body.setVelocity(0, 0);
      body.setAcceleration(0, 0);
    }
  }

  /** Respawn anywhere you want */
  respawn(x: number, y: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    this.setPosition(x, y);
    this.health = this.maxHealth;
    this.isDead = false;

    this.setActive(true);
    this.setVisible(true);

    if (body) {
      body.setEnable(true);
      body.stop();
    }
  }
}
