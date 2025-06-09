import React, { useEffect } from "react";
import Frame from "./Frame";
import CornerMarks from "./CornerMarks";
import Avatar from "./Avatar";
import GalaxyAnimation from "./GalaxyAnimation";
import PlayerName from "./PlayerName";
import LiveIndicator from "./LiveIndicator";
import { ThemeType } from "../App";

interface CameraFrameProps {
  theme: ThemeType;
  playerName: string;
  namePosition: string;
  fontSize: string;
  fontFamily: string;
  showAvatar: boolean;
  avatarImage: string | ArrayBuffer | null;
  showAnimation: boolean;
  scale?: number;
}

const CameraFrame: React.FC<CameraFrameProps> = ({
  theme,
  playerName,
  namePosition,
  fontSize,
  fontFamily,
  showAvatar,
  avatarImage,
  showAnimation,
  scale = 1,
}) => {
  // Importar fuentes de Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      " ",
      "+"
    )}:wght@400;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, [fontFamily]);

  return (
    <Frame theme={theme} scale={scale}>
      <CornerMarks theme={theme} scale={scale} />

      {showAvatar && (
        <Avatar theme={theme} avatarImage={avatarImage} scale={scale} />
      )}

      {showAnimation && <GalaxyAnimation theme={theme} scale={scale} />}

      <PlayerName
        theme={theme}
        playerName={playerName}
        namePosition={namePosition}
        fontSize={fontSize}
        fontFamily={fontFamily}
        scale={scale}
      />

      <LiveIndicator theme={theme} scale={scale} />
    </Frame>
  );
};

export default CameraFrame;
