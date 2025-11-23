import Phaser from "phaser";
import BaseEntity from "./BaseEntity";
import Pathfinder from "../systems/pathfinder";
import { shoot } from "../systems/shooting";

export default class Enemy extends BaseEntity {
  private speed = 150;
  private acceleration = 300;
  private path: { x: number; y: number }[] = [];
  private pathIndex = 0;
  private pathfinder: Pathfinder;
  private tileSize: number;
  private lastPathTime = 0;
  private pathUpdateInterval = 100;
  private lookahead = 2;

  // --- Shooting ---
  public lastShotTime = 0;
  public shotCooldown = 600; // 1 second between shots

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

  /**
   * Update enemy movement and optionally shoot at the player
   * @param time Phaser time
   * @param playerX Player world X
   * @param playerY Player world Y
   * @param enemyBullets Optional bullet group for shooting
   */
  update(time: number, playerX: number, playerY: number, enemyBullets?: Phaser.Physics.Arcade.Group) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // --- Pathfinding ---
    if (time - this.lastPathTime > this.pathUpdateInterval) {
      this.lastPathTime = time;
      this.followPlayer(playerX, playerY);
    }

    if (!this.path || this.pathIndex >= this.path.length) {
      body.setAcceleration(0, 0);
    } else {
      const targetIndex = Math.min(this.pathIndex + this.lookahead, this.path.length - 1);
      const targetTile = this.path[targetIndex];
      const targetX = targetTile.x * this.tileSize + this.tileSize / 2;
      const targetY = targetTile.y * this.tileSize + this.tileSize / 2;

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 4) this.pathIndex++;

      const angle = Math.atan2(dy, dx);
      const ax = Math.cos(angle) * this.acceleration;
      const ay = Math.sin(angle) * this.acceleration;
      body.setAcceleration(ax, ay);

      if (body.velocity.length() > this.speed) {
        body.velocity.scale(this.speed / body.velocity.length());
      }

      this.setRotation(angle);
    }

    // --- Shooting at player ---
    if (enemyBullets && time > this.lastShotTime) {
      shoot(enemyBullets, this.x, this.y, playerX, playerY);
      this.lastShotTime = time + this.shotCooldown;
    }
  }
}
