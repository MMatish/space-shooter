import { useEffect } from "react";
import Phaser from "phaser";
import MainScene from "../game/scenes/MainScene";
import GameUi from "./GameUi";

const GamePage = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth, // fullscreen width
      height: window.innerHeight, // fullscreen height
      parent: "game-container",
      scene: [MainScene],
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scale: {
        mode: Phaser.Scale.RESIZE, // automatically resize with window
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);

    return () => game.destroy(true);
  }, []);

  return (
    <>
      <div id="game-container" style={{ width: "100vw", height: "100vh" }} />
      <GameUi></GameUi>
    </>
  );
};

export default GamePage;
