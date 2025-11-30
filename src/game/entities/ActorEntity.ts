import Phaser from "phaser";
import Bullet from "./Bullet";
import Explosion from "./Explosion";

export type ActorStats = {
  maxHealth?: number;
  damage?: number;
  scale?: number;
  moveSpeed?: number;      // optional generic movement stat
  shotCooldown?: number;   // optional shooting stat
};

export default class ActorEntity extends Phaser.Physics.Arcade.Sprite {
  // --- Stats ---
  public maxHealth: number;
  public health: number;
  public isDead = false;

  public damage: number;
  public moveSpeed: number;
  public shotCooldown: number;

  // --- Bullet pool owned by this actor ---
  public bullets: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    stats: ActorStats = {}
  ) {
    const scale = stats.scale ?? 0.6;
    super(scene, x, y, texture);

    // Pull stats from config
    this.maxHealth = stats.maxHealth ?? 100;
    this.health = this.maxHealth;

    this.damage = stats.damage ?? 10;
    this.moveSpeed = stats.moveSpeed ?? 150;
    this.shotCooldown = stats.shotCooldown ?? 600;

    // Register in scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visual setup
    this.setOrigin(0.5);
    this.setScale(scale);

    // Physics body setup
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(this.width * scale, this.height * scale);

    // --- Movement physics defaults (UPDATED for instant stop capability) ---
    body.setDamping(false);
    // Set drag to 0 to ensure the physics engine doesn't introduce friction/sliding
    body.setDrag(0, 0); 
    body.setMaxVelocity(300);

    // Local bullet pool (player or enemies can use it)
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: false,
      maxSize: 2,
    });
  }

  /** Apply incoming damage */
  takeDamage(amount: number) {
    if (this.isDead) return;

    this.health -= amount;

    if (this.health <= 0) {
      this.kill();
    }
  }

  /** Disable the actor and play a death effect */
  kill() {
    if (this.isDead) return;
    this.isDead = true;

    new Explosion(this.scene, this.x, this.y);

    this.setActive(false);
    this.setVisible(false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(false);
    body.stop();
  }

  /** Respawn actor with full health at a new location */
  respawn(x: number, y: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    this.setPosition(x, y);

    this.health = this.maxHealth;
    this.isDead = false;

    this.setActive(true);
    this.setVisible(true);

    body.setEnable(true);
    body.setVelocity(0, 0);
    body.setAcceleration(0, 0);
  }
}