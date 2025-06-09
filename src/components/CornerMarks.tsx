import React from "react";
import { ThemeType } from "../App";
import { sizeConfig } from "../utils/sizeConfig";

interface CornerMarksProps {
  theme: ThemeType;
  scale?: number;
}

const CornerMarks: React.FC<CornerMarksProps> = ({ theme, scale = 1 }) => {
  // Tamaños aumentados y mejorados
  const sizes = {
    longLine: sizeConfig.cornerMarks.longLine * scale * 2, // 100% más grande
    shortLine: sizeConfig.cornerMarks.shortLine * scale * 2, // 100% más grande
    spacing: sizeConfig.cornerMarks.spacing * scale,
    thickness: sizeConfig.cornerMarks.thickness * scale * 2, // Mucho más grueso
    innerSpacing: sizeConfig.cornerMarks.innerSpacing * scale * 1.5,
    glowSize: 15 * scale, // Glow mucho más grande y notorio
    pulsePointSize: 6 * scale, // Puntos de intersección más grandes
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
        {/* Línea principal horizontal */}
        <div
          className="absolute animate-corner-glow"
          style={{
            background: theme.primary,
            width: `${sizes.longLine}px`,
            height: `${sizes.thickness}px`,
            [isLeft ? "left" : "right"]: 0,
            [isTop ? "top" : "bottom"]: 0,
            boxShadow: `0 0 ${sizes.glowSize}px ${theme.glow}`,
            borderRadius: `${sizes.thickness / 2}px`,
          }}
        />

        {/* Línea principal vertical */}
        <div
          className="absolute animate-corner-glow"
          style={{
            background: theme.primary,
            width: `${sizes.thickness}px`,
            height: `${sizes.longLine}px`,
            [isLeft ? "left" : "right"]: 0,
            [isTop ? "top" : "bottom"]: 0,
            boxShadow: `0 0 ${sizes.glowSize}px ${theme.glow}`,
            borderRadius: `${sizes.thickness / 2}px`,
          }}
        />

        {/* Línea secundaria horizontal */}
        <div
          className="absolute animate-corner-glow-secondary"
          style={{
            background: theme.primary,
            opacity: 0.7,
            width: `${sizes.shortLine}px`,
            height: `${sizes.thickness * 0.8}px`,
            [isLeft ? "left" : "right"]: 0,
            [isTop ? "top" : "bottom"]: `${sizes.innerSpacing}px`,
            boxShadow: `0 0 ${sizes.glowSize * 0.7}px ${theme.glow}`,
            borderRadius: `${sizes.thickness / 2}px`,
          }}
        />

        {/* Línea secundaria vertical */}
        <div
          className="absolute animate-corner-glow-secondary"
          style={{
            background: theme.primary,
            opacity: 0.7,
            width: `${sizes.thickness * 0.8}px`,
            height: `${sizes.shortLine}px`,
            [isLeft ? "left" : "right"]: `${sizes.innerSpacing}px`,
            [isTop ? "top" : "bottom"]: 0,
            boxShadow: `0 0 ${sizes.glowSize * 0.7}px ${theme.glow}`,
            borderRadius: `${sizes.thickness / 2}px`,
          }}
        />

        {/* Punto de intersección con pulso especial - MÁS GRANDE */}
        <div
          className="absolute animate-corner-pulse"
          style={{
            background: theme.accent || theme.primary,
            width: `${sizes.pulsePointSize}px`,
            height: `${sizes.pulsePointSize}px`,
            [isLeft ? "left" : "right"]: `-${sizes.pulsePointSize * 0.5}px`,
            [isTop ? "top" : "bottom"]: `-${sizes.pulsePointSize * 0.5}px`,
            borderRadius: "50%",
            boxShadow: `0 0 ${sizes.glowSize * 2}px ${
              theme.accent || theme.primary
            }`,
          }}
        />

        {/* Efecto de destello ocasional - MÁS GRANDE */}
        <div
          className="animate-corner-flash"
          style={{
            position: "absolute",
            background: `radial-gradient(circle, ${
              theme.accent || theme.primary
            }90, ${theme.glow}50, transparent 70%)`,
            width: `${sizes.longLine * 1.2}px`,
            height: `${sizes.longLine * 1.2}px`,
            [isLeft ? "left" : "right"]: `-${sizes.longLine * 0.4}px`,
            [isTop ? "top" : "bottom"]: `-${sizes.longLine * 0.4}px`,
            borderRadius: "50%",
            opacity: 0,
            pointerEvents: "none",
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

      {/* Estilos CSS para las animaciones */}
      <style>{`
        /* Animación de respiración principal para las líneas */
        .animate-corner-glow {
          animation: corner-breathing 2.5s ease-in-out infinite alternate;
        }
        
        /* Animación de respiración secundaria con delay */
        .animate-corner-glow-secondary {
          animation: corner-breathing-secondary 3s ease-in-out infinite alternate;
          animation-delay: 0.8s;
        }
        
        /* Pulso del punto de intersección */
        .animate-corner-pulse {
          animation: corner-pulse 1.8s ease-in-out infinite;
        }
        
        /* Destello ocasional */
        .animate-corner-flash {
          animation: corner-flash 6s ease-in-out infinite;
        }

        @keyframes corner-breathing {
          0% { 
            box-shadow: 0 0 ${sizes.glowSize}px ${theme.glow}, 0 0 ${
        sizes.glowSize * 2
      }px ${theme.glow}60;
            filter: brightness(1) saturate(1);
            transform: scale(1);
          }
          100% { 
            box-shadow: 0 0 ${sizes.glowSize * 3}px ${theme.glow}, 0 0 ${
        sizes.glowSize * 5
      }px ${theme.glow}80, 0 0 ${sizes.glowSize * 8}px ${theme.primary}40;
            filter: brightness(1.4) saturate(1.3);
            transform: scale(1.05);
          }
        }
        
        @keyframes corner-breathing-secondary {
          0% { 
            box-shadow: 0 0 ${sizes.glowSize * 0.8}px ${theme.glow}, 0 0 ${
        sizes.glowSize * 1.5
      }px ${theme.glow}50;
            opacity: 0.7;
            filter: brightness(1);
          }
          100% { 
            box-shadow: 0 0 ${sizes.glowSize * 2.5}px ${theme.glow}, 0 0 ${
        sizes.glowSize * 4
      }px ${theme.glow}70, 0 0 ${sizes.glowSize * 6}px ${theme.primary}50;
            opacity: 1;
            filter: brightness(1.3);
          }
        }
        
        @keyframes corner-pulse {
          0% { 
            transform: scale(1);
            box-shadow: 0 0 ${sizes.glowSize * 2}px ${
        theme.accent || theme.primary
      }, 0 0 ${sizes.glowSize * 3}px ${theme.accent || theme.primary}60;
          }
          50% { 
            transform: scale(1.8);
            box-shadow: 0 0 ${sizes.glowSize * 4}px ${
        theme.accent || theme.primary
      }, 0 0 ${sizes.glowSize * 7}px ${theme.accent || theme.primary}80, 0 0 ${
        sizes.glowSize * 10
      }px ${theme.primary}30;
          }
          100% { 
            transform: scale(1);
            box-shadow: 0 0 ${sizes.glowSize * 2}px ${
        theme.accent || theme.primary
      }, 0 0 ${sizes.glowSize * 3}px ${theme.accent || theme.primary}60;
          }
        }
        
        @keyframes corner-flash {
          0%, 85%, 100% { 
            opacity: 0;
            transform: scale(0.8);
          }
          90% { 
            opacity: 0.8;
            transform: scale(1.5);
          }
          95% { 
            opacity: 0.4;
            transform: scale(2);
          }
        }
        
        /* Reducir animaciones si el usuario prefiere menos movimiento */
        @media (prefers-reduced-motion: reduce) {
          .animate-corner-glow,
          .animate-corner-glow-secondary,
          .animate-corner-pulse,
          .animate-corner-flash {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CornerMarks;
