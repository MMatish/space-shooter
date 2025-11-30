import Phaser from "phaser";
import ActorEntity from "./ActorEntity";
import { useGameStore } from "../../dataStore/gameStore";

export default class Player extends ActorEntity {
  private thrust = 300; // acceleration when moving
  private maxSpeed = 300; // top speed cap

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player", {
      maxHealth: 500,
      moveSpeed: 300,
      damage: 20,
      shotCooldown: 200,
      scale: 0.6,
    });

    // Physics body is already setup in ActorEntity
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setMaxVelocity(this.maxSpeed);
    
    // ADDED: Set a high drag value to make the player slide and eventually stop
    body.setDrag(800, 800); 
  }

  takeDamage(amount: number) {
    if (this.isDead) return;

    this.health -= amount;
    const newHealth = Math.max(this.health, 0);
    useGameStore.getState().setPlayerHP(newHealth);

    if (this.health <= 0) {
      this.kill();
    }
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keys: Record<"w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>,
    pointer: Phaser.Input.Pointer
  ) {
    if (this.isDead || !this.active) return;

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

    if (cursors.up?.isDown || keys.w.isDown) ay -= 1;
    if (cursors.down?.isDown || keys.s.isDown) ay += 1;
    if (cursors.left?.isDown || keys.a.isDown) ax -= 1;
    if (cursors.right?.isDown || keys.d.isDown) ax += 1;

    // Normalize diagonal movement
    const length = Math.hypot(ax, ay);
    if (length > 0) {
      ax = (ax / length) * this.thrust;
      ay = (ay / length) * this.thrust;
      body.setAcceleration(ax, ay);
    } else {
      body.setAcceleration(0, 0);
    }
  }
}