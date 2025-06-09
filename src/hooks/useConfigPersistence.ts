// src/hooks/useConfigPersistence.ts
import { useState, useEffect, useCallback, useRef } from "react";

export interface ConfigState {
  theme: string;
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

const STORAGE_KEY = "streamframe_config";
const API_BASE_URL = "http://localhost:4000/api";
const DEBOUNCE_DELAY = 2000; // 2 segundos de delay para guardar en servidor
const CACHE_SAVE_DELAY = 500; // 500ms para cache local

export const useConfigPersistence = () => {
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Referencias para los timers de debouncing
  const serverSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const cacheSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingConfigRef = useRef<ConfigState | null>(null);
  const lastSavedConfigRef = useRef<string>("");

  // Cargar configuración desde cache local
  const loadFromCache = useCallback((): ConfigState | null => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.warn("Error al cargar cache local:", err);
    }
    return null;
  }, []);

  // Guardar en cache local (más rápido)
  const saveToCache = useCallback((config: ConfigState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.warn("Error al guardar en cache local:", err);
    }
  }, []);

  // Cargar configuración desde el servidor
  const loadFromServer = useCallback(async (): Promise<ConfigState | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/config`);
      const data = await response.json();

      if (data.success && data.config) {
        return data.config;
      }
    } catch (err) {
      console.warn("Error al cargar desde servidor:", err);
    }
    return null;
  }, []);

  // Guardar configuración en el servidor (debounced)
  const saveToServerDebounced = useCallback(
    async (config: ConfigState): Promise<boolean> => {
      try {
        // Verificar si la configuración realmente cambió
        const configString = JSON.stringify(config);
        if (configString === lastSavedConfigRef.current) {
          console.log("Configuración idéntica, saltando guardado en servidor");
          return true;
        }

        setIsSaving(true);
        const response = await fetch(`${API_BASE_URL}/config`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ config }),
        });

        const data = await response.json();

        if (data.success) {
          lastSavedConfigRef.current = configString;
          setHasUnsavedChanges(false);
          setError(null);
          console.log("Configuración guardada en servidor exitosamente");
        }

        setIsSaving(false);
        return data.success;
      } catch (err) {
        console.warn("Error al guardar en servidor:", err);
        setIsSaving(false);
        return false;
      }
    },
    []
  );

  // Subir avatar al servidor
  const uploadAvatar = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(`${API_BASE_URL}/upload-avatar`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          return data.avatarUrl;
        }
      } catch (err) {
        console.error("Error al subir avatar:", err);
      }
      return null;
    },
    []
  );

  // Inicializar configuración al montar el componente
  useEffect(() => {
    const initializeConfig = async () => {
      setIsLoading(true);
      setError(null);

      // Intentar cargar desde servidor primero
      let serverConfig = await loadFromServer();

      if (serverConfig) {
        setConfig(serverConfig);
        saveToCache(serverConfig); // Actualizar cache
        lastSavedConfigRef.current = JSON.stringify(serverConfig);
      } else {
        // Si falla el servidor, usar cache local
        const cachedConfig = loadFromCache();
        if (cachedConfig) {
          setConfig(cachedConfig);
          setError("Usando configuración local (sin conexión al servidor)");
          setHasUnsavedChanges(true); // Marcar como no sincronizado
        } else {
          // Configuración por defecto si no hay nada
          const defaultConfig: ConfigState = {
            theme: "apex",
            customColor: "#ff66aa",
            playerName: "GEO",
            namePosition: "bottom-right",
            fontSize: "32",
            fontFamily: "Russo One",
            showAvatar: true,
            avatarImage: "/images/klee.jpg",
            showAnimation: true,
            globalScale: 2,
          };
          setConfig(defaultConfig);
          saveToCache(defaultConfig);
          setHasUnsavedChanges(true);
        }
      }

      setIsLoading(false);
    };

    initializeConfig();
  }, [loadFromServer, loadFromCache, saveToCache]);

  // Función optimizada para actualizar configuración
  const updateConfig = useCallback(
    async (newConfig: Partial<ConfigState>) => {
      if (!config) return false;

      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      setHasUnsavedChanges(true);

      // Cancelar timers anteriores
      if (cacheSaveTimer.current) {
        clearTimeout(cacheSaveTimer.current);
      }
      if (serverSaveTimer.current) {
        clearTimeout(serverSaveTimer.current);
      }

      // Guardar en cache rápidamente (debounced más corto)
      cacheSaveTimer.current = setTimeout(() => {
        saveToCache(updatedConfig);
        console.log("Configuración guardada en cache local");
      }, CACHE_SAVE_DELAY);

      // Guardar en servidor con debouncing más largo
      pendingConfigRef.current = updatedConfig;
      serverSaveTimer.current = setTimeout(async () => {
        if (pendingConfigRef.current) {
          const success = await saveToServerDebounced(pendingConfigRef.current);
          if (!success) {
            setError(
              "No se pudo sincronizar con el servidor, guardado solo localmente"
            );
            setTimeout(() => setError(null), 5000);
          }
        }
      }, DEBOUNCE_DELAY);

      return true;
    },
    [config, saveToCache, saveToServerDebounced]
  );

  // Función para forzar guardado inmediato
  const forceSave = useCallback(async (): Promise<boolean> => {
    if (!config) return false;

    // Cancelar debouncing pendiente
    if (serverSaveTimer.current) {
      clearTimeout(serverSaveTimer.current);
    }

    // Guardar inmediatamente
    const success = await saveToServerDebounced(config);
    if (success) {
      setHasUnsavedChanges(false);
    }
    return success;
  }, [config, saveToServerDebounced]);

  // Función para guardar configuración con nombre específico
  const saveConfigAs = useCallback(
    async (configName: string): Promise<boolean> => {
      if (!config) return false;

      setIsSaving(true);
      try {
        const response = await fetch(`${API_BASE_URL}/config`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ config, configName }),
        });

        const data = await response.json();
        setIsSaving(false);
        return data.success;
      } catch (err) {
        console.error("Error al guardar configuración:", err);
        setIsSaving(false);
        return false;
      }
    },
    [config]
  );

  // Función para cargar configuración específica
  const loadConfig = useCallback(
    async (configName: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_BASE_URL}/config/${configName}`);
        const data = await response.json();

        if (data.success && data.config) {
          setConfig(data.config);
          saveToCache(data.config);
          lastSavedConfigRef.current = JSON.stringify(data.config);
          setHasUnsavedChanges(false);
          return true;
        }
      } catch (err) {
        console.error("Error al cargar configuración:", err);
      }
      return false;
    },
    [saveToCache]
  );

  // Función para obtener lista de configuraciones guardadas
  const getConfigList = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/configs`);
      const data = await response.json();

      if (data.success) {
        return data.configs;
      }
    } catch (err) {
      console.error("Error al obtener lista de configuraciones:", err);
    }
    return [];
  }, []);

  // Función para resetear a configuración por defecto
  const resetToDefault = useCallback(async () => {
    const defaultConfig: ConfigState = {
      theme: "apex",
      customColor: "#ff66aa",
      playerName: "GEO",
      namePosition: "bottom-right",
      fontSize: "32",
      fontFamily: "Russo One",
      showAvatar: true,
      avatarImage: "/images/klee.jpg",
      showAnimation: true,
      globalScale: 2,
    };

    setConfig(defaultConfig);
    saveToCache(defaultConfig);

    const success = await saveToServerDebounced(defaultConfig);
    return success;
  }, [saveToCache, saveToServerDebounced]);

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (cacheSaveTimer.current) {
        clearTimeout(cacheSaveTimer.current);
      }
      if (serverSaveTimer.current) {
        clearTimeout(serverSaveTimer.current);
      }
    };
  }, []);

  // Auto-guardar al salir de la página
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (hasUnsavedChanges && config) {
        // Forzar guardado síncrono antes de salir
        await forceSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, config, forceSave]);

  return {
    config,
    isLoading,
    error,
    isSaving,
    hasUnsavedChanges,
    updateConfig,
    forceSave,
    saveConfigAs,
    loadConfig,
    getConfigList,
    resetToDefault,
    uploadAvatar,
  };
};
