import { useEffect, useState } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";
import MainScene from "../game/scenes/MainScene";
import GameUi from "../components/GameUi";
import ErrorOverlay from "../components/ErrorOverlay";
import GameMenu from "../components/GameMenu";
import { useGameStore } from "../dataStore/gameStore";
import ClipLoader from "react-spinners/ClipLoader";

const GamePage = () => {
  const selectedMap = useGameStore((s) => s.selectedMap);
  const setSelectedMap = useGameStore((s) => s.setSelectedMap);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMap) return;

    // Pass setLoading to MainScene
    const scene = new MainScene(selectedMap, setError, () => setLoading(false));

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "game-container",
      scene: [scene],
      physics: { default: "arcade", arcade: { debug: false } },
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    };

    const newGame = new Phaser.Game(config);
    setGame(newGame);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!scene.scene.isPaused()) {
          scene.scene.pause();
          setMenuOpen(true);
        } else {
          scene.scene.resume();
          setMenuOpen(false);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !scene.scene.isPaused()) {
        scene.scene.pause();
        setMenuOpen(true);
      }
    };

    const handleWindowBlur = () => {
      if (!scene.scene.isPaused()) {
        scene.scene.pause();
        setMenuOpen(true);
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      newGame.destroy(true);
    };
  }, [selectedMap]);

  const handleBack = () => {
    setSelectedMap(null);
    navigate("/select-map");
    if (game) game.destroy(true);
  };

  const handleContinue = () => {
    setMenuOpen(false);
    if (game) {
      const scene = game.scene.getScene("MainScene") as Phaser.Scene;
      scene.scene.resume();
    }
  };

  if (!selectedMap) {
    return <ErrorOverlay message="Please select a map first" onBack={handleBack} />;
  }

  if (error) {
    return <ErrorOverlay message={error} onBack={handleBack} />;
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <ClipLoader color="#00ffff" size={80} />
        </div>
      )}
      <div id="game-container" style={{ width: "100vw", height: "100vh" }} />
      <GameUi />
      {menuOpen && <GameMenu onContinue={handleContinue} onQuit={handleBack} />}
    </>
  );
};

export default GamePage;
