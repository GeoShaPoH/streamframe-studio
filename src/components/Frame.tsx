import React from "react";
import { ThemeType } from "../App";

interface FrameProps {
  theme: ThemeType;
  scale?: number;
  children?: React.ReactNode;
}

const Frame: React.FC<FrameProps> = ({ theme, scale = 1, children }) => {
  // Sistema de escalado
  const scaledPadding = 8 * scale;
  const borderWidth = 12 * scale;
  const glowSize = 30 * scale;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        inset: `${scaledPadding}px`,
      }}
    >
      <div className="relative w-full h-full">
        {/* Borde exterior con efecto glow */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: `${24 * scale}px`,
            padding: `${2 * scale}px`,
            filter: `blur(${4 * scale}px)`,
            opacity: 0.8,
          }}
        />

        {/* Marco principal */}
        <div
          className="relative w-full h-full overflow-hidden animated-border"
          style={{
            border: `${borderWidth}px solid ${theme.primary}`,
            borderRadius: `${24 * scale}px`,
            boxShadow: `0 0 ${glowSize}px ${theme.glow}, inset 0 0 ${
              glowSize * 0.67
            }px ${theme.glow}`,
            background: "transparent",
          }}
        >
          {/* Contenido del marco */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Frame;
