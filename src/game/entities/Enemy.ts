import Phaser from "phaser";
import ActorEntity, { type ActorStats } from "./ActorEntity";
import Pathfinder from "../systems/pathfinder";
import { shoot } from "../systems/shooting";

export type EnemyConfig = ActorStats & {
  texture?: string;   // optional custom sprite texture
  tileSize?: number;  // size of a single tile in the pathfinding grid
};

export default class Enemy extends ActorEntity {
  private pathfinder: Pathfinder;
  private tileSize: number;

  private speed: number;               // max movement speed
  private acceleration: number = 300;  // how fast it accelerates

  private path: { x: number; y: number }[] = []; // computed path to player
  private pathIndex = 0;                        // current step along path
  private pathUpdateInterval = 100;            // ms between path recalculations
  private lastPathTime = 0;                     // timestamp of last path update
  private lookahead = 2;                        // how many tiles ahead to aim for

  public lastShotTime = 0;                      // timestamp for shooting cooldown

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pathfinder: Pathfinder,
    config: EnemyConfig = {}
  ) {
    const texture = config.texture ?? "enemy"; // default enemy texture

    super(scene, x, y, texture, config);

    this.pathfinder = pathfinder;
    this.tileSize = config.tileSize ?? 32;     // fallback tile size

    this.speed = config.moveSpeed ?? 150;      // movement speed for physics

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);          // prevent leaving world bounds
    body.setMaxVelocity(this.speed);           // cap velocity
    this.setDamping(false);                    // disable built-in damping
  }

  /**
   * Compute a path from current position to player position
   */
  private async followPlayer(playerX: number, playerY: number) {
    const startX = Math.floor(this.x / this.tileSize);
    const startY = Math.floor(this.y / this.tileSize);

    const endX = Math.floor(playerX / this.tileSize);
    const endY = Math.floor(playerY / this.tileSize);

    const path = await this.pathfinder.findPath(startX, startY, endX, endY);

    if (path && path.length > 0) {
      this.path = path;
      this.pathIndex = 0;
    }
  }

  /**
   * Main update loop called each frame
   * Handles movement along path and shooting at player
   */
  update(
    time: number,
    playerX: number,
    playerY: number,
    enemyBullets?: Phaser.Physics.Arcade.Group
  ) {
    if (this.isDead || !this.active) return; // skip updates if dead or inactive

    const body = this.body as Phaser.Physics.Arcade.Body;

    // --- Pathfinding update ---
    if (time - this.lastPathTime > this.pathUpdateInterval) {
      this.lastPathTime = time;
      this.followPlayer(playerX, playerY);
    }

    if (!this.path || this.pathIndex >= this.path.length) {
      body.setAcceleration(0, 0); // stop moving if path finished
    } else {
      const targetIndex = Math.min(
        this.pathIndex + this.lookahead,
        this.path.length - 1
      );
      const tile = this.path[targetIndex];

      const targetX = tile.x * this.tileSize + this.tileSize / 2;
      const targetY = tile.y * this.tileSize + this.tileSize / 2;

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 4) this.pathIndex++; // move to next tile if close

      const angle = Math.atan2(dy, dx);
      this.setRotation(angle); // rotate towards movement direction

      // Accelerate towards target tile
      body.setAcceleration(
        Math.cos(angle) * this.acceleration,
        Math.sin(angle) * this.acceleration
      );

      // Clamp velocity to max speed
      if (body.velocity.length() > this.speed) {
        body.velocity.scale(this.speed / body.velocity.length());
      }
    }

    // --- Shooting ---
    if (enemyBullets && time > this.lastShotTime) {
      shoot(enemyBullets, this.x, this.y, playerX, playerY);
      this.lastShotTime = time + this.shotCooldown; // update cooldown
    }
  }
}
