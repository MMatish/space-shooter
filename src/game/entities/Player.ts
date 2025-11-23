import Phaser from "phaser";
import BaseEntity from "./BaseEntity";

export default class Player extends BaseEntity {
  private thrust = 200; // input force per second
  private maxSpeed = 300; // clamp
  private friction = 300; // drag when moving along input

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    scale?: number
  ) {
    super(scene, x, y, texture, scale);

    this.setDamping(false); // we'll handle "friction" manually
    this.setDrag(0);
    this.setMaxVelocity(this.maxSpeed);
    this.setOrigin(0.5, 0.5);
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    pointer: Phaser.Input.Pointer
  ) {
    if (!this.active) return; // <-- early exit if dead
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // <-- extra guard

    // Rotate to face mouse
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );
    this.setRotation(angle);

    // Thrust / acceleration vector
    let ax = 0;
    let ay = 0;
    if (cursors.up?.isDown) {
      ax = Math.cos(this.rotation) * this.thrust;
      ay = Math.sin(this.rotation) * this.thrust;
    } else if (cursors.down?.isDown) {
      ax = -Math.cos(this.rotation) * (this.thrust * 0.5);
      ay = -Math.sin(this.rotation) * (this.thrust * 0.5);
    }

    // Apply or reset acceleration
    if (ax !== 0 || ay !== 0) {
      body.setAcceleration(ax, ay);
    } else {
      body.setAcceleration(0, 0);
    }

    // Clamp max speed
    if (body.velocity.length() > this.maxSpeed) {
      body.velocity.scale(this.maxSpeed / body.velocity.length());
    }
  }
}
