import Phaser from "phaser";

/**
 * Converts a Phaser TilemapLayer into a 2D number grid for pathfinding.
 * Tiles with the "walkable" property set to true are walkable (1), others are blocked (0)
 */
export function createGridFromTilemap(tilemapLayer: Phaser.Tilemaps.TilemapLayer) {
  const layerData = tilemapLayer.layer; // the actual internal layer data
  const grid: number[][] = [];

  for (let y = 0; y < layerData.height; y++) {
    grid[y] = [];
    for (let x = 0; x < layerData.width; x++) {
      const tile = layerData.data[y][x];
      if (tile) {

        const walkable = tile.properties?.walkable ?? false;
        grid[y][x] = walkable ? 1 : 0;

        if (!walkable) {
        }
      } else {
        grid[y][x] = 0;
      }
    }
  }

  return grid;
}
