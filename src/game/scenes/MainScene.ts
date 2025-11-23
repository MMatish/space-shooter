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
import Pathfinder from "../systems/pathfinder";
import { createGridFromTilemap } from "../systems/gridUtils";
import { shoot } from "../systems/shooting";

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerBullets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private enemies: Enemy[] = [];
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
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

    // --- PATHFINDER ---
    const grid = createGridFromTilemap(floors, map);
    const pathfinder = new Pathfinder(grid);

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

    // --- BULLET GROUPS ---
    this.playerBullets = createBulletGroup(this);
    this.enemyBullets = createBulletGroup(this);

// --- ENEMIES ---
const spawnLayer = map.getObjectLayer("spawns");
if (!spawnLayer) {
  console.warn("Spawn layer not found!");
} else {
  spawnLayer.objects.forEach((obj) => {
    if (obj.name.startsWith("enemy_spawn")) {
      for (let i = 0; i < 2; i++) { // spawn 2 enemies per point
        // Slight offset to avoid exact overlap
        const offsetX = (Math.random() - 0.5) * 16; 
        const offsetY = (Math.random() - 0.5) * 16;
        const enemy = new Enemy(this, obj.x! + offsetX, obj.y! + offsetY, pathfinder, 32);
        this.enemies.push(enemy);
        this.physics.add.collider(enemy, walls);
      }
    }
  });
}


    // Convert enemies array into Phaser group
    this.enemiesGroup = this.physics.add.group(this.enemies);

    // --- COLLISIONS ---
    setupCollisions(this, this.playerBullets, this.enemiesGroup, walls); // Player bullets hit enemies
    setupCollisions(this, this.enemyBullets, this.player, walls, false); // Enemy bullets hit player

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time: number) {
    if (!this.player) return;

    // --- PLAYER UPDATE ---
    this.player.update(this.cursors, this.input.activePointer);

    // --- PLAYER SHOOTING ---
    if (
      this.player.active &&
      this.input.activePointer.isDown &&
      time > this.lastFired
    ) {
      shoot(
        this.playerBullets,
        this.player.x,
        this.player.y,
        this.input.activePointer.worldX,
        this.input.activePointer.worldY
      );
      this.lastFired = time + 200; // 200ms cooldown
    }

    // --- ENEMY UPDATES & SHOOTING ---
    this.enemies.forEach((enemy) => {
      // Pass enemyBullets group so each enemy can shoot at the player
      enemy.update(time, this.player.x, this.player.y, this.enemyBullets);
    });
  }
}
