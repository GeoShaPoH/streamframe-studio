import { useState, useEffect, useCallback } from "react";
import { Settings, Copy, Check, Eye, EyeOff } from "lucide-react";
import io, { Socket } from "socket.io-client";
import CameraFrame from "./components/CameraFrame";
import SettingsModal from "./components/SettingsModal";
import { themes } from "./utils/themes";
import { sizeConfig } from "./utils/sizeConfig";
import UrlInfo from "./utils/UrlInfo";

export interface ThemeType {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
}

export type ThemeName = "osu" | "apex" | "irl" | "custom";

interface ConfigState {
  theme: ThemeName;
  customColor: string;
  playerName: string;
  namePosition: string;
  fontSize: string;
  fontFamily: string;
  showAvatar: boolean;
  avatarImage: string | ArrayBuffer | null;
  showAnimation: boolean;
  globalScale: number;
}

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedClients, setConnectedClients] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados de configuración
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("apex");
  const [customColor, setCustomColor] = useState("#ff66aa");
  const [playerName, setPlayerName] = useState("GEO");
  const [namePosition, setNamePosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState("32");
  const [fontFamily, setFontFamily] = useState("Russo One");
  const [showAvatar, setShowAvatar] = useState(true);
  const [avatarImage, setAvatarImage] = useState<string | ArrayBuffer | null>(
    "/images/klee.jpg"
  );
  const [showAnimation, setShowAnimation] = useState(true);
  const [globalScale, setGlobalScale] = useState(sizeConfig.globalScale);

  // Detectar modo viewer desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const isViewerMode = urlParams.get("viewer") === "true";
  const hideControls = urlParams.get("hideControls") === "true" || isViewerMode;
  const hideIndicator =
    urlParams.get("hideIndicator") === "true" || isViewerMode;

  // Conectar WebSocket al montar el componente
  useEffect(() => {
    const socketIo = io("http://localhost:4000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketIo.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
      setIsConnected(true);
      socketIo.emit("requestConfig");
    });

    socketIo.on("disconnect", () => {
      console.log("Desconectado del servidor WebSocket");
      setIsConnected(false);
    });

    // Recibir configuración del servidor
    socketIo.on("config", (config: Partial<ConfigState>) => {
      console.log("Configuración recibida:", config);

      if (config.theme !== undefined) setCurrentTheme(config.theme);
      if (config.customColor !== undefined) setCustomColor(config.customColor);
      if (config.playerName !== undefined) setPlayerName(config.playerName);
      if (config.namePosition !== undefined)
        setNamePosition(config.namePosition);
      if (config.fontSize !== undefined) setFontSize(config.fontSize);
      if (config.fontFamily !== undefined) setFontFamily(config.fontFamily);
      if (config.showAvatar !== undefined) setShowAvatar(config.showAvatar);
      if (config.avatarImage !== undefined) setAvatarImage(config.avatarImage);
      if (config.showAnimation !== undefined)
        setShowAnimation(config.showAnimation);
      if (config.globalScale !== undefined) setGlobalScale(config.globalScale);
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
  }, []);

  // Función para emitir cambios de configuración
  const emitConfigChange = useCallback(
    (configUpdate: Partial<ConfigState>) => {
      if (socket && isConnected) {
        socket.emit("updateConfig", configUpdate);
      }
    },
    [socket, isConnected]
  );

  // Efecto para detectar cambios y emitirlos
  useEffect(() => {
    if (socket && isConnected && !isViewerMode) {
      const config: ConfigState = {
        theme: currentTheme,
        customColor,
        playerName,
        namePosition,
        fontSize,
        fontFamily,
        showAvatar,
        avatarImage,
        showAnimation,
        globalScale,
      };
      emitConfigChange(config);
    }
  }, [
    currentTheme,
    customColor,
    playerName,
    namePosition,
    fontSize,
    fontFamily,
    showAvatar,
    avatarImage,
    showAnimation,
    globalScale,
    socket,
    isConnected,
    emitConfigChange,
    isViewerMode,
  ]);

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

      {/* Indicador de conexión - Solo visible si no está oculto */}
      {!hideIndicator && (
        <div
          className="absolute z-50 text-xs px-2 py-1 rounded pointer-events-none"
          style={{
            bottom: `${4 * globalScale}px`,
            right: `${4 * globalScale}px`,
            background: isConnected ? "#00ff0020" : "#ff000020",
            color: isConnected ? "#00ff00" : "#ff0000",
            border: `1px solid ${isConnected ? "#00ff0040" : "#ff000040"}`,
          }}
        >
          {isConnected ? `Conectado (${connectedClients})` : "Desconectado"}
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
