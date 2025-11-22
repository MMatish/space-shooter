import Phaser from "phaser";

export function createMap(scene: Phaser.Scene) {
  const map = scene.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("TileSet v1.0", "tiles");

  const floors = map.createLayer("floors", tileset, 0, 0);
  const walls = map.createLayer("walls", tileset, 0, 0);

  walls.setCollisionByExclusion([-1]);

  return { map, floors, walls };
}
