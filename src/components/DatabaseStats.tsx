import React, { useState, useEffect } from "react";
import { Database, Trash2, RefreshCw, Info } from "lucide-react";

interface DatabaseStats {
  total_configurations: number;
  database_size_mb: string;
  last_modified: string;
  cache_info: {
    last_hash: string;
    last_saved: string | null;
  };
}

interface DatabaseStatsProps {
  theme: any;
}

const DatabaseStatsComponent: React.FC<DatabaseStatsProps> = ({ theme }) => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearOldConfigs = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres limpiar las configuraciones antiguas? Esto solo mantendrá la configuración actual."
      )
    ) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch("http://localhost:4000/api/cleanup", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(`Se eliminaron ${data.deleted} configuraciones antiguas.`);
        fetchStats(); // Recargar estadísticas
      }
    } catch (error) {
      console.error("Error al limpiar base de datos:", error);
      alert("Error al limpiar la base de datos");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg pointer-events-auto transition-all hover:scale-110"
        style={{
          background: `${theme.primary}20`,
          border: `1px solid ${theme.primary}40`,
        }}
        title="Estadísticas de base de datos"
      >
        <Database className="w-6 h-6" style={{ color: theme.primary }} />
      </button>
    );
  }

  return (
    <div
      className="absolute top-16 left-4 w-80 p-4 rounded-lg shadow-xl pointer-events-auto"
      style={{
        background: `rgba(0, 0, 0, 0.9)`,
        border: `1px solid ${theme.primary}40`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: theme.primary }}
        >
          <Database className="w-5 h-5" />
          Base de Datos
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded cursor-pointer text-red-500 hover:text-red-400 hover:scale-110 transition-colors"
        >
          ✕
        </button>
      </div>

      {stats && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-gray-400">Configuraciones</div>
              <div className="text-lg font-bold text-white">
                {stats.total_configurations}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-gray-400">Tamaño BD</div>
              <div className="text-lg font-bold text-white">
                {stats.database_size_mb} MB
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-gray-400 mb-1">
              Última modificación
            </div>
            <div className="text-sm text-white">
              {new Date(stats.last_modified).toLocaleString()}
            </div>
          </div>

          {stats.cache_info.last_saved && (
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-gray-400 mb-1">
                Último guardado en cache
              </div>
              <div className="text-sm text-white">
                {new Date(stats.cache_info.last_saved).toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/10"
              style={{
                background: `${theme.primary}20`,
                border: `1px solid ${theme.primary}40`,
                color: theme.primary,
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Actualizar</span>
            </button>

            <button
              onClick={clearOldConfigs}
              disabled={isClearing}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-red-600/20"
              style={{
                background: "#ef444420",
                border: "1px solid #ef444440",
                color: "#ef4444",
              }}
            >
              <Trash2
                className={`w-4 h-4 ${isClearing ? "animate-pulse" : ""}`}
              />
              <span className="text-sm">Limpiar</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-300">
                <strong>Optimización:</strong> Los cambios se guardan cada 2
                segundos para evitar escrituras excesivas. El sistema usa cache
                inteligente para prevenir duplicados.
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw
            className="w-6 h-6 animate-spin"
            style={{ color: theme.primary }}
          />
        </div>
      )}
    </div>
  );
};

export default DatabaseStatsComponent;
