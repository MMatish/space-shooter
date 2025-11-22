import Phaser from "phaser";
import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Bullet from "../entities/Bullet";
import Explosion from "../entities/Explosion";

// Import system files
import { createMap } from "../systems/mapLoader";
import { setupCamera } from "../systems/cameraSetup";
import { registerAnimations } from "../systems/animations";
import { createBulletGroup } from "../systems/bulletGroup";
import { spawnEnemies } from "../spawners/enemySpawner";
import { setupCollisions } from "../systems/collisions";

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies: Enemy[] = [];
  private mapWidth!: number;
  private mapHeight!: number;
  private lastFired = 0;
  private entityScale: number = 1 / 1.5; // 0.66

  constructor() {
    super("MainScene");
  }

  /** ----------------------------
   * Preload all assets
   * ----------------------------
   */
  preload() {
    this.load.image("tiles", "assets/TileSet v1.0.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");
    this.load.image("player", "assets/player.png");
    this.load.spritesheet("bullet", "assets/bullets.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.image("enemy", "assets/enemy.png");
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  /** ----------------------------
   * Create game objects, layers, and systems
   * ----------------------------
   */
  create() {
    // --- MAP ---
    const { map, floors, walls } = createMap(this);
    this.mapWidth = map.widthInPixels * 2;
    this.mapHeight = map.heightInPixels * 2;

    // --- WORLD ---
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    // --- PLAYER ---
    this.player = new Player(this, 400, 300, "player");
    this.physics.add.collider(this.player, walls);

    // --- CAMERA ---
    setupCamera(this, this.player, map);
    this.cameras.main.setZoom(2);

    // --- ANIMATIONS ---
    registerAnimations(this);

    // --- BULLETS ---
    this.bullets = createBulletGroup(this);

    // --- ENEMIES ---
    this.enemies = spawnEnemies(this, 5, this.mapWidth, this.mapHeight, walls);

    // --- COLLISIONS ---
    setupCollisions(this, this.bullets, this.enemies, walls);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /** ----------------------------
   * Update loop (runs every frame)
   * ----------------------------
   */
  update(time: number) {
    if (!this.player) return;

    // --- PLAYER MOVEMENT ---
    this.player.update(this.cursors);

    // --- CLAMP PLAYER TO MAP BOUNDS ---
    this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.mapWidth);
    this.player.y = Phaser.Math.Clamp(this.player.y, 0, this.mapHeight);

    // --- ENEMY UPDATES ---
    this.enemies.forEach((enemy) => enemy.update());

    // --- SHOOT BULLETS ---
    if (this.cursors.space?.isDown && time > this.lastFired) {
      const bullet = this.bullets.get() as Bullet;
      if (bullet) {
        bullet.fire(this.player.x, this.player.y, this.player.rotation);
        this.lastFired = time + 300; // cooldown in ms
      }
    }

    // --- TEST EXPLOSIONS ---
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shift)) {
      const randX = Phaser.Math.Between(50, this.mapWidth - 50);
      const randY = Phaser.Math.Between(50, this.mapHeight - 50);
      new Explosion(this, randX, randY);
    }
  }
}
