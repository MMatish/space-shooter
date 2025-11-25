import Phaser from "phaser";
import ActorEntity from "./ActorEntity";

export default class Player extends ActorEntity {
  private thrust = 200;    // how much acceleration is applied when moving
  private maxSpeed = 300;  // top speed cap

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Pass stats to base ActorEntity
    super(scene, x, y, "player", {
      maxHealth: 500,
      moveSpeed: 300,
      damage: 20,
      shotCooldown: 200,
      scale: 0.6,
    });

    this.setDamping(false);   // disable built-in damping
    this.setDrag(0);          // no drag
    this.setMaxVelocity(this.maxSpeed); // cap velocity
  }

  /**
   * Update loop called each frame
   * Handles rotation towards pointer and movement input
   */
  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    pointer: Phaser.Input.Pointer
  ) {
    if (this.isDead || !this.active) return; // skip updates if dead or inactive

    const body = this.body as Phaser.Physics.Arcade.Body;

    // --- Rotate towards mouse pointer ---
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY
    );
    this.setRotation(angle);

    // --- Movement input ---
    let ax = 0;
    let ay = 0;

    if (cursors.up?.isDown) {
      ax = Math.cos(this.rotation) * this.thrust;
      ay = Math.sin(this.rotation) * this.thrust;
    } else if (cursors.down?.isDown) {
      ax = -Math.cos(this.rotation) * (this.thrust * 0.5); // slower backward
      ay = -Math.sin(this.rotation) * (this.thrust * 0.5);
    }

    // Apply acceleration to physics body
    if (ax !== 0 || ay !== 0) {
      body.setAcceleration(ax, ay);
    } else {
      body.setAcceleration(0, 0); // stop accelerating when no input
    }

    // --- Clamp speed ---
    if (body.velocity.length() > this.maxSpeed) {
      body.velocity.scale(this.maxSpeed / body.velocity.length());
    }
  }
}
