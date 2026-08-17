import React from "react";

export default function StarBorder({
  as: Component = "div",
  className = "",
  color = "#ff3b81",
  speed = "5s",
  children,
  ...rest
}) {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        "--star-color": color,
        "--star-speed": speed,
      }}
      {...rest}
    >
      <div className="star-border-glow-top" />
      <div className="star-border-glow-bottom" />
      <div className="star-border-inner">{children}</div>
    </Component>
  );
}
