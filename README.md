# StreamFrame Studio

Real-time customizable webcam frame overlay for OBS with WebSocket sync and persistent configuration.

## ✨ Características

- 🎨 **Múltiples temas**: osu!, Apex Legends, IRL y colores personalizados
- 🖼️ **Avatar personalizable**: Sube tu propia imagen de avatar
- 🎯 **Sincronización en tiempo real**: WebSocket para sincronización instantánea
- 💾 **Persistencia robusta**: Base de datos SQLite + cache local
- 📱 **Modo viewer**: URL especial para OBS sin controles
- ⚡ **Escala global**: Ajusta el tamaño del overlay completo
- 🌟 **Animaciones**: Galaxia animada opcional
- 🔤 **Tipografía personalizable**: Múltiples fuentes y tamaños

## 🚀 Instalación

### Prerrequisitos

- Node.js 16 o superior
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/GeoShaPoH/streamframe-studio
cd streamframe-studio
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Construir el proyecto**
```bash
npm run build
```

4. **Iniciar el servidor y cliente**
```bash
npm start
```

El servidor se ejecutará en `http://localhost:4000` y el cliente en `http://localhost:3000`.

## 🎯 Uso

### URLs disponibles

| URL | Descripción | Uso |
|-----|-------------|-----|
| `http://localhost:3000` | **Editor completo** | Configuración del overlay |
| `http://localhost:3000?viewer=true` | **Modo viewer** | Para usar en OBS |
| `http://localhost:3000?hideControls=true&hideIndicator=true` | **Solo frame** | Frame limpio sin indicadores |

### Configuración en OBS

1. Agregar fuente **"Navegador"**
2. URL: `http://localhost:3000?viewer=true`
3. Ancho: 1920, Alto: 1080
4. ✅ Actualizar navegador cuando la escena se active
5. ✅ Cerrar fuente cuando no esté visible

### Configuración del overlay

1. **Tema**: Selecciona entre osu!, Apex, IRL o color personalizado
2. **Nombre del streamer**: Tu nombre que aparecerá en el overlay
3. **Posición del nombre**: Esquina donde aparecerá tu nombre
4. **Tipografía**: Fuente y tamaño del texto
5. **Avatar**: Sube una imagen personalizada
6. **Escala global**: Ajusta el tamaño general del overlay
7. **Animaciones**: Activa/desactiva la galaxia animada

## 🗃️ Sistema de persistencia

### Servidor (SQLite)
- Base de datos SQLite para persistencia robusta
- Respaldo automático de configuraciones
- Manejo de archivos de avatar en el servidor
- API REST para CRUD de configuraciones

### Cliente (LocalStorage)
- Cache local para funcionamiento offline
- Sincronización automática con el servidor
- Respaldo de configuración en caso de fallo del servidor

### Funcionamiento híbrido

1. **Al iniciar**: Carga configuración desde servidor
2. **Si no hay conexión**: Usa cache local como respaldo
3. **Al hacer cambios**: Guarda localmente + sincroniza con servidor
4. **Modo viewer**: Recibe cambios en tiempo real via WebSocket

## 📁 Estructura del proyecto

```
streamframe-studio/
├── server.js                 # Servidor WebSocket + API REST
├── package.json              # Dependencias y scripts
├── streamframe.db            # Base de datos SQLite (generada automáticamente)
├── uploads/                  # Directorio de avatares subidos
├── src/
│   ├── App.tsx              # Componente principal
│   ├── hooks/
│   │   └── useConfigPersistence.ts  # Hook de persistencia
│   ├── components/
│   │   ├── CameraFrame.tsx           # Marco principal
│   │   ├── SettingsModal.tsx         # Modal de configuración
│   │   └── settings/                 # Componentes de configuración
│   └── utils/
│       ├── themes.ts                 # Definición de temas
│       └── sizeConfig.ts            # Configuración de tamaños
```

## 🔧 API REST

### Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/config` | Obtener configuración actual |
| `POST` | `/api/config` | Guardar configuración |
| `POST` | `/api/upload-avatar` | Subir avatar |
| `GET` | `/api/configs` | Listar todas las configuraciones |
| `GET` | `/api/config/:name` | Obtener configuración específica |
| `DELETE` | `/api/config/:name` | Eliminar configuración |

### Ejemplo de uso

```javascript
// Obtener configuración actual
const response = await fetch('http://localhost:4000/api/config');
const data = await response.json();

// Guardar configuración
await fetch('http://localhost:4000/api/config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ config: myConfig })
});
```

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm start     # Iniciar servidor + cliente
npm run client    # Solo cliente React
npm run server    # Solo servidor WebSocket
npm run build     # Construir para producción
npm test      # Ejecutar tests
```

### Agregar nuevos temas

1. Editar `src/utils/themes.ts`
2. Agregar el nuevo tema al objeto `themes`
3. Actualizar el tipo `ThemeName` en `App.tsx`

```typescript
export const themes = {
  // ... temas existentes
  miTema: {
    primary: '#color1',
    secondary: '#color2',
    glow: 'rgba(255, 0, 0, 0.6)',
    accent: '#color3'
  }
};
```

## 🐛 Solución de problemas

### El overlay no aparece en OBS
- Verificar que el servidor esté ejecutándose
- Comprobar la URL en la fuente de navegador
- Asegurarse de que las dimensiones sean 1920x1080

### Las configuraciones no se guardan
- Verificar permisos de escritura en el directorio
- Comprobar que SQLite esté instalado correctamente
- Revisar la consola del servidor para errores

### Problemas de sincronización
- Verificar conectividad de red
- Comprobar que el puerto 4000 esté libre
- Reiniciar servidor y cliente

### Avatares no se cargan
- Verificar que el directorio `uploads/` tenga permisos de escritura
- Comprobar que la imagen sea menor a 5MB
- Asegurarse de que sea un formato de imagen válido

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request