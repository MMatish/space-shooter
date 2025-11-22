import Phaser from "phaser";
import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Bullet from "../entities/Bullet";
import Explosion from "../entities/Explosion";

// Systems
import { createMap } from "../systems/mapLoader";
import { setupCamera } from "../systems/cameraSetup";
import { registerAnimations } from "../systems/animations";
import { createBulletGroup } from "../systems/bulletGroup";
import { setupCollisions } from "../systems/collisions";

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies: Enemy[] = [];
  private mapWidth!: number;
  private mapHeight!: number;
  private lastFired = 0;

  constructor() {
    super("MainScene");
  }

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
    this.load.video("bgVideo", [
      "assets/space_background.mp4",
      "assets/space_background.webm",
    ]);
  }

  create() {
    // --- MAP ---
    const { map, floors, walls } = createMap(this);
    this.mapWidth = map.widthInPixels;
    this.mapHeight = map.heightInPixels;

    // --- BACKGROUND ---
    const bg = this.add
      .video(this.mapWidth / 2, this.mapHeight / 2, "bgVideo")
      .setDepth(-1)
      .setScrollFactor(0);
    bg.play(true).setMute(true);

    // --- WORLD & WALL COLLISION ---
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
    walls.setCollisionByProperty({ collides: true });

    // --- PLAYER ---
    this.player = new Player(
      this,
      this.mapWidth / 2,
      this.mapHeight / 2,
      "player"
    );
    this.physics.add.collider(this.player, walls);

    // --- CAMERA ---
    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.mapWidth, this.mapHeight);
    camera.startFollow(this.player, true, 0.08, 0.08);
    camera.setZoom(2);

    // --- ANIMATIONS ---
    registerAnimations(this);

    // --- BULLETS ---
    this.bullets = createBulletGroup(this);

    // --- ENEMIES ---
    const spawnLayer = map.getObjectLayer("spawns");
    if (!spawnLayer) {
      console.warn("Spawn layer not found!");
    } else {
      spawnLayer.objects.forEach((obj) => {
        if (obj.name.startsWith("enemy_spawn")) {
          const enemy = new Enemy(this, obj.x!, obj.y!);
          this.enemies.push(enemy);

          // Make enemies collide with walls
          this.physics.add.collider(enemy, walls);
        }
      });
    }

    // Convert enemies array to a Phaser group for collision handling
    const enemyGroup = this.physics.add.group(this.enemies);

    // --- COLLISIONS ---
    setupCollisions(this, this.bullets, enemyGroup, walls);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time: number) {
    if (!this.player) return;

    // --- PLAYER UPDATE ---
    this.player.update(this.cursors, this.input.activePointer);

    // --- SHOOT BULLETS ---
    if (this.input.activePointer.isDown && time > this.lastFired) {
      const bullet = this.bullets.get() as Bullet;
      if (bullet) {
        const angle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.input.activePointer.worldX,
          this.input.activePointer.worldY
        );
        bullet.fire(this.player.x, this.player.y, angle);
        this.lastFired = time + 200; // 200ms cooldown
      }
    }

    // --- ENEMY UPDATES ---
    this.enemies.forEach((enemy) => enemy.update());
  }
}
