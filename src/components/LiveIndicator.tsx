import React from "react";
import { ThemeType } from "../App";
import { sizeConfig } from "../utils/sizeConfig";

interface LiveIndicatorProps {
  theme: ThemeType;
  scale?: number;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({ theme, scale = 1 }) => {
  const sizes = {
    paddingX: sizeConfig.liveIndicator.padding.x * scale,
    paddingY: sizeConfig.liveIndicator.padding.y * scale,
    dotSize: sizeConfig.liveIndicator.dotSize * scale,
    fontSize: sizeConfig.liveIndicator.fontSize * scale,
    position: sizeConfig.liveIndicator.position * scale,
    textShadow: 5 * scale,
  };

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{ top: `${sizes.position}px` }}
    >
      <div
        className="flex items-center rounded-full"
        style={{
          padding: `${sizes.paddingY}px ${sizes.paddingX}px`,
          gap: `${8 * scale}px`,
          background: `${theme.primary}20`,
          border: `${1 * scale}px solid ${theme.primary}40`,
        }}
      >
        <div
          className="rounded-full animate-pulse"
          style={{
            width: `${sizes.dotSize}px`,
            height: `${sizes.dotSize}px`,
            background: theme.primary,
          }}
        />
        <span
          className="font-medium uppercase tracking-wider"
          style={{
            fontSize: `${sizes.fontSize}px`,
            color: theme.primary,
            textShadow: `0 0 ${sizes.textShadow}px ${theme.glow}`,
          }}
        >
          Live
        </span>
      </div>
    </div>
  );
};

export default LiveIndicator;
