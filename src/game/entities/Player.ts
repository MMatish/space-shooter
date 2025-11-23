// entities/Player.ts
import Phaser from "phaser";
import ActorEntity from "./ActorEntity";

export default class Player extends ActorEntity {
  private thrust = 200;
  private maxSpeed = 300;
  private friction = 300;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    this.setDamping(false);
    this.setDrag(0);
    this.setMaxVelocity(this.maxSpeed);
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    pointer: Phaser.Input.Pointer
  ) {
    if (this.isDead) return;       // <-- cannot move or shoot when dead
    if (!this.active) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // Rotate towards mouse
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );
    this.setRotation(angle);

    // Movement
    let ax = 0;
    let ay = 0;

    if (cursors.up?.isDown) {
      ax = Math.cos(this.rotation) * this.thrust;
      ay = Math.sin(this.rotation) * this.thrust;
    } else if (cursors.down?.isDown) {
      ax = -Math.cos(this.rotation) * (this.thrust * 0.5);
      ay = -Math.sin(this.rotation) * (this.thrust * 0.5);
    }

    // Apply acceleration
    if (ax !== 0 || ay !== 0) {
      body.setAcceleration(ax, ay);
    } else {
      // no input → stop accelerating
      body.setAcceleration(0, 0);
    }

    // Speed clamp
    if (body.velocity.length() > this.maxSpeed) {
      body.velocity.scale(this.maxSpeed / body.velocity.length());
    }
  }
}
