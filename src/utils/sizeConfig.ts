// Configuración centralizada de tamaños
// Puedes ajustar estos valores para cambiar el tamaño de todo el overlay

export const sizeConfig = {
  // Tamaño base (1 = normal, 1.5 = 50% más grande, 2 = doble, etc.)
  globalScale: 2,

  // Tamaños individuales (en píxeles)
  frame: {
    padding: 32, // Espacio desde los bordes (era 8)
    borderRadius: 24, // Radio del borde
    borderWidth: 3, // Grosor del borde
    glowBlur: 30, // Tamaño del glow
  },

  cornerMarks: {
    longLine: 12, // Línea larga de las esquinas
    shortLine: 8, // Línea corta de las esquinas
    spacing: 16, // Espacio desde el borde (era 4)
    thickness: 2, // Grosor de las líneas (era 0.5)
    innerSpacing: 8, // Espacio interno entre líneas (era 2)
  },

  avatar: {
    size: 80, // Tamaño del avatar (era 20)
    borderWidth: 3, // Borde del avatar
    position: 32, // Posición desde el borde (era 8)
  },

  galaxy: {
    planetSize: 80, // Tamaño del planeta (era 20)
    ringWidth: 128, // Ancho del anillo (era 32)
    ringHeight: 32, // Alto del anillo (era 8)
    starSize: 12, // Tamaño de las estrellas (era 3)
    position: 32, // Posición desde el borde
  },

  playerName: {
    padding: {
      x: 24, // Padding horizontal (era 6)
      y: 12, // Padding vertical (era 3)
    },
    borderRadius: 9999, // Radio del borde (full)
    position: 32, // Posición desde el borde (era 8)
    // fontSize se maneja desde la configuración del usuario
  },

  liveIndicator: {
    padding: {
      x: 16, // Padding horizontal (era 4)
      y: 4, // Padding vertical (era 1)
    },
    dotSize: 8, // Tamaño del punto (era 2)
    fontSize: 12, // Tamaño de fuente
    position: 32, // Posición desde arriba (era 8)
  },
};
