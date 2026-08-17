import { useEffect, useRef } from "react";

export default function ClickSpark({
  sparkColor = "#ff3b81",
  sparkSize = 12,
  sparkCount = 8,
  duration = 500,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();

      sparksRef.current = sparksRef.current.filter((s) => {
        const elapsed = now - s.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const currentDistance = s.distance * (1 - Math.pow(1 - progress, 3));
        const x = s.x + Math.cos(s.angle) * currentDistance;
        const y = s.y + Math.sin(s.angle) * currentDistance + progress * 20; // gravity
        const size = s.size * (1 - progress);
        const alpha = 1 - progress;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;

        // Draw 4-point sparkle star
        ctx.translate(x, y);
        ctx.rotate(progress * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size, 0);
        ctx.quadraticCurveTo(0, 0, 0, size);
        ctx.quadraticCurveTo(0, 0, -size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size);
        ctx.fill();
        ctx.restore();

        return true;
      });

      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    const handlePointerDown = (e) => {
      const colors = [sparkColor, "#ffd166", "#ff85b8", "#ffffff", "#c084fc"];
      const now = performance.now();

      for (let i = 0; i < sparkCount; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5,
          distance: 25 + Math.random() * 45,
          size: sparkSize * (0.6 + Math.random() * 0.8),
          color: colors[Math.floor(Math.random() * colors.length)],
          startTime: now,
        });
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(animId);
    };
  }, [sparkColor, sparkSize, sparkCount, duration]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
