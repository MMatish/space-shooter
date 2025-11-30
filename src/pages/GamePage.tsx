import { useEffect, useState } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";
import MainScene from "../game/scenes/MainScene";
import GameUi from "../components/GameUi";
import ErrorOverlay from "../components/ErrorOverlay";
import { useGameStore } from "../dataStore/gameStore";

const GamePage = () => {
  const selectedMap = useGameStore((s) => s.selectedMap);
  const setSelectedMap = useGameStore((s) => s.setSelectedMap);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMap) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "game-container",
      scene: [new MainScene(selectedMap, setError)], // passing setError to scene
      physics: { default: "arcade", arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, [selectedMap]);

  const handleBack = () => {
    setSelectedMap(null); // reset store
    navigate("/select-map"); // navigate to selection page
  };

  if (!selectedMap) {
    return <ErrorOverlay message="Please select a map first" onBack={handleBack} />;
  }

  if (error) {
    return <ErrorOverlay message={error} onBack={handleBack} />;
  }

  return (
    <>
      <div id="game-container" style={{ width: "100vw", height: "100vh" }} />
      <GameUi />
    </>
  );
};

export default GamePage;
