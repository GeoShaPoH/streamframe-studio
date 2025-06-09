import React, { useMemo } from "react";
import { Sparkles, Star, Circle, Zap } from "lucide-react";
import { ThemeType } from "../App";
import { sizeConfig } from "../utils/sizeConfig";

interface GalaxyAnimationProps {
  theme: ThemeType;
  scale?: number;
  starCount?: number;
  backgroundStarCount?: number;
  showNebulaEffect?: boolean;
  showComets?: boolean;
  showParticles?: boolean;
}

const GalaxyAnimation: React.FC<GalaxyAnimationProps> = ({
  theme,
  scale = 1,
  starCount = 8,
  backgroundStarCount = 25,
  showNebulaEffect = true,
  showComets = true,
  showParticles = true,
}) => {
  const sizes = useMemo(
    () => ({
      planetSize: sizeConfig.galaxy.planetSize * scale,
      ringWidth: sizeConfig.galaxy.ringWidth * scale,
      ringHeight: sizeConfig.galaxy.ringHeight * scale,
      starSize: sizeConfig.galaxy.starSize * scale,
      position: sizeConfig.galaxy.position * scale,
      orbitRadius: 40 * scale,
      nebulaSize: 200 * scale,
      particleSize: 1 * scale,
    }),
    [scale]
  );

  // Configuración de anillos tipo Saturno
  const saturnRings = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        width: sizes.ringWidth + i * 15 * scale,
        height: sizes.ringHeight + i * 8 * scale,
        opacity: 0.8 - i * 0.15,
        speed: 30 + i * 10,
        reverse: i % 2 === 1,
        angle: 75 + i * 2,
        gradient: i % 3,
      })),
    [sizes.ringWidth, sizes.ringHeight, scale]
  );

  // Muchas más estrellas de fondo con diferentes capas
  const backgroundStars = useMemo(
    () =>
      Array.from({ length: backgroundStarCount }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        delay: Math.random() * 6,
        size: 0.3 + Math.random() * 1.2,
        layer: Math.floor(i / (backgroundStarCount / 3)), // 3 capas
        color: i % 4,
        twinkleSpeed: 1.5 + Math.random() * 2,
      })),
    [backgroundStarCount]
  );

  // Estrellas orbitando con diferentes patrones
  const orbitingStars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        radius: sizes.orbitRadius + i * 15 * scale,
        delay: i * 1.8 + Math.random() * 2,
        speed: 3 + i * 0.5 + Math.random() * 2,
        icon: [Sparkles, Star, Circle, Zap][i % 4],
        orbit: i % 3, // Diferentes tipos de órbita
        size: 0.7 + i * 0.15,
      })),
    [starCount, sizes.orbitRadius, scale]
  );

  // Partículas flotantes
  const particles = useMemo(
    () =>
      showParticles
        ? Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 250,
            y: (Math.random() - 0.5) * 250,
            delay: Math.random() * 8,
            speed: 8 + Math.random() * 12,
            size: 0.5 + Math.random() * 1,
            direction: Math.random() * 360,
          }))
        : [],
    [showParticles]
  );

  // Cometas ocasionales
  const comets = useMemo(
    () =>
      showComets
        ? Array.from({ length: 3 }, (_, i) => ({
            id: i,
            delay: i * 6 + Math.random() * 4,
            speed: 2 + Math.random(),
            angle: Math.random() * 360,
            size: 0.8 + Math.random() * 0.4,
          }))
        : [],
    [showComets]
  );

  const getStarColor = (colorIndex: number) => {
    const colors = [theme.accent, theme.secondary, theme.primary, theme.glow];
    return colors[colorIndex];
  };

  const getRingGradient = (gradientType: number) => {
    const gradients = [
      `linear-gradient(90deg, transparent, ${theme.primary}70, ${theme.accent}50, ${theme.primary}70, transparent)`,
      `linear-gradient(90deg, transparent, ${theme.secondary}60, ${theme.glow}40, ${theme.secondary}60, transparent)`,
      `linear-gradient(90deg, transparent, ${theme.accent}50, ${theme.primary}60, ${theme.accent}50, transparent)`,
    ];
    return gradients[gradientType];
  };

  return (
    <>
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{
          top: `${sizes.position - 50}px`,
          right: `${sizes.position - 50}px`,
          width: `${sizes.nebulaSize}px`,
          height: `${sizes.nebulaSize}px`,
        }}
      >
        {/* Nebulosas múltiples con diferentes colores */}
        {showNebulaEffect && (
          <>
            <div
              className="absolute inset-0 animate-nebula-1 opacity-20"
              style={{
                background: `radial-gradient(ellipse at 30% 30%, ${theme.glow}30, transparent 70%)`,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0 animate-nebula-2 opacity-15"
              style={{
                background: `radial-gradient(ellipse at 70% 60%, ${theme.primary}25, transparent 60%)`,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0 animate-nebula-3 opacity-25"
              style={{
                background: `radial-gradient(circle at 50% 80%, ${theme.accent}20, transparent 50%)`,
                borderRadius: "50%",
              }}
            />
          </>
        )}

        {/* Campo de estrellas de fondo en múltiples capas */}
        {backgroundStars.map((star) => (
          <div
            key={`bg-star-${star.id}`}
            className={`absolute animate-twinkle-${star.layer + 1}`}
            style={{
              left: `${50 + (star.x / sizes.nebulaSize) * 100}%`,
              top: `${50 + (star.y / sizes.nebulaSize) * 100}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.twinkleSpeed}s`,
              transform: "translate(-50%, -50%)",
              zIndex: star.layer,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: `${star.size * 2 * scale}px`,
                height: `${star.size * 2 * scale}px`,
                backgroundColor: getStarColor(star.color),
                boxShadow: `0 0 ${star.size * 6 * scale}px ${getStarColor(
                  star.color
                )}`,
              }}
            />
          </div>
        ))}

        {/* Partículas flotantes */}
        {particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className="absolute animate-float"
            style={
              {
                left: `${50 + (particle.x / sizes.nebulaSize) * 100}%`,
                top: `${50 + (particle.y / sizes.nebulaSize) * 100}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.speed}s`,
                "--float-direction": `${particle.direction}deg`,
              } as React.CSSProperties & { "--float-direction": string }
            }
          >
            <div
              className="rounded-full opacity-60"
              style={{
                width: `${particle.size * sizes.particleSize}px`,
                height: `${particle.size * sizes.particleSize}px`,
                backgroundColor: theme.glow,
                boxShadow: `0 0 ${particle.size * 3}px ${theme.glow}`,
              }}
            />
          </div>
        ))}

        {/* Cometas */}
        {comets.map((comet) => (
          <div
            key={`comet-${comet.id}`}
            className="absolute animate-comet"
            style={
              {
                left: "50%",
                top: "50%",
                animationDelay: `${comet.delay}s`,
                animationDuration: `${comet.speed * 8}s`,
                "--comet-angle": `${comet.angle}deg`,
              } as React.CSSProperties & { "--comet-angle": string }
            }
          >
            <div
              className="relative"
              style={{
                width: `${comet.size * 3 * scale}px`,
                height: `${comet.size * 3 * scale}px`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${theme.accent}, transparent 70%)`,
                  boxShadow: `0 0 ${comet.size * 10 * scale}px ${theme.accent}`,
                }}
              />
              <div
                className="absolute top-1/2 left-full h-px animate-comet-tail"
                style={{
                  width: `${comet.size * 20 * scale}px`,
                  background: `linear-gradient(90deg, ${theme.accent}80, transparent)`,
                  transform: "translateY(-50%)",
                }}
              />
            </div>
          </div>
        ))}

        {/* Contenedor del sistema planetario */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: `${sizes.planetSize}px`,
              height: `${sizes.planetSize}px`,
            }}
          >
            {/* Múltiples atmósferas */}
            <div
              className="absolute inset-0 rounded-full animate-pulse-glow-1"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${theme.glow}50, transparent 60%)`,
                transform: `scale(1.4)`,
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-pulse-glow-2"
              style={{
                background: `radial-gradient(circle at 65% 25%, ${theme.primary}30, transparent 50%)`,
                transform: `scale(1.6)`,
              }}
            />

            {/* Planeta principal con múltiples capas */}
            <div
              className="absolute inset-0 rounded-full animate-spin-slow overflow-hidden"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, ${theme.secondary}dd, ${theme.primary}),
                  conic-gradient(from 0deg, ${theme.primary}, ${theme.secondary}, ${theme.accent}, ${theme.primary})
                `,
                boxShadow: `
                  inset 0 0 ${25 * scale}px ${theme.primary}50,
                  0 0 ${35 * scale}px ${theme.glow},
                  0 0 ${60 * scale}px ${theme.glow}30,
                  0 0 ${90 * scale}px ${theme.primary}20
                `,
              }}
            >
              {/* Múltiples capas de superficie */}
              <div
                className="absolute inset-0 rounded-full animate-surface-detail-1"
                style={{
                  background: `
                    radial-gradient(circle at 60% 40%, ${theme.accent}30, transparent 35%),
                    radial-gradient(circle at 20% 70%, ${theme.secondary}40, transparent 30%),
                    radial-gradient(circle at 80% 20%, ${theme.glow}25, transparent 25%)
                  `,
                }}
              />
              <div
                className="absolute inset-0 rounded-full animate-surface-detail-2"
                style={{
                  background: `
                    radial-gradient(circle at 40% 80%, ${theme.primary}20, transparent 30%),
                    radial-gradient(circle at 90% 60%, ${theme.accent}15, transparent 20%)
                  `,
                }}
              />
            </div>

            {/* Sistema de anillos tipo Saturno */}
            {saturnRings.map((ring) => (
              <div
                key={`ring-${ring.id}`}
                className={`absolute inset-0 flex items-center justify-center ${
                  ring.reverse ? "animate-spin-reverse" : "animate-spin-forward"
                }`}
                style={{
                  animationDuration: `${ring.speed}s`,
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: `${ring.width}px`,
                    height: `${ring.height}px`,
                    background: getRingGradient(ring.gradient),
                    transform: `rotateX(${ring.angle}deg)`,
                    opacity: ring.opacity,
                    boxShadow: `0 0 ${5 * scale}px ${theme.primary}20`,
                  }}
                />
              </div>
            ))}

            {/* Estrellas orbitando con patrones variados */}
            {orbitingStars.map((star) => {
              const IconComponent = star.icon;
              return (
                <div
                  key={`orbit-star-${star.id}`}
                  className={`absolute animate-orbit-${star.orbit + 1}`}
                  style={
                    {
                      top: "50%",
                      left: "50%",
                      animationDelay: `${star.delay}s`,
                      animationDuration: `${star.speed}s`,
                      "--orbit-radius": `${star.radius}px`,
                    } as React.CSSProperties & { "--orbit-radius": string }
                  }
                >
                  <IconComponent
                    style={{
                      width: `${sizes.starSize * star.size}px`,
                      height: `${sizes.starSize * star.size}px`,
                      color: getStarColor(star.id % 4),
                      filter: `drop-shadow(0 0 ${8 * scale}px currentColor)`,
                      transform: `translate(-50%, -50%) translateX(var(--orbit-radius))`,
                    }}
                  />
                </div>
              );
            })}

            {/* Efectos de destello múltiples */}
            <div
              className="absolute inset-0 rounded-full animate-flash-1 opacity-0"
              style={{
                background: `radial-gradient(circle, ${theme.glow}90, transparent 50%)`,
                pointerEvents: "none",
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-flash-2 opacity-0"
              style={{
                background: `radial-gradient(circle, ${theme.accent}70, transparent 40%)`,
                pointerEvents: "none",
              }}
            />

            {/* Rayos de energía ocasionales */}
            <div
              className="absolute inset-0 animate-energy-burst opacity-0"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${theme.glow}40, transparent, ${theme.accent}30, transparent)`,
                borderRadius: "50%",
                transform: "scale(2)",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        /* Animaciones básicas mejoradas */
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-spin-forward { animation: spin-forward 25s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 35s linear infinite; }
        
        /* Órbitas variadas */
        .animate-orbit-1 { animation: orbit-1 var(--orbit-duration, 4s) linear infinite; }
        .animate-orbit-2 { animation: orbit-2 var(--orbit-duration, 4s) linear infinite; }
        .animate-orbit-3 { animation: orbit-3 var(--orbit-duration, 4s) linear infinite; }
        
        /* Efectos de brillo múltiples */
        .animate-pulse-glow-1 { animation: pulse-glow-1 4s ease-in-out infinite alternate; }
        .animate-pulse-glow-2 { animation: pulse-glow-2 6s ease-in-out infinite alternate; }
        
        /* Parpadeo de estrellas por capas */
        .animate-twinkle-1 { animation: twinkle 2s ease-in-out infinite alternate; }
        .animate-twinkle-2 { animation: twinkle-2 2.5s ease-in-out infinite alternate; }
        .animate-twinkle-3 { animation: twinkle-3 3s ease-in-out infinite alternate; }
        
        /* Nebulosas múltiples */
        .animate-nebula-1 { animation: nebula-1 12s ease-in-out infinite alternate; }
        .animate-nebula-2 { animation: nebula-2 16s ease-in-out infinite alternate; }
        .animate-nebula-3 { animation: nebula-3 10s ease-in-out infinite alternate; }
        
        /* Detalles de superficie */
        .animate-surface-detail-1 { animation: surface-detail-1 45s linear infinite; }
        .animate-surface-detail-2 { animation: surface-detail-2 60s linear infinite reverse; }
        
        /* Efectos especiales */
        .animate-flash-1 { animation: flash-1 12s ease-in-out infinite; }
        .animate-flash-2 { animation: flash-2 18s ease-in-out infinite; }
        .animate-energy-burst { animation: energy-burst 15s ease-in-out infinite; }
        
        /* Partículas y cometas */
        .animate-float { animation: float var(--float-duration, 10s) ease-in-out infinite; }
        .animate-comet { animation: comet var(--comet-duration, 16s) linear infinite; }
        .animate-comet-tail { animation: comet-tail 0.5s ease-in-out infinite alternate; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-forward {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
        }
        
        @keyframes orbit-2 {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(var(--orbit-radius)) scale(1.2); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) scale(1); }
        }
        
        @keyframes orbit-3 {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) rotateY(0deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(var(--orbit-radius)) rotateY(180deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) rotateY(360deg); }
        }
        
        @keyframes pulse-glow-1 {
          0% { opacity: 0.3; transform: scale(1.2); }
          100% { opacity: 0.7; transform: scale(1.5); }
        }
        
        @keyframes pulse-glow-2 {
          0% { opacity: 0.2; transform: scale(1.4) rotate(0deg); }
          100% { opacity: 0.5; transform: scale(1.8) rotate(20deg); }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }
        
        @keyframes twinkle-2 {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.6) rotate(0deg); }
          100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1) rotate(180deg); }
        }
        
        @keyframes twinkle-3 {
          0% { opacity: 0.5; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.7) rotate(90deg); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.4) rotate(180deg); }
        }
        
        @keyframes nebula-1 {
          0% { transform: rotate(0deg) scale(1); opacity: 0.15; }
          100% { transform: rotate(30deg) scale(1.2); opacity: 0.3; }
        }
        
        @keyframes nebula-2 {
          0% { transform: rotate(360deg) scale(0.9); opacity: 0.1; }
          100% { transform: rotate(320deg) scale(1.3); opacity: 0.25; }
        }
        
        @keyframes nebula-3 {
          0% { transform: rotate(180deg) scale(1.1); opacity: 0.2; }
          100% { transform: rotate(150deg) scale(0.8); opacity: 0.4; }
        }
        
        @keyframes surface-detail-1 {
          0% { transform: rotate(0deg); opacity: 0.6; }
          33% { opacity: 0.8; }
          66% { opacity: 0.4; }
          100% { transform: rotate(360deg); opacity: 0.6; }
        }
        
        @keyframes surface-detail-2 {
          0% { transform: rotate(0deg) scale(1); opacity: 0.4; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.7; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.4; }
        }
        
        @keyframes flash-1 {
          0%, 85%, 100% { opacity: 0; }
          90% { opacity: 0.8; }
        }
        
        @keyframes flash-2 {
          0%, 92%, 100% { opacity: 0; }
          95% { opacity: 0.6; }
        }
        
        @keyframes energy-burst {
          0%, 90%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
          95% { opacity: 0.7; transform: scale(3) rotate(180deg); }
        }
        
        @keyframes float {
          0% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(0px); }
          100% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(50px); }
        }
        
        @keyframes comet {
          0% { 
            transform: translate(-50%, -50%) rotate(var(--comet-angle)) translateX(-150px);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translate(-50%, -50%) rotate(var(--comet-angle)) translateX(150px);
            opacity: 0;
          }
        }
        
        @keyframes comet-tail {
          0% { opacity: 0.8; width: 100%; }
          100% { opacity: 0.3; width: 150%; }
        }
        
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

export default GalaxyAnimation;
