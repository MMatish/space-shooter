// entities/Enemy.ts
import BaseEntity from "./BaseEntity";
import Phaser from "phaser";
import Pathfinder from "../systems/pathfinder";

export default class Enemy extends BaseEntity {
  private speed = 100;
  private path: { x: number; y: number }[] = [];
  private pathIndex = 0;
  private pathfinder: Pathfinder;
  private tileSize: number;

  private lastPathTime = 0;
  private pathUpdateInterval = 500;

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
  }

async followPlayer(playerX: number, playerY: number) {
    const startX = Math.floor(this.x / this.tileSize);
    const startY = Math.floor(this.y / this.tileSize);
    const endX = Math.floor(playerX / this.tileSize);
    const endY = Math.floor(playerY / this.tileSize);
    

    const path = await this.pathfinder.findPath(startX, startY, endX, endY);

    if (path && path.length > 0) {
        this.path = path;
        this.pathIndex = 0;
    } else {
        console.warn("No path found for enemy!", this);
    }
}


  update(time: number, playerX: number, playerY: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    // Recompute path only every interval
    if (time - this.lastPathTime > this.pathUpdateInterval) {
      this.lastPathTime = time;
      this.followPlayer(playerX, playerY);
    }

    if (this.path && this.pathIndex < this.path.length) {
      const target = this.path[this.pathIndex];
      const targetX = target.x * this.tileSize + this.tileSize / 2;
      const targetY = target.y * this.tileSize + this.tileSize / 2;

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 4) this.pathIndex++; // reached current tile

      const vx = (dx / distance) * this.speed;
      const vy = (dy / distance) * this.speed;
      body.setVelocity(vx, vy);
    } else {
      body.setVelocity(0, 0);
    }
  }
}
