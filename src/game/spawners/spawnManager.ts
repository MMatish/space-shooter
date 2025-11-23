// src/systems/spawnManager.ts

import Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Pathfinder from "../systems/pathfinder";

/**
 * Defines the structure for a spawn point object from the Tiled map layer.
 */
interface SpawnPoint extends Phaser.Types.Tilemaps.TiledObject {
    x: number;
    y: number;
}

/**
 * Finds all objects in the spawn layer marked as 'enemy_spawn'.
 * @param map - The Tilemap containing the object layers.
 * @returns An array of enemy spawn points.
 */
export const getSpawnPoints = (map: Phaser.Tilemaps.Tilemap): SpawnPoint[] => {
    const spawnLayer = map.getObjectLayer("spawns");
    if (!spawnLayer) {
        console.error("Tiled map is missing the 'spawns' object layer.");
        return [];
    }
    
    // Filter objects to find only those starting with 'enemy_spawn'
    const enemySpawnPoints = spawnLayer.objects
        .filter(obj => obj.name.startsWith("enemy_spawn"))
        .map(obj => ({
            x: obj.x!, // Asserting non-null since these are objects with coordinates
            y: obj.y!,
        })) as SpawnPoint[];
        
    return enemySpawnPoints;
};

/**
 * Spawns a single enemy at a random available spawn point.
 * @param scene - The current Phaser Scene.
 * @param spawnPoints - An array of available enemy spawn points.
 * @param pathfinder - The pathfinding system instance.
 * @returns The newly created Enemy instance.
 */
export const spawnSingleEnemy = (
    scene: Phaser.Scene,
    spawnPoints: SpawnPoint[],
    pathfinder: Pathfinder
): Enemy | null => {
    if (spawnPoints.length === 0) {
        console.warn("No spawn points available to spawn an enemy.");
        return null;
    }
    
    // Select a random spawn point
    const randomIndex = Phaser.Math.Between(0, spawnPoints.length - 1);
    const spawnPoint = spawnPoints[randomIndex];
    
    // Apply a small random offset to prevent overlap if multiple enemies spawn
    const offsetX = (Math.random() - 0.5) * 16;
    const offsetY = (Math.random() - 0.5) * 16;
    
    // Create and return the new enemy
    const newEnemy = new Enemy(
        scene, 
        spawnPoint.x + offsetX, 
        spawnPoint.y + offsetY, 
        pathfinder, 
        32
    );
    
    return newEnemy;
};