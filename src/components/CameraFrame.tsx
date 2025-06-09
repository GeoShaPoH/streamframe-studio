import React, { useEffect } from 'react';
import CornerMarks from './CornerMarks';
import Avatar from './Avatar';
import GalaxyAnimation from './GalaxyAnimation';
import PlayerName from './PlayerName';
import LiveIndicator from './LiveIndicator';
import { ThemeType } from '../App';

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
  scale = 1
}) => {
  // Importar fuentes de Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, [fontFamily]);

  // Sistema de escalado
  const scaledPadding = 8 * scale;
  const borderWidth = 3 * scale;
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
          className="relative w-full h-full overflow-hidden"
          style={{
            background: 'transparent',
            border: `${borderWidth}px solid ${theme.primary}`,
            borderRadius: `${24 * scale}px`,
            boxShadow: `0 0 ${glowSize}px ${theme.glow}, inset 0 0 ${glowSize * 0.67}px ${theme.glow}`,
          }}
        >
          <CornerMarks theme={theme} scale={scale} />
          
          {showAvatar && (
            <Avatar theme={theme} avatarImage={avatarImage} scale={scale} />
          )}

          {showAnimation && (
            <GalaxyAnimation theme={theme} scale={scale} />
          )}

          <PlayerName
            theme={theme}
            playerName={playerName}
            namePosition={namePosition}
            fontSize={fontSize}
            fontFamily={fontFamily}
            scale={scale}
          />

          <LiveIndicator theme={theme} scale={scale} />
        </div>
      </div>
    </div>
  );
};

export default CameraFrame;