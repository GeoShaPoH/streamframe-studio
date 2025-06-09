import React from 'react';
import { Image } from 'lucide-react';
import { ThemeType } from '../App';
import { sizeConfig } from '../utils/sizeConfig';

interface AvatarProps {
  theme: ThemeType;
  avatarImage: string | ArrayBuffer | null;
  scale?: number;
}

const Avatar: React.FC<AvatarProps> = ({ theme, avatarImage, scale = 1 }) => {
  const sizes = {
    size: sizeConfig.avatar.size * scale,
    borderWidth: sizeConfig.avatar.borderWidth * scale,
    position: sizeConfig.avatar.position * scale,
    iconSize: 32 * scale
  };

  return (
    <div 
      className="absolute"
      style={{
        top: `${sizes.position}px`,
        left: `${sizes.position}px`,
      }}
    >
      <div 
        className="rounded-full overflow-hidden"
        style={{
          width: `${sizes.size}px`,
          height: `${sizes.size}px`,
          border: `${sizes.borderWidth}px solid ${theme.primary}`,
          boxShadow: `0 0 ${20 * scale}px ${theme.glow}`,
        }}
      >
        {avatarImage ? (
          <img 
            src={typeof avatarImage === 'string' ? avatarImage : undefined} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
            <Image 
              className="text-white opacity-50" 
              style={{
                width: `${sizes.iconSize}px`,
                height: `${sizes.iconSize}px`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;