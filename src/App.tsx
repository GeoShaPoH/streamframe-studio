import { useState, useEffect, useCallback } from "react";
import { Settings, Copy, Check, Eye, EyeOff, Save } from "lucide-react";
import io, { Socket } from "socket.io-client";
import CameraFrame from "./components/CameraFrame";
import SettingsModal from "./components/SettingsModal";
import DatabaseStats from "./components/DatabaseStats";
import { themes } from "./utils/themes";
import { sizeConfig } from "./utils/sizeConfig";
import UrlInfo from "./utils/UrlInfo";
import {
  useConfigPersistence,
  ConfigState,
} from "./hooks/useConfigPersistence";

export interface ThemeType {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
}

export type ThemeName = "osu" | "apex" | "irl" | "custom";

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedClients, setConnectedClients] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Hook de persistencia
  const {
    config,
    isLoading,
    error: persistenceError,
    isSaving,
    updateConfig,
    uploadAvatar,
  } = useConfigPersistence();

  // Estados individuales derivados de la configuración
  const currentTheme = (config?.theme as ThemeName) || "apex";
  const customColor = config?.customColor || "#ff66aa";
  const playerName = config?.playerName || "GEO";
  const namePosition = config?.namePosition || "bottom-right";
  const fontSize = config?.fontSize || "32";
  const fontFamily = config?.fontFamily || "Russo One";
  const showAvatar = config?.showAvatar ?? true;
  const avatarImage = config?.avatarImage || "/images/klee.jpg";
  const showAnimation = config?.showAnimation ?? true;
  const globalScale = config?.globalScale || sizeConfig.globalScale;

  // Detectar modo viewer desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const isViewerMode = urlParams.get("viewer") === "true";
  const hideControls = urlParams.get("hideControls") === "true" || isViewerMode;
  const hideIndicator =
    urlParams.get("hideIndicator") === "true" || isViewerMode;

  // Conectar WebSocket al montar el componente
  useEffect(() => {
    if (!config) return; // Esperar a que se cargue la configuración

    const socketIo = io("http://localhost:4000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketIo.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
      setIsConnected(true);
      setLastSyncTime(new Date());
    });

    socketIo.on("disconnect", () => {
      console.log("Desconectado del servidor WebSocket");
      setIsConnected(false);
    });

    // Recibir configuración del servidor via WebSocket
    socketIo.on("config", (serverConfig: Partial<ConfigState>) => {
      console.log("Configuración recibida via WebSocket:", serverConfig);

      // Solo actualizar si no estamos en modo viewer para evitar conflictos
      if (isViewerMode && serverConfig) {
        updateConfig(serverConfig);
        setLastSyncTime(new Date());
      }
    });

    // Recibir contador de clientes
    socketIo.on("clientsCount", (count: number) => {
      setConnectedClients(count);
    });

    setSocket(socketIo);

    // Limpiar al desmontar
    return () => {
      socketIo.disconnect();
    };
  }, [config, isViewerMode, updateConfig]);

  // Función para emitir cambios de configuración via WebSocket
  const emitConfigChange = useCallback(
    (configUpdate: Partial<ConfigState>) => {
      if (socket && isConnected && !isViewerMode) {
        socket.emit("updateConfig", configUpdate);
        setLastSyncTime(new Date());
      }
    },
    [socket, isConnected, isViewerMode]
  );

  // Funciones de actualización de configuración
  const setCurrentTheme = useCallback(
    (theme: ThemeName) => {
      updateConfig({ theme });
      emitConfigChange({ theme });
    },
    [updateConfig, emitConfigChange]
  );

  const setCustomColor = useCallback(
    (color: string) => {
      updateConfig({ customColor: color });
      emitConfigChange({ customColor: color });
    },
    [updateConfig, emitConfigChange]
  );

  const setPlayerName = useCallback(
    (name: string) => {
      updateConfig({ playerName: name });
      emitConfigChange({ playerName: name });
    },
    [updateConfig, emitConfigChange]
  );

  const setNamePosition = useCallback(
    (position: string) => {
      updateConfig({ namePosition: position });
      emitConfigChange({ namePosition: position });
    },
    [updateConfig, emitConfigChange]
  );

  const setFontSize = useCallback(
    (size: string) => {
      updateConfig({ fontSize: size });
      emitConfigChange({ fontSize: size });
    },
    [updateConfig, emitConfigChange]
  );

  const setFontFamily = useCallback(
    (font: string) => {
      updateConfig({ fontFamily: font });
      emitConfigChange({ fontFamily: font });
    },
    [updateConfig, emitConfigChange]
  );

  const setShowAvatar = useCallback(
    (show: boolean) => {
      updateConfig({ showAvatar: show });
      emitConfigChange({ showAvatar: show });
    },
    [updateConfig, emitConfigChange]
  );

  const setAvatarImage = useCallback(
    async (image: string | ArrayBuffer | null | File) => {
      if (image instanceof File) {
        // Si es un archivo, subirlo al servidor
        const avatarUrl = await uploadAvatar(image);
        if (avatarUrl) {
          updateConfig({ avatarImage: avatarUrl });
          emitConfigChange({ avatarImage: avatarUrl });
        }
      } else {
        updateConfig({ avatarImage: image });
        emitConfigChange({ avatarImage: image });
      }
    },
    [updateConfig, emitConfigChange, uploadAvatar]
  );

  const setShowAnimation = useCallback(
    (show: boolean) => {
      updateConfig({ showAnimation: show });
      emitConfigChange({ showAnimation: show });
    },
    [updateConfig, emitConfigChange]
  );

  const setGlobalScale = useCallback(
    (scale: number) => {
      updateConfig({ globalScale: scale });
      emitConfigChange({ globalScale: scale });
    },
    [updateConfig, emitConfigChange]
  );

  // Función para copiar URL del viewer
  const copyViewerUrl = () => {
    const baseUrl = window.location.origin;
    const viewerUrl = `${baseUrl}?viewer=true`;
    navigator.clipboard.writeText(viewerUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const theme =
    currentTheme === "custom"
      ? {
          primary: customColor,
          secondary: customColor + "99",
          glow: customColor + "99",
          accent: "#ffffff",
        }
      : themes[currentTheme];

  // Mostrar loading mientras se carga la configuración
  if (isLoading || !config) {
    return (
      <div className="w-screen h-screen bg-transparent flex items-center justify-center">
        <div className="text-white text-lg">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-transparent overflow-hidden">
      <CameraFrame
        theme={theme}
        playerName={playerName}
        namePosition={namePosition}
        fontSize={fontSize}
        fontFamily={fontFamily}
        showAvatar={showAvatar}
        avatarImage={avatarImage}
        showAnimation={showAnimation}
        scale={globalScale}
      />

      {/* Controles superiores - Solo visibles si no está en modo viewer */}
      {!hideControls && (
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-50">
          {/* Controles de la izquierda */}
          <div className="flex gap-2">
            {/* Botón de configuración */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg pointer-events-auto transition-all hover:scale-110"
              style={{
                background: `${theme.primary}20`,
                border: `1px solid ${theme.primary}40`,
              }}
            >
              <Settings className="w-6 h-6" style={{ color: theme.primary }} />
            </button>

            {/* Estadísticas de base de datos */}
            <DatabaseStats theme={theme} />
          </div>

          {/* Controles de la derecha */}
          <div className="flex gap-2 items-start">
            {/* Botón de copiar URL del viewer */}
            <button
              onClick={copyViewerUrl}
              className="flex items-center gap-2 px-3 py-2 rounded-lg pointer-events-auto transition-all hover:scale-105"
              style={{
                background: `${theme.primary}20`,
                border: `1px solid ${theme.primary}40`,
                color: theme.primary,
              }}
              title="Copiar URL del viewer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copiar URL Viewer</span>
                </>
              )}
            </button>

            {/* Indicador de guardado */}
            {isSaving && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg pointer-events-none"
                style={{
                  background: "#3b82f620",
                  border: "1px solid #3b82f640",
                  color: "#3b82f6",
                }}
              >
                <Save className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Guardando...</span>
              </div>
            )}

            {/* Indicador de modo */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg pointer-events-none"
              style={{
                background: isViewerMode ? "#00ff0020" : "#ff880020",
                border: `1px solid ${isViewerMode ? "#00ff0040" : "#ff880040"}`,
                color: isViewerMode ? "#00ff00" : "#ff8800",
              }}
            >
              {isViewerMode ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Modo Viewer</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm">Modo Editor</span>
                </>
              )}
            </div>

            {/* Botón de información de URLs */}
            <UrlInfo theme={theme} />
          </div>
        </div>
      )}

      {/* Notificaciones de error */}
      {!hideControls && persistenceError && (
        <div className="absolute top-20 right-4 p-3 rounded-lg z-50 pointer-events-none max-w-sm">
          <div
            className="text-sm"
            style={{
              background: "#ef444420",
              border: "1px solid #ef444440",
              color: "#ef4444",
            }}
          >
            ⚠️ {persistenceError}
          </div>
        </div>
      )}

      {/* Indicador de conexión y última sincronización */}
      {!hideIndicator && (
        <div className="absolute bottom-0 right-0 p-4 z-50 space-y-2">
          {/* Estado de conexión */}
          <div
            className="text-xs px-2 py-1 rounded pointer-events-none"
            style={{
              background: isConnected ? "#00ff0020" : "#ff000020",
              color: isConnected ? "#00ff00" : "#ff0000",
              border: `1px solid ${isConnected ? "#00ff0040" : "#ff000040"}`,
            }}
          >
            {isConnected ? `Conectado (${connectedClients})` : "Desconectado"}
          </div>

          {/* Última sincronización */}
          {lastSyncTime && (
            <div
              className="text-xs px-2 py-1 rounded pointer-events-none"
              style={{
                background: "#6b728020",
                color: "#6b7280",
                border: "1px solid #6b728040",
              }}
            >
              Sync: {lastSyncTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Modal de configuración */}
      {!isViewerMode && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          customColor={customColor}
          setCustomColor={setCustomColor}
          playerName={playerName}
          setPlayerName={setPlayerName}
          namePosition={namePosition}
          setNamePosition={setNamePosition}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          showAvatar={showAvatar}
          setShowAvatar={setShowAvatar}
          avatarImage={avatarImage}
          setAvatarImage={setAvatarImage}
          showAnimation={showAnimation}
          setShowAnimation={setShowAnimation}
          globalScale={globalScale}
          setGlobalScale={setGlobalScale}
        />
      )}
    </div>
  );
};

export default App;
