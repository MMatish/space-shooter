import Phaser from "phaser";
import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Pathfinder from "../systems/pathfinder";
import { addBackground, createMap } from "../systems/mapHelper";
import { registerAnimations } from "../systems/animations";
import { createBulletGroup } from "../systems/bulletGroup";
import { createGridFromTilemap } from "../systems/gridUtils";
import { shoot } from "../systems/shooting";
import { setupCollisions } from "../systems/collisionHandler";
import { MapManager } from "../systems/mapManager";

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private playerGroup!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerBullets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private enemies: Enemy[] = [];
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private mapManager!: MapManager;

  private mapWidth!: number;
  private mapHeight!: number;
  private lastFired = 0;

  constructor() {
    super("MainScene");
  }

  preload() {
    // --- MAP ---
    this.load.image("tiles", "assets/TileSet v1.0.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");

    // --- ENTITIES ---
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("fastEnemy", "assets/fastEnemy.png");
    this.load.image("tankEnemy", "assets/tankEnemy.png");

    // --- ANIMATIONS ---
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("bullet", "assets/bullets.png", {
      frameWidth: 48,
      frameHeight: 48,
    });

    // --- BACKGROUND ---
    this.load.video("bgVideo", "assets/space_background.mp4");

    // --- SOUNDS ---
    this.load.audio("explosion", "assets/sounds/explosion.mp3");
    this.load.audio("shot", "assets/sounds/shot.mp3");
  }

  create() {
    // --- MAP ---
    const { map, floors, walls } = createMap(this);
    this.mapWidth = map.widthInPixels;
    this.mapHeight = map.heightInPixels;

    // --- WORLD BOUNDS ---
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    // --- BACKGROUND ---
    addBackground(this, this.mapWidth, this.mapHeight);

    // --- PATHFINDER ---
    const grid = createGridFromTilemap(floors);
    const pathfinder = new Pathfinder(grid);

    // --- MAP MANAGER ---
    this.mapManager = new MapManager(this, pathfinder);
    this.mapManager.loadMap(map, "map"); // just pass the map object and its key/name

    // --- PLAYER ---
    this.player = new Player(this, this.mapWidth / 2, this.mapHeight / 2);
    this.playerGroup = this.physics.add.group({ classType: Player });
    this.playerGroup.add(this.player);

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

    // --- ENEMIES GROUP ---
    this.enemiesGroup = this.physics.add.group();

    // --- FIRST WAVE ---
    this.enemies = this.mapManager.spawnWave(this.enemiesGroup, walls);

    // --- COLLISIONS ---
    setupCollisions(
      this,
      this.playerGroup,
      this.playerBullets,
      this.enemyBullets,
      this.enemiesGroup,
      walls
    );

    // --- INPUT ---
    this.cursors = this.input.keyboard!.createCursorKeys();
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
      this.lastFired = time + 200;
    }

    // --- ENEMY UPDATE ---
    let aliveEnemies = 0;
    this.enemies.forEach((enemy) => {
      if (enemy.active && !enemy.isDead) {
        enemy.update(time, this.player.x, this.player.y, this.enemyBullets);
        aliveEnemies++;
      }
    });

    // --- WAVE PROGRESSION ---
    if (aliveEnemies === 0 && !this.mapManager.isMapCompleted()) {
      this.enemies = this.mapManager.spawnWave(
        this.enemiesGroup,
        this.physics.world.bounds as any
      );
    }
  }
}
