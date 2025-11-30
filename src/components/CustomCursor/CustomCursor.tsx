import { useEffect, useState } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const [cross, setCross] = useState({ x: 0, y: 0 }); // cross is now the real mouse
  const [dot, setDot] = useState({ x: 0, y: 0 });     // dot follows cross

  useEffect(() => {
    const move = (e: MouseEvent) => setCross({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    let animFrame: number;

    const animate = () => {
      setDot(prev => ({
        x: prev.x + (cross.x - prev.x) * 0.1,
        y: prev.y + (cross.y - prev.y) * 0.1,
      }));
      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animFrame);
  }, [cross]);

  return (
    <>
      <div className="cursor-dot" style={{ left: dot.x, top: dot.y }} />
      <div className="cursor-cross" style={{ left: cross.x, top: cross.y }} />
    </>
  );
}
