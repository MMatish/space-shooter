import Phaser from "phaser";

/**
 * Converts a Phaser TilemapLayer into a 2D number grid for pathfinding.
 * Tiles with the "walkable" property set to true are walkable (1), others are blocked (0)
 */
export function createGridFromTilemap(tilemapLayer: Phaser.Tilemaps.TilemapLayer) {
  const map = tilemapLayer.tilemap;
  const layerData = tilemapLayer.layer; // the actual internal layer data
  const grid: number[][] = [];

  console.log("TilemapLayer object:");
  console.dir(tilemapLayer, { depth: null });

  console.log("Accessing internal layer:", layerData.name);

  for (let y = 0; y < layerData.height; y++) {
    grid[y] = [];
    for (let x = 0; x < layerData.width; x++) {
      const tile = layerData.data[y][x];
      if (tile) {
        console.log(`Tile at (${x}, ${y}) has properties:`, tile.properties);

        const walkable = tile.properties?.walkable ?? false;
        grid[y][x] = walkable ? 1 : 0;

        if (!walkable) {
          console.log(`Tile blocked at (${x}, ${y}) - tile index: ${tile.index}`);
        }
      } else {
        grid[y][x] = 0;
        console.log(`No tile at (${x}, ${y}) - treated as blocked`);
      }
    }
  }

  console.log("Grid generated:", grid);
  return grid;
}
