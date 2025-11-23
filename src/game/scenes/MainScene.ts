import Phaser from "phaser";
import Player from "../entities/Player";
import Enemy from "../entities/Enemy";
import Pathfinder from "../systems/pathfinder";
import { createMap } from "../systems/mapLoader";
import { registerAnimations } from "../systems/animations";
import { createBulletGroup } from "../systems/bulletGroup";
import { createGridFromTilemap } from "../systems/gridUtils";
import { shoot } from "../systems/shooting";
import { setupCollisions } from "../systems/collisionHandler";

export default class MainScene extends Phaser.Scene {
    private player!: Player;
    private playerGroup!: Phaser.Physics.Arcade.Group;
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
        // map
        this.load.image("tiles", "assets/TileSet v1.0.png");
        this.load.tilemapTiledJSON("map", "assets/map.json");

        // entities
        this.load.image("player", "assets/player.png");
        this.load.image("enemy", "assets/enemy.png");

        // animations
        this.load.spritesheet("explosion", "assets/explosion.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("bullet", "assets/bullets.png", { frameWidth: 48, frameHeight: 48 });

        // background
        this.load.video("bgVideo", ["assets/space_background.mp4", "assets/space_background.webm"]);

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
        const bg = this.add.video(this.mapWidth / 2, this.mapHeight / 2, "bgVideo")
            .setDepth(-1)
            .setScrollFactor(0);
        bg.play(true).setMute(true);

        // --- WORLD & WALL COLLISION ---
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
        walls.setCollisionByProperty({ collides: true });

        // --- PLAYER ---
        this.player = new Player(this, this.mapWidth / 2, this.mapHeight / 2, "player");
        // --- PLAYER GROUP FOR COLLISIONS --- needed for collisions
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

        // --- ENEMIES ---
        const spawnLayer = map.getObjectLayer("spawns");
        if (spawnLayer) {
            spawnLayer.objects.forEach((obj) => {
                if (obj.name.startsWith("enemy_spawn")) {
                    for (let i = 0; i < 2; i++) {
                        const offsetX = (Math.random() - 0.5) * 16;
                        const offsetY = (Math.random() - 0.5) * 16;
                        const enemy = new Enemy(this, obj.x! + offsetX, obj.y! + offsetY, pathfinder, 32);
                        this.enemies.push(enemy);
                    }
                }
            });
        }

        this.enemiesGroup = this.physics.add.group(this.enemies);

        // ------------------------------------------------------------------
        // --- CONSOLIDATED COLLISION SETUP ---
        // This single function call sets up all overlaps and colliders defined 
        // in 'src/systems/collisionHandler.ts'.
        setupCollisions(
            this,
            this.playerGroup,
            this.playerBullets,
            this.enemyBullets,
            this.enemiesGroup,
            walls
        );
        // ------------------------------------------------------------------

        // --- INPUT ---
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time: number) {
        if (!this.player) return;

        // --- PLAYER UPDATE ---
        this.player.update(this.cursors, this.input.activePointer);

        // --- PLAYER SHOOTING ---
        if (this.player.active && this.input.activePointer.isDown && time > this.lastFired) {
            shoot(this.playerBullets, this.player.x, this.player.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
            this.lastFired = time + 200; // 200ms cooldown
        }

        // --- ENEMY UPDATES & SHOOTING ---
        this.enemies.forEach((enemy) => {
            enemy.update(time, this.player.x, this.player.y, this.enemyBullets);
        });
    }
}