import Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Pathfinder from "../systems/pathfinder";
import type { EnemyConfig } from "../entities/Enemy";
import { ENEMY_TYPES } from "../systems/enemyTypes";
import { MAPS, type EnemyTypeKey } from "../systems/mapsConfig";

// Internal types can now mirror the external config
export type SpawnPointDefinition = {
  id: string;
  enemyKey: EnemyTypeKey; // Use the key type
  delay?: number;
};

export type WaveConfig = {
  spawns: SpawnPointDefinition[];
};

export class MapManager {
  private scene: Phaser.Scene;
  private pathfinder: Pathfinder;
  private map?: Phaser.Tilemaps.Tilemap;
  private spawnPoints: Record<string, { x: number; y: number }> = {};
  // Added a flag to track if the wall collider has been set up (for optimization)
  private isWallColliderSet = false; 

  private currentWaveIndex = 0;
  private waves: WaveConfig[] = [];

  constructor(scene: Phaser.Scene, pathfinder: Pathfinder) {
    this.scene = scene;
    this.pathfinder = pathfinder;
  }

  /** Load map by name and extract spawn points */
  public loadMap(map: Phaser.Tilemaps.Tilemap, mapKey: string) {
    this.map = map;
    this.isWallColliderSet = false; // Reset wall collider flag for new map

    // Find config from MAPS
    const mapConfig = MAPS.find(m => m.key === mapKey);
    if (!mapConfig) throw new Error(`MapManager: No config found for map "${mapKey}"`);

    // ASSIGNMENT: Direct assignment is safe now that MapWaveConfig
    // and internal WaveConfig are structurally identical (using enemyKey)
    this.waves = mapConfig.waves as WaveConfig[]; 

    this.currentWaveIndex = 0;

    // Extract spawn points from Tiled object layer
    const spawnLayer = map.getObjectLayer("spawns");
    this.spawnPoints = {};
    spawnLayer?.objects.forEach(obj => {
      if (obj.name) this.spawnPoints[obj.name] = { x: obj.x!, y: obj.y! };
    });
  }

  /** Spawn the current wave of enemies */
  public spawnWave(
    enemiesGroup: Phaser.Physics.Arcade.Group,
    walls: Phaser.Tilemaps.TilemapLayer
  ): Enemy[] {
    if (!this.map) throw new Error("MapManager: no map loaded");

    const wave = this.waves[this.currentWaveIndex];
    if (!wave) {
      console.log("All waves completed for this map!");
      return [];
    }

    // ***Set up collision once between the GROUP and the WALLS***
    if (!this.isWallColliderSet) {
        this.scene.physics.add.collider(enemiesGroup, walls);
        this.isWallColliderSet = true;
    }

    const enemies: Enemy[] = [];

    wave.spawns.forEach(spawnDef => {
      const point = this.spawnPoints[spawnDef.id];
      if (!point) {
        // ***IMPROVED ERROR HANDLING***
        console.error(`MapManager: Spawn point ID "${spawnDef.id}" not found in Tiled map.`);
        return; 
      }

      // Slightly randomize spawn position to prevent stacking
      const offsetX = (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 16;

      const spawnEnemy = () => {
        // Look up config using the enemyKey
        const enemyCfg: EnemyConfig = ENEMY_TYPES[spawnDef.enemyKey];
        const enemy = new Enemy(
          this.scene,
          point.x + offsetX,
          point.y + offsetY,
          this.pathfinder,
          enemyCfg
        );

        // Add to physics group
        enemiesGroup.add(enemy);

        // Note: No need for individual collider here, the group collider handles it.

        enemies.push(enemy);
      };

      if (spawnDef.delay) {
        this.scene.time.delayedCall(spawnDef.delay, spawnEnemy);
      } else {
        spawnEnemy();
      }
    });

    this.currentWaveIndex++; // advance to next wave
    return enemies;
  }

  /** Check if all waves are done */
  public isMapCompleted(): boolean {
    return this.currentWaveIndex >= this.waves.length;
  }

  /** Get number of remaining waves */
  public remainingWaves(): number {
    return this.waves.length - this.currentWaveIndex;
  }
}