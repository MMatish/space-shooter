import Phaser from "phaser";

export function createMap(scene: Phaser.Scene, mapName: string) {
  // --- TILEMAP & TILESET ---
  const map = scene.make.tilemap({ key: "map" });
  if (!map) throw new Error(`Tilemap '${mapName}' not found`);

  // basically "tiles" is map_tileset.png, but the name of the tiles is the one defined in the map.json
  const tileset = map.addTilesetImage(`${mapName}_tileset`, "tiles");
  if (!tileset) throw new Error(`Tileset ${mapName} not found`);

  // --- LAYERS ---
  const floors = map.createLayer("floors", tileset, 0, 0);
  if (!floors) throw new Error(`Layer 'floors' not found in map '${mapName}'`);

  const walls = map.createLayer("walls", tileset, 0, 0);
  if (!walls) throw new Error(`Layer 'walls' not found in map '${mapName}'`);

  // --- COLLISIONS ---
  walls.setCollisionByExclusion([-1]);

  return { map, floors, walls };
}

export function addBackground(scene: Phaser.Scene, mapWidth: number, mapHeight: number) {
  const bg = scene.add.video(mapWidth / 2, mapHeight / 2, "bgVideo");
  if (!bg) throw new Error("Background video 'bgVideo' not found");

  bg.setDepth(-1).setScrollFactor(0);
  bg.play(true).setMute(true);
  return bg;
}
