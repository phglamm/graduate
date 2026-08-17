import { useRef, useState } from "react";

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 101, 163, 0.22)",
  borderColor = "rgba(255, 59, 129, 0.35)",
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleTouchMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch) {
      setPosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onTouchStart={() => setOpacity(1)}
      onTouchEnd={() => setOpacity(0)}
      className={`spotlight-card ${className}`}
      style={{
        "--spotlight-color": spotlightColor,
        "--card-custom-border": borderColor,
      }}
    >
      <div
        className="spotlight-overlay"
        style={{
          opacity,
          background: `radial-gradient(280px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="spotlight-content">{children}</div>
    </div>
  );
}
