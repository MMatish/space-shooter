import Phaser from "phaser";

export function setupCamera(
  scene: Phaser.Scene,
  player: Phaser.GameObjects.GameObject,
  map: Phaser.Tilemaps.Tilemap
) {
  scene.cameras.main.startFollow(player, true, 0.08, 0.08);
  scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}
