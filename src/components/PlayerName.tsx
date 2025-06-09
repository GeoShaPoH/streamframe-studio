import React from "react";
import { ThemeType } from "../App";
import { sizeConfig } from "../utils/sizeConfig";

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
  scale = 1,
}) => {
  const sizes = {
    paddingX: sizeConfig.playerName.padding.x * scale,
    paddingY: sizeConfig.playerName.padding.y * scale,
    position: sizeConfig.playerName.position * scale,
    borderRadius: sizeConfig.playerName.borderRadius,
    fontSize: parseInt(fontSize) * scale,
    glowSize: 25 * scale,
    textShadow: 15 * scale,
    borderWidth: 2 * scale,
  };

  const getPositionStyles = () => {
    const positions: { [key: string]: React.CSSProperties } = {
      "bottom-right": {
        bottom: `${sizes.position}px`,
        right: `${sizes.position}px`,
      },
      "bottom-left": {
        bottom: `${sizes.position}px`,
        left: `${sizes.position}px`,
      },
      "top-left": {
        top: `${
          sizes.position + sizeConfig.avatar.size * scale + 16 * scale
        }px`,
        left: `${sizes.position}px`,
      },
      "top-right": {
        top: `${
          sizes.position + sizeConfig.galaxy.planetSize * scale + 16 * scale
        }px`,
        right: `${sizes.position}px`,
      },
    };
    return positions[namePosition] || positions["bottom-right"];
  };

  // Función para renderizar cada letra con estilo individual
  const renderStyledName = (name: string) => {
    if (!name) return null;

    return name.split("").map((letter, index) => {
      const isFirstLetter = index === 0;
      return (
        <span
          key={index}
          className={`letter-${index} ${
            isFirstLetter ? "animate-first-letter-glow" : "animate-letter-glow"
          }`}
          style={{
            color: isFirstLetter ? theme.primary : "#ffffff",
            textShadow: isFirstLetter
              ? `
                0 0 ${sizes.textShadow * 1.5}px ${theme.glow},
                0 0 ${sizes.textShadow * 2.5}px ${theme.primary},
                0 0 ${sizes.textShadow * 4}px ${
                  theme.accent || theme.primary
                }80,
                3px 3px ${sizes.textShadow * 0.8}px rgba(0,0,0,1),
                5px 5px ${sizes.textShadow * 0.6}px rgba(0,0,0,0.9),
                -2px -2px ${sizes.textShadow * 0.4}px rgba(0,0,0,0.8),
                0 0 ${sizes.textShadow * 3}px ${theme.primary}60
              `
              : `
                0 0 ${sizes.textShadow * 1.2}px ${theme.glow}80,
                0 0 ${sizes.textShadow * 2}px ${theme.primary}50,
                0 0 ${sizes.textShadow * 3}px ${theme.glow}40,
                3px 3px ${sizes.textShadow * 0.7}px rgba(0,0,0,1),
                5px 5px ${sizes.textShadow * 0.5}px rgba(0,0,0,0.9),
                7px 7px ${sizes.textShadow * 0.4}px rgba(0,0,0,0.8),
                -2px -2px ${sizes.textShadow * 0.3}px rgba(0,0,0,0.7)
              `,
            display: "inline-block",
            transform: "translateZ(0)", // Optimización de rendering
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {letter}
        </span>
      );
    });
  };

  return (
    <>
      <div
        className="absolute animate-name-container-glow"
        style={getPositionStyles()}
      >
        {/* Contenedor principal simplificado */}
        <div
          className="relative animate-main-container"
          style={{
            padding: `${sizes.paddingY}px ${sizes.paddingX}px`,
            background: `rgba(0, 0, 0, 0.75)`, // Fondo sólido negro translúcido
            backdropFilter: "blur(10px)",
            borderRadius: `${8 * scale}px`, // Rectangular con esquinas redondeadas
            boxShadow: `
              0 0 ${sizes.glowSize}px ${theme.glow}80,
              0 0 ${sizes.glowSize * 1.5}px ${theme.primary}40,
              0 0 ${sizes.glowSize * 2}px ${theme.accent || theme.primary}20
            `,
            border: `1px solid ${theme.primary}40`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Partículas decorativas */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`particle-${i}`}
                className={`absolute animate-name-particles-${(i % 3) + 1}`}
                style={{
                  width: `${(1 + Math.random()) * scale}px`,
                  height: `${(1 + Math.random()) * scale}px`,
                  background:
                    i % 2 === 0 ? theme.accent || theme.primary : theme.glow,
                  borderRadius: "50%",
                  left: `${20 + i * 20}%`,
                  top: `${10 + (i % 2) * 70}%`,
                  boxShadow: `0 0 ${3 * scale}px currentColor`,
                  animationDelay: `${i * 0.8}s`,
                }}
              />
            ))}
          </div>

          {/* Texto principal con efectos por letra */}
          <p
            className="relative font-bold tracking-wider animate-text-container"
            style={{
              fontFamily: fontFamily,
              fontSize: `${sizes.fontSize}px`,
              margin: 0,
              position: "relative",
              zIndex: 10,
              filter: "contrast(1.1) brightness(1.05)",
            }}
          >
            {renderStyledName(playerName)}
          </p>

          {/* Efectos de destello ocasionales */}
          <div
            className="absolute inset-0 animate-name-flash opacity-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${
                theme.accent || theme.primary
              }40, transparent 70%)`,
              borderRadius: `${8 * scale}px`,
            }}
          />
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>{`
        /* Animaciones simplificadas */
        .animate-name-container-glow {
          animation: name-container-glow 4s ease-in-out infinite alternate;
        }
        
        .animate-main-container {
          animation: main-container 5s ease-in-out infinite alternate;
        }
        
        /* Animaciones de texto */
        .animate-text-container {
          animation: text-container 3.5s ease-in-out infinite alternate;
        }
        
        .animate-first-letter-glow {
          animation: first-letter-glow 2s ease-in-out infinite alternate;
        }
        
        .animate-letter-glow {
          animation: letter-glow 2.8s ease-in-out infinite alternate;
        }
        
        /* Animaciones de partículas */
        .animate-name-particles-1 {
          animation: name-particles-1 3s ease-in-out infinite;
        }
        
        .animate-name-particles-2 {
          animation: name-particles-2 4s ease-in-out infinite;
        }
        
        .animate-name-particles-3 {
          animation: name-particles-3 3.5s ease-in-out infinite;
        }
        
        /* Destello ocasional */
        .animate-name-flash {
          animation: name-flash 8s ease-in-out infinite;
        }

        @keyframes name-container-glow {
          0% { filter: brightness(1) saturate(1); }
          100% { filter: brightness(1.1) saturate(1.2); }
        }
        
        @keyframes main-container {
          0% { 
            transform: scale(1); 
            filter: brightness(1) saturate(1); 
          }
          100% { 
            transform: scale(1.02); 
            filter: brightness(1.05) saturate(1.1); 
          }
        }
        
        @keyframes text-container {
          0% { 
            transform: translateY(0px); 
            filter: contrast(1.1) brightness(1.05); 
          }
          100% { 
            transform: translateY(-${0.5 * scale}px); 
            filter: contrast(1.2) brightness(1.1); 
          }
        }
        
        @keyframes first-letter-glow {
          0% { 
            filter: brightness(1.2) saturate(1.2) drop-shadow(0 0 ${
              sizes.textShadow
            }px ${theme.glow}); 
            transform: scale(1); 
          }
          100% { 
            filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 ${
              sizes.textShadow * 1.5
            }px ${theme.primary}); 
            transform: scale(1.08); 
          }
        }
        
        @keyframes letter-glow {
          0% { 
            filter: brightness(1.1) saturate(1.1) drop-shadow(0 0 ${
              sizes.textShadow * 0.5
            }px ${theme.glow}60); 
            transform: scale(1); 
          }
          100% { 
            filter: brightness(1.3) saturate(1.3) drop-shadow(0 0 ${
              sizes.textShadow
            }px ${theme.primary}80); 
            transform: scale(1.04); 
          }
        }
        
        @keyframes name-particles-1 {
          0% { 
            opacity: 0.6; 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: translateY(-${3 * scale}px) rotate(180deg) scale(1.2); 
          }
          100% { 
            opacity: 0.6; 
            transform: translateY(0px) rotate(360deg) scale(1); 
          }
        }
        
        @keyframes name-particles-2 {
          0% { 
            opacity: 0.4; 
            transform: translateX(0px) rotate(0deg) scale(1); 
          }
          33% { 
            opacity: 0.8; 
            transform: translateX(${2 * scale}px) rotate(120deg) scale(1.3); 
          }
          66% { 
            opacity: 0.6; 
            transform: translateX(-${1 * scale}px) rotate(240deg) scale(0.8); 
          }
          100% { 
            opacity: 0.4; 
            transform: translateX(0px) rotate(360deg) scale(1); 
          }
        }
        
        @keyframes name-particles-3 {
          0% { 
            opacity: 0.7; 
            transform: translate(0px, 0px) rotate(0deg) scale(1); 
          }
          25% { 
            opacity: 1; 
            transform: translate(${1 * scale}px, -${
        2 * scale
      }px) rotate(90deg) scale(1.1); 
          }
          50% { 
            opacity: 0.5; 
            transform: translate(-${1 * scale}px, -${
        1 * scale
      }px) rotate(180deg) scale(0.9); 
          }
          75% { 
            opacity: 0.9; 
            transform: translate(${2 * scale}px, ${
        1 * scale
      }px) rotate(270deg) scale(1.2); 
          }
          100% { 
            opacity: 0.7; 
            transform: translate(0px, 0px) rotate(360deg) scale(1); 
          }
        }
        
        @keyframes name-flash {
          0%, 88%, 100% { 
            opacity: 0; 
            transform: scale(1); 
          }
          92% { 
            opacity: 0.6; 
            transform: scale(1.1); 
          }
          96% { 
            opacity: 0.3; 
            transform: scale(1.05); 
          }
        }
        
        /* Reducir animaciones si el usuario prefiere menos movimiento */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
};

export default PlayerName;
