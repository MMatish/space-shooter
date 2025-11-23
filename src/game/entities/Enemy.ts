// entities/Enemy.ts
import Phaser from "phaser";
import BaseEntity from "./BaseEntity";
import Pathfinder from "../systems/pathfinder";

export default class Enemy extends BaseEntity {
  private speed = 150;           // max speed
  private acceleration = 300;    // like player thrust
  private path: { x: number; y: number }[] = [];
  private pathIndex = 0;
  private pathfinder: Pathfinder;
  private tileSize: number;
  private lastPathTime = 0;
  private pathUpdateInterval = 100; // ms
  private lookahead = 2;         // number of tiles to skip ahead

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pathfinder: Pathfinder,
    tileSize = 32
  ) {
    super(scene, x, y, "enemy");
    this.pathfinder = pathfinder;
    this.tileSize = tileSize;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(this.speed);
    body.setDrag(0);
    this.setDamping(false);
  }

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

  update(time: number, playerX: number, playerY: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // --- Recompute path periodically ---
    if (time - this.lastPathTime > this.pathUpdateInterval) {
      this.lastPathTime = time;
      this.followPlayer(playerX, playerY);
    }

    if (!this.path || this.pathIndex >= this.path.length) {
      body.setAcceleration(0, 0);
      return;
    }

    // --- Target farther along path (lookahead) ---
    const targetIndex = Math.min(this.pathIndex + this.lookahead, this.path.length - 1);
    const targetTile = this.path[targetIndex];
    const targetX = targetTile.x * this.tileSize + this.tileSize / 2;
    const targetY = targetTile.y * this.tileSize + this.tileSize / 2;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 4) {
      this.pathIndex++;
      if (this.pathIndex >= this.path.length) {
        body.setAcceleration(0, 0);
        return;
      }
    }

    // --- Accelerate toward target ---
    const angle = Math.atan2(dy, dx);
    const ax = Math.cos(angle) * this.acceleration;
    const ay = Math.sin(angle) * this.acceleration;
    body.setAcceleration(ax, ay);

    // --- Clamp max speed ---
    if (body.velocity.length() > this.speed) {
      body.velocity.scale(this.speed / body.velocity.length());
    }

    // --- Rotate to face movement ---
    this.setRotation(angle);
  }
}
