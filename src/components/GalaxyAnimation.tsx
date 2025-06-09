import React, { useMemo } from "react";
import { Sparkles, Star, Circle, Zap, Diamond, Plus } from "lucide-react";
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
  starCount = 12,
  backgroundStarCount = 35,
  showNebulaEffect = true,
  showComets = true,
  showParticles = true,
}) => {
  const sizes = useMemo(
    () => ({
      // Saturno más grande y prominente
      saturnSize: sizeConfig.galaxy.planetSize * scale * 2.5, // Mucho más grande
      ringInnerRadius: 60 * scale,
      ringOuterRadius: 140 * scale,
      starSize: sizeConfig.galaxy.starSize * scale * 1.5,
      position: sizeConfig.galaxy.position * scale,
      orbitRadius: 50 * scale,
      nebulaSize: 280 * scale, // Área más grande
      particleSize: 2 * scale,
    }),
    [scale]
  );

  // Sistema de anillos de Saturno más complejo y realista
  const saturnRings = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        innerRadius: sizes.ringInnerRadius + i * 12 * scale,
        outerRadius:
          sizes.ringInnerRadius +
          (i + 1) * 12 * scale +
          Math.random() * 8 * scale,
        opacity: 0.9 - i * 0.08,
        speed: 40 + i * 8 + Math.random() * 10,
        reverse: i % 2 === 1,
        angle: 75 + i * 1.5 + Math.random() * 3,
        gradient: i % 4,
        particles: i % 3 === 0, // Algunos anillos tienen partículas
        thickness: 2 + Math.random() * 4,
      })),
    [sizes.ringInnerRadius, scale]
  );

  // Muchas más estrellas de fondo con diferentes tipos
  const backgroundStars = useMemo(
    () =>
      Array.from({ length: backgroundStarCount }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        delay: Math.random() * 8,
        size: 0.2 + Math.random() * 1.8,
        layer: Math.floor(i / (backgroundStarCount / 4)), // 4 capas
        color: i % 5,
        twinkleSpeed: 1 + Math.random() * 3,
        starType: Math.floor(Math.random() * 4), // Diferentes tipos de estrellas
      })),
    [backgroundStarCount]
  );

  // Estrellas orbitando con más variedad
  const orbitingStars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        radius: sizes.orbitRadius + i * 18 * scale,
        delay: i * 1.2 + Math.random() * 3,
        speed: 2.5 + i * 0.4 + Math.random() * 2,
        icon: [Sparkles, Star, Circle, Zap, Diamond, Plus][i % 6],
        orbit: i % 4, // Más tipos de órbita
        size: 0.8 + i * 0.12,
        brightness: 0.7 + Math.random() * 0.3,
      })),
    [starCount, sizes.orbitRadius, scale]
  );

  // Partículas flotantes más dinámicas
  const particles = useMemo(
    () =>
      showParticles
        ? Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 350,
            y: (Math.random() - 0.5) * 350,
            delay: Math.random() * 10,
            speed: 6 + Math.random() * 15,
            size: 0.3 + Math.random() * 1.5,
            direction: Math.random() * 360,
            type: Math.floor(Math.random() * 3), // Diferentes tipos de partículas
          }))
        : [],
    [showParticles]
  );

  // Cometas más espectaculares
  const comets = useMemo(
    () =>
      showComets
        ? Array.from({ length: 4 }, (_, i) => ({
            id: i,
            delay: i * 8 + Math.random() * 6,
            speed: 1.5 + Math.random() * 1.5,
            angle: Math.random() * 360,
            size: 1 + Math.random() * 0.5,
            tailLength: 15 + Math.random() * 25,
          }))
        : [],
    [showComets]
  );

  const getStarColor = (colorIndex: number) => {
    const colors = [
      theme.accent,
      theme.secondary,
      theme.primary,
      theme.glow,
      `${theme.primary}aa`,
    ];
    return colors[colorIndex];
  };

  const getRingGradient = (gradientType: number) => {
    const gradients = [
      `conic-gradient(from 0deg, transparent, ${theme.primary}90, ${theme.accent}70, ${theme.primary}90, transparent, ${theme.secondary}60, transparent)`,
      `conic-gradient(from 45deg, transparent, ${theme.secondary}80, ${theme.glow}60, ${theme.secondary}80, transparent)`,
      `conic-gradient(from 90deg, transparent, ${theme.accent}70, ${theme.primary}80, ${theme.accent}70, transparent)`,
      `conic-gradient(from 135deg, transparent, ${theme.glow}60, ${theme.primary}70, ${theme.glow}60, transparent)`,
    ];
    return gradients[gradientType];
  };

  const getStarIcon = (starType: number) => {
    const icons = ["✦", "✧", "⋆", "✯"];
    return icons[starType];
  };

  return (
    <>
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{
          top: `${sizes.position - 80}px`,
          right: `${sizes.position - 80}px`,
          width: `${sizes.nebulaSize}px`,
          height: `${sizes.nebulaSize}px`,
        }}
      >
        {/* Nebulosas múltiples mejoradas */}
        {showNebulaEffect && (
          <>
            <div
              className="absolute inset-0 animate-nebula-1 opacity-25"
              style={{
                background: `radial-gradient(ellipse 60% 40% at 25% 35%, ${theme.glow}40, ${theme.primary}20, transparent 70%)`,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0 animate-nebula-2 opacity-20"
              style={{
                background: `radial-gradient(ellipse 80% 50% at 75% 65%, ${theme.accent}35, ${theme.secondary}15, transparent 60%)`,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0 animate-nebula-3 opacity-30"
              style={{
                background: `radial-gradient(circle 40% at 50% 80%, ${theme.primary}25, transparent 50%)`,
                borderRadius: "50%",
              }}
            />
            <div
              className="absolute inset-0 animate-nebula-4 opacity-15"
              style={{
                background: `radial-gradient(ellipse 90% 30% at 40% 20%, ${theme.glow}30, transparent 40%)`,
                borderRadius: "50%",
              }}
            />
          </>
        )}

        {/* Campo de estrellas de fondo mejorado */}
        {backgroundStars.map((star) => (
          <div
            key={`bg-star-${star.id}`}
            className={`absolute animate-twinkle-${(star.layer % 4) + 1}`}
            style={{
              left: `${50 + (star.x / sizes.nebulaSize) * 100}%`,
              top: `${50 + (star.y / sizes.nebulaSize) * 100}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.twinkleSpeed}s`,
              transform: "translate(-50%, -50%)",
              zIndex: star.layer,
              fontSize: `${star.size * 8 * scale}px`,
              color: getStarColor(star.color),
              textShadow: `0 0 ${star.size * 10 * scale}px currentColor`,
            }}
          >
            {getStarIcon(star.starType)}
          </div>
        ))}

        {/* Partículas flotantes mejoradas */}
        {particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className={`absolute animate-float-${(particle.type % 3) + 1}`}
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
              className="rounded-full opacity-70"
              style={{
                width: `${particle.size * sizes.particleSize}px`,
                height: `${particle.size * sizes.particleSize}px`,
                backgroundColor: getStarColor(particle.type),
                boxShadow: `0 0 ${particle.size * 8}px currentColor`,
              }}
            />
          </div>
        ))}

        {/* Cometas mejorados */}
        {comets.map((comet) => (
          <div
            key={`comet-${comet.id}`}
            className="absolute animate-comet-enhanced"
            style={
              {
                left: "50%",
                top: "50%",
                animationDelay: `${comet.delay}s`,
                animationDuration: `${comet.speed * 12}s`,
                "--comet-angle": `${comet.angle}deg`,
              } as React.CSSProperties & { "--comet-angle": string }
            }
          >
            <div
              className="relative"
              style={{
                width: `${comet.size * 4 * scale}px`,
                height: `${comet.size * 4 * scale}px`,
              }}
            >
              {/* Núcleo del cometa */}
              <div
                className="absolute inset-0 rounded-full animate-comet-core"
                style={{
                  background: `radial-gradient(circle, ${theme.accent}, ${theme.primary}80, transparent 70%)`,
                  boxShadow: `0 0 ${comet.size * 15 * scale}px ${theme.accent}`,
                }}
              />
              {/* Cola del cometa */}
              <div
                className="absolute top-1/2 left-full h-px animate-comet-tail-enhanced"
                style={{
                  width: `${comet.tailLength * scale}px`,
                  background: `linear-gradient(90deg, ${theme.accent}90, ${theme.primary}60, ${theme.glow}30, transparent)`,
                  transform: "translateY(-50%)",
                  boxShadow: `0 0 ${comet.size * 3}px ${theme.accent}50`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Sistema planetario de Saturno mejorado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: `${sizes.saturnSize}px`,
              height: `${sizes.saturnSize}px`,
            }}
          >
            {/* Atmósfera múltiple de Saturno */}
            <div
              className="absolute inset-0 rounded-full animate-saturn-atmosphere-1"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${theme.glow}30, ${theme.primary}15, transparent 70%)`,
                transform: `scale(1.6)`,
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-saturn-atmosphere-2"
              style={{
                background: `radial-gradient(circle at 70% 40%, ${theme.accent}20, ${theme.secondary}10, transparent 60%)`,
                transform: `scale(1.8)`,
              }}
            />

            {/* Planeta Saturno principal */}
            <div
              className="absolute inset-0 rounded-full animate-saturn-rotation overflow-hidden"
              style={{
                background: `
                  radial-gradient(ellipse 80% 60% at 35% 35%, ${theme.secondary}ee, ${theme.primary}dd),
                  conic-gradient(from 0deg, ${theme.primary}ee, ${theme.accent}aa, ${theme.secondary}dd, ${theme.primary}ee),
                  linear-gradient(45deg, ${theme.primary}cc, ${theme.secondary}dd, ${theme.accent}88, ${theme.primary}cc)
                `,
                boxShadow: `
                  inset -${15 * scale}px -${15 * scale}px ${30 * scale}px ${
                  theme.primary
                }80,
                  inset ${10 * scale}px ${10 * scale}px ${20 * scale}px ${
                  theme.accent
                }40,
                  0 0 ${40 * scale}px ${theme.glow}80,
                  0 0 ${70 * scale}px ${theme.glow}50,
                  0 0 ${100 * scale}px ${theme.primary}30
                `,
              }}
            >
              {/* Bandas atmosféricas de Saturno */}
              <div
                className="absolute inset-0 rounded-full animate-saturn-bands-1"
                style={{
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent 0%,
                      ${theme.accent}15 10%,
                      transparent 20%,
                      ${theme.secondary}20 30%,
                      transparent 40%
                    )
                  `,
                }}
              />
              <div
                className="absolute inset-0 rounded-full animate-saturn-bands-2"
                style={{
                  background: `
                    repeating-linear-gradient(
                      15deg,
                      transparent 0%,
                      ${theme.primary}10 15%,
                      transparent 30%,
                      ${theme.glow}15 45%,
                      transparent 60%
                    )
                  `,
                }}
              />

              {/* Tormentas hexagonales */}
              <div
                className="absolute animate-saturn-storm"
                style={{
                  top: "20%",
                  right: "25%",
                  width: `${8 * scale}px`,
                  height: `${8 * scale}px`,
                  background: `radial-gradient(circle, ${theme.accent}80, transparent 70%)`,
                  borderRadius: "50%",
                }}
              />
              <div
                className="absolute animate-saturn-storm-2"
                style={{
                  bottom: "30%",
                  left: "35%",
                  width: `${6 * scale}px`,
                  height: `${6 * scale}px`,
                  background: `radial-gradient(circle, ${theme.glow}70, transparent 60%)`,
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Sistema de anillos de Saturno complejo */}
            {saturnRings.map((ring) => (
              <div
                key={`saturn-ring-${ring.id}`}
                className={`absolute inset-0 flex items-center justify-center ${
                  ring.reverse
                    ? "animate-saturn-ring-reverse"
                    : "animate-saturn-ring-forward"
                }`}
                style={{
                  animationDuration: `${ring.speed}s`,
                  transform: `rotateX(${ring.angle}deg)`,
                }}
              >
                <div
                  className="rounded-full border-solid animate-ring-shimmer"
                  style={{
                    width: `${ring.outerRadius * 2}px`,
                    height: `${ring.outerRadius * 2}px`,
                    borderWidth: `${ring.thickness}px`,
                    borderColor: "transparent",
                    background: getRingGradient(ring.gradient),
                    opacity: ring.opacity,
                    boxShadow: `
                      0 0 ${5 * scale}px ${theme.primary}30,
                      inset 0 0 ${10 * scale}px ${theme.glow}20
                    `,
                  }}
                />

                {/* Partículas en algunos anillos */}
                {ring.particles && (
                  <>
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={`ring-particle-${ring.id}-${i}`}
                        className="absolute animate-ring-particles"
                        style={{
                          width: "2px",
                          height: "2px",
                          background: theme.accent,
                          borderRadius: "50%",
                          left: "50%",
                          top: "50%",
                          transform: `rotate(${i * 45}deg) translateX(${
                            ring.outerRadius
                          }px)`,
                          animationDelay: `${i * 0.5}s`,
                          boxShadow: `0 0 4px ${theme.accent}`,
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            ))}

            {/* Estrellas orbitando mejoradas */}
            {orbitingStars.map((star) => {
              const IconComponent = star.icon;
              return (
                <div
                  key={`orbit-star-${star.id}`}
                  className={`absolute animate-orbit-enhanced-${
                    (star.orbit % 4) + 1
                  }`}
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
                      color: getStarColor(star.id % 5),
                      filter: `drop-shadow(0 0 ${
                        12 * scale
                      }px currentColor) brightness(${star.brightness})`,
                      transform: `translate(-50%, -50%) translateX(var(--orbit-radius))`,
                    }}
                  />
                </div>
              );
            })}

            {/* Efectos de destello mejorados */}
            <div
              className="absolute inset-0 rounded-full animate-saturn-flash-1 opacity-0"
              style={{
                background: `radial-gradient(circle, ${theme.glow}95, ${theme.accent}60, transparent 50%)`,
                pointerEvents: "none",
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-saturn-flash-2 opacity-0"
              style={{
                background: `radial-gradient(circle, ${theme.accent}80, ${theme.primary}40, transparent 40%)`,
                pointerEvents: "none",
              }}
            />

            {/* Ondas de energía */}
            <div
              className="absolute inset-0 animate-saturn-energy-wave opacity-0"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${theme.glow}60, transparent, ${theme.accent}40, transparent)`,
                borderRadius: "50%",
                transform: "scale(3)",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
 /* Animaciones básicas mejoradas */
        .animate-saturn-rotation { animation: saturn-rotation 45s linear infinite; }
        .animate-saturn-ring-forward { animation: saturn-ring-forward 20s linear infinite; }
        .animate-saturn-ring-reverse { animation: saturn-ring-reverse 30s linear infinite; }
        
        /* Órbitas mejoradas */
        .animate-orbit-enhanced-1 { animation: orbit-enhanced-1 var(--orbit-duration, 3s) linear infinite; }
        .animate-orbit-enhanced-2 { animation: orbit-enhanced-2 var(--orbit-duration, 3s) linear infinite; }
        .animate-orbit-enhanced-3 { animation: orbit-enhanced-3 var(--orbit-duration, 3s) linear infinite; }
        .animate-orbit-enhanced-4 { animation: orbit-enhanced-4 var(--orbit-duration, 3s) linear infinite; }
        
        /* Efectos atmosféricos de Saturno */
        .animate-saturn-atmosphere-1 { animation: saturn-atmosphere-1 6s ease-in-out infinite alternate; }
        .animate-saturn-atmosphere-2 { animation: saturn-atmosphere-2 8s ease-in-out infinite alternate; }
        .animate-saturn-bands-1 { animation: saturn-bands-1 60s linear infinite; }
        .animate-saturn-bands-2 { animation: saturn-bands-2 80s linear infinite reverse; }
        .animate-saturn-storm { animation: saturn-storm 12s ease-in-out infinite; }
        .animate-saturn-storm-2 { animation: saturn-storm-2 15s ease-in-out infinite; }
        
        /* Parpadeo de estrellas mejorado */
        .animate-twinkle-1 { animation: twinkle-enhanced-1 2s ease-in-out infinite alternate; }
        .animate-twinkle-2 { animation: twinkle-enhanced-2 2.8s ease-in-out infinite alternate; }
        .animate-twinkle-3 { animation: twinkle-enhanced-3 3.5s ease-in-out infinite alternate; }
        .animate-twinkle-4 { animation: twinkle-enhanced-4 2.2s ease-in-out infinite alternate; }
        
        /* Nebulosas mejoradas */
        .animate-nebula-1 { animation: nebula-enhanced-1 15s ease-in-out infinite alternate; }
        .animate-nebula-2 { animation: nebula-enhanced-2 20s ease-in-out infinite alternate; }
        .animate-nebula-3 { animation: nebula-enhanced-3 12s ease-in-out infinite alternate; }
        .animate-nebula-4 { animation: nebula-enhanced-4 18s ease-in-out infinite alternate; }
        
        /* Efectos especiales mejorados */
        .animate-saturn-flash-1 { animation: saturn-flash-1 15s ease-in-out infinite; }
        .animate-saturn-flash-2 { animation: saturn-flash-2 22s ease-in-out infinite; }
        .animate-saturn-energy-wave { animation: saturn-energy-wave 18s ease-in-out infinite; }
        
        /* Partículas y cometas mejorados */
        .animate-float-1 { animation: float-enhanced-1 var(--float-duration, 12s) ease-in-out infinite; }
        .animate-float-2 { animation: float-enhanced-2 var(--float-duration, 15s) ease-in-out infinite; }
        .animate-float-3 { animation: float-enhanced-3 var(--float-duration, 10s) ease-in-out infinite; }
        .animate-comet-enhanced { animation: comet-enhanced var(--comet-duration, 20s) linear infinite; }
        .animate-comet-core { animation: comet-core 1s ease-in-out infinite alternate; }
        .animate-comet-tail-enhanced { animation: comet-tail-enhanced 0.8s ease-in-out infinite alternate; }
        
        /* Anillos de Saturno */
        .animate-ring-shimmer { animation: ring-shimmer 4s ease-in-out infinite alternate; }
        .animate-ring-particles { animation: ring-particles 8s linear infinite; }

        @keyframes saturn-rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes saturn-ring-forward {
          from { transform: rotateX(75deg) rotate(0deg); }
          to { transform: rotateX(75deg) rotate(360deg); }
        }
        
        @keyframes saturn-ring-reverse {
          from { transform: rotateX(75deg) rotate(360deg); }
          to { transform: rotateX(75deg) rotate(0deg); }
        }
        
        @keyframes orbit-enhanced-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
        }
        
        @keyframes orbit-enhanced-2 {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) scale(1) rotateY(0deg); }
          25% { transform: translate(-50%, -50%) rotate(90deg) translateX(var(--orbit-radius)) scale(1.3) rotateY(90deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(var(--orbit-radius)) scale(1) rotateY(180deg); }
          75% { transform: translate(-50%, -50%) rotate(270deg) translateX(var(--orbit-radius)) scale(0.8) rotateY(270deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) scale(1) rotateY(360deg); }
        }
        
        @keyframes orbit-enhanced-3 {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) rotateZ(0deg); }
          33% { transform: translate(-50%, -50%) rotate(120deg) translateX(var(--orbit-radius)) rotateZ(120deg); }
          66% { transform: translate(-50%, -50%) rotate(240deg) translateX(var(--orbit-radius)) rotateZ(240deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) rotateZ(360deg); }
        }
        
        @keyframes orbit-enhanced-4 {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--orbit-radius)) skewX(0deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(var(--orbit-radius)) skewX(15deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) skewX(0deg); }
        }
        
        @keyframes saturn-atmosphere-1 {
          0% { opacity: 0.3; transform: scale(1.4) rotate(0deg); }
          100% { opacity: 0.6; transform: scale(1.8) rotate(30deg); }
        }
        
        @keyframes saturn-atmosphere-2 {
          0% { opacity: 0.2; transform: scale(1.6) rotate(360deg); }
          100% { opacity: 0.4; transform: scale(2) rotate(320deg); }
        }
        
        @keyframes saturn-bands-1 {
          0% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(180deg) scaleY(1.1); }
          100% { transform: rotate(360deg) scaleY(1); }
        }
        
        @keyframes saturn-bands-2 {
          0% { transform: rotate(0deg) scaleX(1); }
          33% { transform: rotate(120deg) scaleX(1.05); }
          66% { transform: rotate(240deg) scaleX(0.95); }
          100% { transform: rotate(360deg) scaleX(1); }
        }
        
        @keyframes saturn-storm {
          0% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
          100% { opacity: 0.6; transform: scale(1) rotate(360deg); }
        }
        
        @keyframes saturn-storm-2 {
          0% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          33% { opacity: 0.8; transform: scale(1.3) rotate(120deg); }
          66% { opacity: 0.6; transform: scale(0.8) rotate(240deg); }
          100% { opacity: 0.4; transform: scale(1) rotate(360deg); }
        }
        
        @keyframes twinkle-enhanced-1 {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.6) rotate(0deg); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.4) rotate(180deg); }
        }
        
        @keyframes twinkle-enhanced-2 {
          0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8) rotate(0deg); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.2) rotate(90deg); }
          100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1) rotate(180deg); }
        }
        
        @keyframes twinkle-enhanced-3 {
          0% { opacity: 0.5; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          25% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.3) rotate(45deg); }
          50% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.7) rotate(90deg); }
          75% { opacity: 1; transform: translate(-50%, -50%) scale(1.5) rotate(135deg); }
          100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1) rotate(180deg); }
        }
        
        @keyframes twinkle-enhanced-4 {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9) rotate(0deg); }
          33% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1) rotate(60deg); }
          66% { opacity: 1; transform: translate(-50%, -50%) scale(1.4) rotate(120deg); }
          100% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9) rotate(180deg); }
        }
        
        @keyframes nebula-enhanced-1 {
          0% { transform: rotate(0deg) scale(1) skewX(0deg); opacity: 0.2; }
          50% { transform: rotate(15deg) scale(1.3) skewX(5deg); opacity: 0.4; }
          100% { transform: rotate(30deg) scale(1.1) skewX(0deg); opacity: 0.25; }
        }
        
        @keyframes nebula-enhanced-2 {
          0% { transform: rotate(360deg) scale(0.9) skewY(0deg); opacity: 0.15; }
          50% { transform: rotate(330deg) scale(1.4) skewY(-3deg); opacity: 0.35; }
          100% { transform: rotate(300deg) scale(1.2) skewY(0deg); opacity: 0.2; }
        }
        
        @keyframes nebula-enhanced-3 {
          0% { transform: rotate(180deg) scale(1.1) skewX(0deg); opacity: 0.25; }
          25% { transform: rotate(165deg) scale(0.8) skewX(2deg); opacity: 0.4; }
          75% { transform: rotate(135deg) scale(1.3) skewX(-2deg); opacity: 0.5; }
          100% { transform: rotate(120deg) scale(1) skewX(0deg); opacity: 0.3; }
        }
        
        @keyframes nebula-enhanced-4 {
          0% { transform: rotate(270deg) scale(1.2) skewY(0deg); opacity: 0.1; }
          40% { transform: rotate(290deg) scale(1.6) skewY(4deg); opacity: 0.25; }
          80% { transform: rotate(310deg) scale(0.9) skewY(-2deg); opacity: 0.2; }
          100% { transform: rotate(330deg) scale(1.1) skewY(0deg); opacity: 0.15; }
        }
        
        @keyframes saturn-flash-1 {
          0%, 85%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
          88% { opacity: 0.4; transform: scale(1.2) rotate(90deg); }
          91% { opacity: 0.8; transform: scale(1.5) rotate(180deg); }
          94% { opacity: 0.3; transform: scale(1.1) rotate(270deg); }
        }
        
        @keyframes saturn-flash-2 {
          0%, 90%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
          93% { opacity: 0.5; transform: scale(1.3) rotate(120deg); }
          96% { opacity: 0.7; transform: scale(1.6) rotate(240deg); }
        }
        
        @keyframes saturn-energy-wave {
          0%, 88%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
          92% { opacity: 0.6; transform: scale(2.5) rotate(180deg); }
          96% { opacity: 0.3; transform: scale(4) rotate(360deg); }
        }
        
        @keyframes float-enhanced-1 {
          0% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(0px) scale(1); }
          25% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(20px) scale(1.2); }
          50% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(35px) scale(0.8); }
          75% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(50px) scale(1.1); }
          100% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(70px) scale(1); }
        }
        
        @keyframes float-enhanced-2 {
          0% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(0px) rotateZ(0deg); }
          33% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(25px) rotateZ(120deg); }
          66% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(45px) rotateZ(240deg); }
          100% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(65px) rotateZ(360deg); }
        }
        
        @keyframes float-enhanced-3 {
          0% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(0px) skewX(0deg); }
          50% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(40px) skewX(15deg); }
          100% { transform: translate(-50%, -50%) rotate(var(--float-direction)) translateX(60px) skewX(0deg); }
        }
        
        @keyframes comet-enhanced {
          0% { 
            transform: translate(-50%, -50%) rotate(var(--comet-angle)) translateX(-200px);
            opacity: 0;
          }
          5% { opacity: 0.3; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          95% { opacity: 0.3; }
          100% { 
            transform: translate(-50%, -50%) rotate(var(--comet-angle)) translateX(200px);
            opacity: 0;
          }
        }
        
        @keyframes comet-core {
          0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
          50% { transform: scale(1.3) rotate(180deg); filter: brightness(1.5); }
          100% { transform: scale(1) rotate(360deg); filter: brightness(1); }
        }
        
        @keyframes comet-tail-enhanced {
          0% { opacity: 0.9; width: 100%; filter: blur(0px); }
          50% { opacity: 0.6; width: 120%; filter: blur(1px); }
          100% { opacity: 0.4; width: 150%; filter: blur(2px); }
        }
        
        @keyframes ring-shimmer {
          0% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.3) saturate(1.5); }
          100% { filter: brightness(1) saturate(1); }
        }
        
        @keyframes ring-particles {
          0% { transform: rotate(0deg) translateX(var(--particle-radius, 50px)) scale(1); opacity: 0.8; }
          25% { transform: rotate(90deg) translateX(var(--particle-radius, 50px)) scale(1.2); opacity: 1; }
          50% { transform: rotate(180deg) translateX(var(--particle-radius, 50px)) scale(0.8); opacity: 0.6; }
          75% { transform: rotate(270deg) translateX(var(--particle-radius, 50px)) scale(1.1); opacity: 0.9; }
          100% { transform: rotate(360deg) translateX(var(--particle-radius, 50px)) scale(1); opacity: 0.8; }
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

export default GalaxyAnimation;
