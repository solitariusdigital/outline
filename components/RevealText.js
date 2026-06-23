"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RevealText({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const translate = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : translate,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
