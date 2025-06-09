import React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeType } from '../App';
import { sizeConfig } from '../utils/sizeConfig';

interface GalaxyAnimationProps {
  theme: ThemeType;
  scale?: number;
}

const GalaxyAnimation: React.FC<GalaxyAnimationProps> = ({ theme, scale = 1 }) => {
  const sizes = {
    planetSize: sizeConfig.galaxy.planetSize * scale,
    ringWidth: sizeConfig.galaxy.ringWidth * scale,
    ringHeight: sizeConfig.galaxy.ringHeight * scale,
    starSize: sizeConfig.galaxy.starSize * scale,
    position: sizeConfig.galaxy.position * scale,
    orbitRadius: 40 * scale,
  };

  return (
    <>
      <div 
        className="absolute"
        style={{
          top: `${sizes.position}px`,
          right: `${sizes.position}px`,
        }}
      >
        <div 
          className="relative"
          style={{
            width: `${sizes.planetSize}px`,
            height: `${sizes.planetSize}px`,
          }}
        >
          {/* Planeta principal */}
          <div 
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${theme.secondary}, ${theme.primary})`,
              boxShadow: `0 0 ${30 * scale}px ${theme.glow}`,
            }}
          />
          {/* Anillo del planeta */}
          <div 
            className="absolute inset-0 flex items-center justify-center animate-spin-reverse"
          >
            <div 
              className="rounded-full"
              style={{
                width: `${sizes.ringWidth}px`,
                height: `${sizes.ringHeight}px`,
                background: `linear-gradient(90deg, transparent, ${theme.primary}40, transparent)`,
                transform: 'rotateX(75deg)',
              }}
            />
          </div>
          {/* Estrellas orbitando */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-orbit"
              style={{
                top: '50%',
                left: '50%',
                animationDelay: `${i * 1.5}s`,
              }}
            >
              <Sparkles 
                style={{ 
                  width: `${sizes.starSize}px`,
                  height: `${sizes.starSize}px`,
                  color: theme.accent,
                  filter: `drop-shadow(0 0 ${3 * scale}px ${theme.accent})`,
                  transform: `translate(-50%, -50%) translateX(${sizes.orbitRadius + i * 10 * scale}px)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes orbit {
          from { 
            transform: translate(-50%, -50%) rotate(0deg) translateX(${sizes.orbitRadius}px) rotate(0deg);
          }
          to { 
            transform: translate(-50%, -50%) rotate(360deg) translateX(${sizes.orbitRadius}px) rotate(-360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 30s linear infinite;
        }
        .animate-orbit {
          animation: orbit 4s linear infinite;
        }
      `}</style>
    </>
  );
};

export default GalaxyAnimation;