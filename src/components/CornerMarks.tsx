import React from "react";
import { ThemeType } from "../App";
import { sizeConfig } from "../utils/sizeConfig";

interface CornerMarksProps {
  theme: ThemeType;
  scale?: number;
}

const CornerMarks: React.FC<CornerMarksProps> = ({ theme, scale = 1 }) => {
  const sizes = {
    longLine: sizeConfig.cornerMarks.longLine * scale,
    shortLine: sizeConfig.cornerMarks.shortLine * scale,
    spacing: sizeConfig.cornerMarks.spacing * scale,
    thickness: sizeConfig.cornerMarks.thickness * scale,
    innerSpacing: sizeConfig.cornerMarks.innerSpacing * scale,
  };
  const renderCorner = (position: string) => {
    const isTop = position.includes("top");
    const isLeft = position.includes("left");

    return (
      <div
        className="absolute"
        style={{
          [isTop ? "top" : "bottom"]: `${sizes.spacing}px`,
          [isLeft ? "left" : "right"]: `${sizes.spacing}px`,
        }}
      >
        <div
          className="absolute"
          style={{
            background: theme.primary,
            width: isLeft ? `${sizes.longLine}px` : `${sizes.longLine}px`,
            height: `${sizes.thickness}px`,
            [isLeft ? "left" : "right"]: 0,
            [isTop ? "top" : "bottom"]: 0,
          }}
        />
        <div
          className="absolute"
          style={{
            background: theme.primary,
            width: `${sizes.thickness}px`,
            height: `${sizes.longLine}px`,
            [isLeft ? "left" : "right"]: 0,
            [isTop ? "top" : "bottom"]: 0,
          }}
        />
        <div
          className="absolute"
          style={{
            background: theme.primary,
            opacity: 0.6,
            width: `${sizes.shortLine}px`,
            height: `${sizes.thickness}px`,
            [isLeft ? "left" : "right"]: 0,
            [isTop ? "top" : "bottom"]: `${sizes.innerSpacing}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            background: theme.primary,
            opacity: 0.6,
            width: `${sizes.thickness}px`,
            height: `${sizes.shortLine}px`,
            [isLeft ? "left" : "right"]: `${sizes.innerSpacing}px`,
            [isTop ? "top" : "bottom"]: 0,
          }}
        />
      </div>
    );
  };

  return (
    <>
      {renderCorner("top-left")}
      {renderCorner("top-right")}
      {renderCorner("bottom-left")}
      {renderCorner("bottom-right")}
    </>
  );
};

export default CornerMarks;
