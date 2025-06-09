import React from 'react';
import { ThemeType } from '../App';
import { sizeConfig } from '../utils/sizeConfig';

interface PlayerNameProps {
  theme: ThemeType;
  playerName: string;
  namePosition: string;
  fontSize: string;
  fontFamily: string;
  scale?: number;
}

const PlayerName: React.FC<PlayerNameProps> = ({
  theme,
  playerName,
  namePosition,
  fontSize,
  fontFamily,
  scale = 1
}) => {
  const sizes = {
    paddingX: sizeConfig.playerName.padding.x * scale,
    paddingY: sizeConfig.playerName.padding.y * scale,
    position: sizeConfig.playerName.position * scale,
    borderRadius: sizeConfig.playerName.borderRadius,
    fontSize: parseInt(fontSize) * scale,
    glowSize: 20 * scale,
    textShadow: 10 * scale,
  };

  const getPositionStyles = () => {
    const positions: { [key: string]: React.CSSProperties } = {
      'bottom-right': { bottom: `${sizes.position}px`, right: `${sizes.position}px` },
      'bottom-left': { bottom: `${sizes.position}px`, left: `${sizes.position}px` },
      'top-left': { top: `${sizes.position + sizeConfig.avatar.size * scale + 16 * scale}px`, left: `${sizes.position}px` },
      'top-right': { top: `${sizes.position + sizeConfig.galaxy.planetSize * scale + 16 * scale}px`, right: `${sizes.position}px` },
    };
    return positions[namePosition] || positions['bottom-right'];
  };

  return (
    <div 
      className="absolute"
      style={getPositionStyles()}
    >
      <div 
        className="rounded-full"
        style={{
          padding: `${sizes.paddingY}px ${sizes.paddingX}px`,
          background: `linear-gradient(135deg, ${theme.primary}dd, ${theme.secondary}dd)`,
          backdropFilter: 'blur(10px)',
          border: `${1 * scale}px solid ${theme.primary}`,
          boxShadow: `0 0 ${sizes.glowSize}px ${theme.glow}`,
          borderRadius: `${sizes.borderRadius}px`,
        }}
      >
        <p 
          className="font-bold tracking-wider"
          style={{
            color: '#ffffff',
            fontFamily: fontFamily,
            fontSize: `${sizes.fontSize}px`,
            textShadow: `0 0 ${sizes.textShadow}px ${theme.glow}`,
          }}
        >
          {playerName}
        </p>
      </div>
    </div>
  );
};

export default PlayerName;