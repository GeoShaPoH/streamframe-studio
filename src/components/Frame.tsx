import React, { useMemo } from "react";
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

  // Generar líneas decorativas aleatorias
  const decorativeLines = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        side: Math.floor(i / 3), // 0: top, 1: right, 2: bottom, 3: left
        position: 20 + (i % 3) * 30, // 20%, 50%, 80%
        length: 15 + Math.random() * 25,
        thickness: 1 + Math.random() * 2,
        speed: 2 + Math.random() * 4,
        delay: Math.random() * 5,
        isAccent: Math.random() > 0.6,
      })),
    []
  );

  // Esquinas tech con detalles
  const techCorners = useMemo(
    () =>
      ["top-left", "top-right", "bottom-left", "bottom-right"].map(
        (position, i) => ({
          position,
          id: i,
          elements: Array.from({ length: 3 }, (_, j) => ({
            type: j % 3, // 0: line, 1: dot, 2: small rect
            offset: j * 8 + 5,
            size: 2 + j,
            speed: 3 + j * 0.5,
            delay: i * 0.5 + j * 0.2,
          })),
        })
      ),
    []
  );

  // Personaje animado que recorre el marco
  const characterPositions = [
    { corner: "top-left", x: 15, y: 15, rotation: 45 },
    { corner: "top-right", x: 85, y: 15, rotation: 135 },
    { corner: "bottom-right", x: 85, y: 85, rotation: 225 },
    { corner: "bottom-left", x: 15, y: 85, rotation: 315 },
  ];

  const renderCharacter = () => (
    <div className="absolute inset-0 pointer-events-none">
      {characterPositions.map((pos, i) => (
        <div
          key={`character-${i}`}
          className="absolute animate-character-appear"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
            animationDelay: `${i * 4}s`,
            animationDuration: "16s",
          }}
        >
          {/* Cuerpo del personaje */}
          <div className="relative">
            {/* Cabeza */}
            <div
              className="animate-character-bounce"
              style={{
                width: `${6 * scale}px`,
                height: `${6 * scale}px`,
                background: `radial-gradient(circle at 30% 30%, #ffffff, ${theme.primary})`,
                borderRadius: "50%",
                border: `1px solid ${theme.accent || "#ffffff"}`,
                boxShadow: `0 0 ${8 * scale}px ${theme.glow}`,
                position: "relative",
                marginBottom: `${2 * scale}px`,
              }}
            >
              {/* Ojos */}
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  left: "20%",
                  width: "15%",
                  height: "15%",
                  background: "#000",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "25%",
                  right: "20%",
                  width: "15%",
                  height: "15%",
                  background: "#000",
                  borderRadius: "50%",
                }}
              />
              {/* Sonrisa */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "40%",
                  height: "20%",
                  border: `1px solid #000`,
                  borderTop: "none",
                  borderRadius: "0 0 20px 20px",
                }}
              />
            </div>

            {/* Cuerpo */}
            <div
              className="animate-character-wiggle"
              style={{
                width: `${4 * scale}px`,
                height: `${8 * scale}px`,
                background: `linear-gradient(45deg, ${theme.secondary}, ${theme.primary})`,
                borderRadius: `${2 * scale}px`,
                border: `1px solid ${theme.accent || "#ffffff"}`,
                position: "relative",
                margin: "0 auto",
              }}
            >
              {/* Brazos */}
              <div
                className="animate-character-wave"
                style={{
                  position: "absolute",
                  top: "20%",
                  left: `-${2 * scale}px`,
                  width: `${2 * scale}px`,
                  height: `${1 * scale}px`,
                  background: theme.accent || "#ffffff",
                  borderRadius: `${1 * scale}px`,
                }}
              />
              <div
                className="animate-character-wave"
                style={{
                  position: "absolute",
                  top: "20%",
                  right: `-${2 * scale}px`,
                  width: `${2 * scale}px`,
                  height: `${1 * scale}px`,
                  background: theme.accent || "#ffffff",
                  borderRadius: `${1 * scale}px`,
                  animationDelay: "0.5s",
                }}
              />
            </div>

            {/* Partículas de saludo */}
            <div className="absolute inset-0">
              {Array.from({ length: 4 }, (_, j) => (
                <div
                  key={`hello-particle-${j}`}
                  className="absolute animate-hello-particles"
                  style={{
                    width: `${1 * scale}px`,
                    height: `${1 * scale}px`,
                    background:
                      j % 2 === 0 ? theme.accent || "#ffffff" : theme.glow,
                    borderRadius: "50%",
                    left: `${-2 + j * 2}px`,
                    top: `${-2 + j}px`,
                    animationDelay: `${j * 0.2}s`,
                    boxShadow: `0 0 ${3 * scale}px currentColor`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
          className="absolute inset-0 animate-frame-pulse"
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
          {/* Líneas decorativas en los bordes */}
          {decorativeLines.map((line) => {
            const sideStyles = [
              // Top
              {
                top: 0,
                left: `${line.position}%`,
                width: `${line.length}px`,
                height: `${line.thickness}px`,
                transformOrigin: "left center",
              },
              // Right
              {
                top: `${line.position}%`,
                right: 0,
                width: `${line.thickness}px`,
                height: `${line.length}px`,
                transformOrigin: "center top",
              },
              // Bottom
              {
                bottom: 0,
                left: `${line.position}%`,
                width: `${line.length}px`,
                height: `${line.thickness}px`,
                transformOrigin: "left center",
              },
              // Left
              {
                top: `${line.position}%`,
                left: 0,
                width: `${line.thickness}px`,
                height: `${line.length}px`,
                transformOrigin: "center top",
              },
            ];

            return (
              <div
                key={`deco-line-${line.id}`}
                className="absolute animate-decorative-line"
                style={{
                  ...sideStyles[line.side],
                  background: line.isAccent
                    ? `linear-gradient(90deg, ${
                        theme.accent || "#ffffff"
                      }, transparent)`
                    : `linear-gradient(90deg, ${theme.primary}, ${theme.glow}, transparent)`,
                  animationDuration: `${line.speed}s`,
                  animationDelay: `${line.delay}s`,
                  opacity: 0.8,
                }}
              />
            );
          })}

          {/* Esquinas tech modernas */}
          {techCorners.map((corner) => {
            const isTop = corner.position.includes("top");
            const isLeft = corner.position.includes("left");

            return (
              <div
                key={`tech-corner-${corner.id}`}
                className="absolute"
                style={{
                  [isTop ? "top" : "bottom"]: `${8 * scale}px`,
                  [isLeft ? "left" : "right"]: `${8 * scale}px`,
                  width: `${30 * scale}px`,
                  height: `${30 * scale}px`,
                }}
              >
                {corner.elements.map((element, j) => {
                  if (element.type === 0) {
                    // Línea
                    return (
                      <div
                        key={`tech-line-${j}`}
                        className="absolute animate-tech-element"
                        style={{
                          width: `${12 * scale}px`,
                          height: `${1 * scale}px`,
                          background: j % 2 === 0 ? "#ffffff" : theme.primary,
                          [isTop ? "top" : "bottom"]: `${element.offset}px`,
                          [isLeft ? "left" : "right"]: 0,
                          animationDuration: `${element.speed}s`,
                          animationDelay: `${element.delay}s`,
                          boxShadow: `0 0 ${3 * scale}px currentColor`,
                        }}
                      />
                    );
                  } else if (element.type === 1) {
                    // Punto
                    return (
                      <div
                        key={`tech-dot-${j}`}
                        className="absolute animate-tech-pulse"
                        style={{
                          width: `${element.size * scale}px`,
                          height: `${element.size * scale}px`,
                          background:
                            j % 2 === 0 ? theme.accent || "#ffffff" : "#000000",
                          borderRadius: "50%",
                          [isTop ? "top" : "bottom"]: `${element.offset}px`,
                          [isLeft ? "left" : "right"]: `${element.offset}px`,
                          animationDuration: `${element.speed}s`,
                          animationDelay: `${element.delay}s`,
                          border: `1px solid ${theme.primary}`,
                          boxShadow: `0 0 ${5 * scale}px ${theme.glow}`,
                        }}
                      />
                    );
                  } else {
                    // Rectángulo pequeño
                    return (
                      <div
                        key={`tech-rect-${j}`}
                        className="absolute animate-tech-slide"
                        style={{
                          width: `${element.size * 2 * scale}px`,
                          height: `${element.size * scale}px`,
                          background: `linear-gradient(45deg, #000000, ${theme.primary}, #ffffff)`,
                          [isTop ? "top" : "bottom"]: `${element.offset + 5}px`,
                          [isLeft ? "left" : "right"]: `${
                            element.offset - 5
                          }px`,
                          animationDuration: `${element.speed}s`,
                          animationDelay: `${element.delay}s`,
                          border: `1px solid ${theme.accent || "#ffffff"}`,
                          borderRadius: `${1 * scale}px`,
                        }}
                      />
                    );
                  }
                })}
              </div>
            );
          })}

          {/* Barras de progreso falsas en las esquinas */}
          <div
            className="absolute top-4 left-4"
            style={{ transform: `scale(${scale})` }}
          >
            <div
              className="animate-progress-bar"
              style={{
                width: "40px",
                height: "3px",
                background: "#000000",
                borderRadius: "2px",
                overflow: "hidden",
                border: `1px solid ${theme.primary}`,
              }}
            >
              <div
                className="animate-progress-fill"
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${theme.primary}, ${
                    theme.accent || "#ffffff"
                  })`,
                  width: "0%",
                  borderRadius: "1px",
                }}
              />
            </div>
          </div>

          <div
            className="absolute bottom-4 right-4"
            style={{ transform: `scale(${scale})` }}
          >
            <div
              className="animate-progress-bar-2"
              style={{
                width: "35px",
                height: "3px",
                background: "#000000",
                borderRadius: "2px",
                overflow: "hidden",
                border: `1px solid ${theme.secondary}`,
              }}
            >
              <div
                className="animate-progress-fill-2"
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${theme.secondary}, #ffffff)`,
                  width: "0%",
                  borderRadius: "1px",
                }}
              />
            </div>
          </div>

          {/* Personaje animado */}
          {renderCharacter()}

          {/* Contenido del marco */}
          {children}
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>{`
        /* Animaciones del marco */
        .animate-frame-pulse {
          animation: frame-pulse 4s ease-in-out infinite alternate;
        }
        
        .animate-decorative-line {
          animation: decorative-line 6s ease-in-out infinite;
        }
        
        .animate-tech-element {
          animation: tech-element 3s ease-in-out infinite alternate;
        }
        
        .animate-tech-pulse {
          animation: tech-pulse 2s ease-in-out infinite;
        }
        
        .animate-tech-slide {
          animation: tech-slide 4s ease-in-out infinite;
        }
        
        /* Animaciones de progreso */
        .animate-progress-bar {
          animation: progress-bar 8s ease-in-out infinite;
        }
        
        .animate-progress-fill {
          animation: progress-fill 8s ease-in-out infinite;
        }
        
        .animate-progress-bar-2 {
          animation: progress-bar-2 10s ease-in-out infinite;
        }
        
        .animate-progress-fill-2 {
          animation: progress-fill-2 10s ease-in-out infinite;
        }
        
        /* Animaciones del personaje */
        .animate-character-appear {
          animation: character-appear 16s ease-in-out infinite;
        }
        
        .animate-character-bounce {
          animation: character-bounce 0.8s ease-in-out infinite alternate;
        }
        
        .animate-character-wiggle {
          animation: character-wiggle 1.2s ease-in-out infinite;
        }
        
        .animate-character-wave {
          animation: character-wave 0.6s ease-in-out infinite alternate;
        }
        
        .animate-hello-particles {
          animation: hello-particles 2s ease-in-out infinite;
        }

        @keyframes frame-pulse {
          0% { filter: brightness(1) blur(${4 * scale}px); }
          100% { filter: brightness(1.2) blur(${2 * scale}px); }
        }
        
        @keyframes decorative-line {
          0% { transform: scaleX(0); opacity: 0.8; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0); opacity: 0.8; }
        }
        
        @keyframes tech-element {
          0% { opacity: 0.6; transform: translateX(0px); }
          100% { opacity: 1; transform: translateX(${3 * scale}px); }
        }
        
        @keyframes tech-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        @keyframes tech-slide {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          25% { transform: translateY(-${
            2 * scale
          }px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(0px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(${
            2 * scale
          }px) rotate(270deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.7; }
        }
        
        @keyframes progress-bar {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes progress-fill {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 0%; }
        }
        
        @keyframes progress-bar-2 {
          0% { opacity: 0.7; }
          60% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes progress-fill-2 {
          0% { width: 0%; }
          70% { width: 100%; }
          100% { width: 0%; }
        }
        
        @keyframes character-appear {
          0%, 85% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          90% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          95% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
        }
        
        @keyframes character-bounce {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-${1 * scale}px); }
        }
        
        @keyframes character-wiggle {
          0% { transform: rotate(-2deg); }
          25% { transform: rotate(2deg); }
          50% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
          100% { transform: rotate(-2deg); }
        }
        
        @keyframes character-wave {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(10deg); }
        }
        
        @keyframes hello-particles {
          0% { 
            opacity: 0; 
            transform: translate(0px, 0px) scale(0); 
          }
          20% { 
            opacity: 1; 
            transform: translate(${2 * scale}px, -${2 * scale}px) scale(1); 
          }
          80% { 
            opacity: 1; 
            transform: translate(${4 * scale}px, -${4 * scale}px) scale(1.2); 
          }
          100% { 
            opacity: 0; 
            transform: translate(${6 * scale}px, -${6 * scale}px) scale(0); 
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
    </div>
  );
};

export default Frame;
