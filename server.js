const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos estáticos
app.use("/uploads", express.static(uploadsDir));

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
});

// Inicializar base de datos SQLite
const dbPath = path.join(__dirname, "streamframe.db");
const db = new sqlite3.Database(dbPath);

// Función para generar hash de configuración
const generateConfigHash = (config) => {
  return crypto.createHash("md5").update(JSON.stringify(config)).digest("hex");
};

// Cache en memoria para evitar escrituras innecesarias
let configCache = {
  default: null,
  lastHash: null,
  lastSaved: null,
};

// Crear tabla de configuraciones optimizada
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS configurations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      config TEXT NOT NULL,
      config_hash TEXT NOT NULL,
      avatar_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name)
    )
  `);

  // Crear índice para optimizar búsquedas por hash
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_config_hash ON configurations(config_hash);
  `);

  // Insertar configuración por defecto si no existe
  db.get(
    "SELECT COUNT(*) as count FROM configurations WHERE name = 'default'",
    (err, row) => {
      if (err) {
        console.error("Error al verificar configuración por defecto:", err);
        return;
      }

      if (row.count === 0) {
        const defaultConfig = {
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

        const configHash = generateConfigHash(defaultConfig);

        db.run(
          "INSERT INTO configurations (name, config, config_hash) VALUES (?, ?, ?)",
          ["default", JSON.stringify(defaultConfig), configHash],
          function (err) {
            if (err) {
              console.error("Error al crear configuración por defecto:", err);
            } else {
              console.log("Configuración por defecto creada");
              configCache.default = defaultConfig;
              configCache.lastHash = configHash;
            }
          }
        );
      } else {
        // Cargar configuración existente en cache
        db.get(
          "SELECT config, config_hash FROM configurations WHERE name = 'default' ORDER BY updated_at DESC LIMIT 1",
          (err, row) => {
            if (!err && row) {
              configCache.default = JSON.parse(row.config);
              configCache.lastHash = row.config_hash;
              console.log("Configuración cargada en cache");
            }
          }
        );
      }
    }
  );
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Estado actual de configuración en memoria
let currentConfig = null;

// Cargar configuración por defecto al iniciar
const loadDefaultConfig = () => {
  if (configCache.default) {
    currentConfig = configCache.default;
    console.log("Configuración cargada desde cache:", currentConfig);
    return;
  }

  db.get(
    "SELECT config, avatar_path, config_hash FROM configurations WHERE name = 'default' ORDER BY updated_at DESC LIMIT 1",
    (err, row) => {
      if (err) {
        console.error("Error al cargar configuración:", err);
        // Configuración de fallback
        currentConfig = {
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
      } else if (row) {
        currentConfig = JSON.parse(row.config);
        if (row.avatar_path && currentConfig.showAvatar) {
          currentConfig.avatarImage = `/uploads/${path.basename(
            row.avatar_path
          )}`;
        }
        configCache.default = currentConfig;
        configCache.lastHash = row.config_hash;
      }
      console.log("Configuración cargada:", currentConfig);
    }
  );
};

// Cargar configuración al iniciar el servidor
loadDefaultConfig();

// Mantener registro de clientes conectados
let connectedClients = 0;

// API REST endpoints

// GET /api/config - Obtener configuración actual
app.get("/api/config", (req, res) => {
  if (!currentConfig) {
    return res.status(500).json({ error: "Configuración no disponible" });
  }
  res.json({ success: true, config: currentConfig });
});

// POST /api/config - Guardar configuración (optimizado)
app.post("/api/config", (req, res) => {
  const { config, configName = "default" } = req.body;

  if (!config) {
    return res.status(400).json({ error: "Configuración requerida" });
  }

  const configToSave = { ...config };
  const configHash = generateConfigHash(configToSave);

  // Verificar si la configuración cambió realmente
  if (configName === "default" && configCache.lastHash === configHash) {
    console.log("Configuración idéntica detectada, saltando guardado en BD");
    return res.json({
      success: true,
      message: "Configuración sin cambios",
      config: currentConfig,
      cached: true,
    });
  }

  let avatarPath = null;

  // Si hay avatar y es base64, guardarlo como archivo
  if (
    configToSave.avatarImage &&
    configToSave.avatarImage.startsWith("data:image/")
  ) {
    try {
      const matches = configToSave.avatarImage.match(
        /^data:image\/([A-Za-z-+/]+);base64,(.+)$/
      );
      if (matches && matches.length === 3) {
        const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
        const data = matches[2];
        const filename = `avatar-${Date.now()}.${ext}`;
        avatarPath = path.join(uploadsDir, filename);

        fs.writeFileSync(avatarPath, data, "base64");
        configToSave.avatarImage = `http://localhost:4000/uploads/${filename}`;
      }
    } catch (error) {
      console.error("Error al guardar avatar:", error);
    }
  }

  // Usar UPDATE si existe, INSERT si no existe
  db.get(
    "SELECT id FROM configurations WHERE name = ?",
    [configName],
    (err, row) => {
      if (err) {
        console.error("Error al verificar configuración existente:", err);
        return res
          .status(500)
          .json({ error: "Error al verificar configuración" });
      }

      const query = row
        ? `UPDATE configurations SET config = ?, config_hash = ?, avatar_path = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?`
        : `INSERT INTO configurations (config, config_hash, avatar_path, name) VALUES (?, ?, ?, ?)`;

      const params = row
        ? [JSON.stringify(configToSave), configHash, avatarPath, configName]
        : [JSON.stringify(configToSave), configHash, avatarPath, configName];

      db.run(query, params, function (err) {
        if (err) {
          console.error("Error al guardar configuración:", err);
          return res
            .status(500)
            .json({ error: "Error al guardar configuración" });
        }

        // Actualizar cache si es la configuración por defecto
        if (configName === "default") {
          currentConfig = configToSave;
          configCache.default = configToSave;
          configCache.lastHash = configHash;
          configCache.lastSaved = new Date();
        }

        // Notificar a todos los clientes conectados solo si cambió realmente
        io.emit("config", currentConfig);

        console.log(
          `Configuración "${configName}" guardada exitosamente. Hash: ${configHash}`
        );

        res.json({
          success: true,
          message: "Configuración guardada exitosamente",
          config: currentConfig,
          hash: configHash,
        });
      });
    }
  );
});

// POST /api/upload-avatar - Subir archivo de avatar
app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió archivo" });
  }

  const avatarUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({
    success: true,
    avatarUrl: avatarUrl,
    message: "Avatar subido exitosamente",
  });
});

// GET /api/configs - Obtener todas las configuraciones guardadas
app.get("/api/configs", (req, res) => {
  db.all(
    "SELECT id, name, created_at, updated_at FROM configurations ORDER BY updated_at DESC",
    (err, rows) => {
      if (err) {
        console.error("Error al obtener configuraciones:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener configuraciones" });
      }
      res.json({ success: true, configs: rows });
    }
  );
});

// GET /api/config/:name - Obtener configuración específica
app.get("/api/config/:name", (req, res) => {
  const { name } = req.params;

  db.get(
    "SELECT config, avatar_path FROM configurations WHERE name = ? ORDER BY updated_at DESC LIMIT 1",
    [name],
    (err, row) => {
      if (err) {
        console.error("Error al obtener configuración:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener configuración" });
      }

      if (!row) {
        return res.status(404).json({ error: "Configuración no encontrada" });
      }

      const config = JSON.parse(row.config);
      if (row.avatar_path && config.showAvatar) {
        config.avatarImage = `/uploads/${path.basename(row.avatar_path)}`;
      }

      res.json({ success: true, config: config });
    }
  );
});

// DELETE /api/config/:name - Eliminar configuración
app.delete("/api/config/:name", (req, res) => {
  const { name } = req.params;

  if (name === "default") {
    return res
      .status(400)
      .json({ error: "No se puede eliminar la configuración por defecto" });
  }

  db.run("DELETE FROM configurations WHERE name = ?", [name], function (err) {
    if (err) {
      console.error("Error al eliminar configuración:", err);
      return res.status(500).json({ error: "Error al eliminar configuración" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    res.json({
      success: true,
      message: "Configuración eliminada exitosamente",
    });
  });
});

// POST /api/cleanup - Limpiar configuraciones duplicadas/antiguas
app.post("/api/cleanup", (req, res) => {
  // Limpiar configuraciones duplicadas manteniendo solo la más reciente de cada nombre
  db.run(
    `
    DELETE FROM configurations 
    WHERE id NOT IN (
      SELECT MAX(id) 
      FROM configurations 
      GROUP BY name
    )
  `,
    function (err) {
      if (err) {
        console.error("Error al limpiar configuraciones:", err);
        return res
          .status(500)
          .json({ error: "Error al limpiar configuraciones" });
      }

      console.log(`Configuraciones duplicadas eliminadas: ${this.changes}`);

      // También ejecutar VACUUM para optimizar la base de datos
      db.run("VACUUM", (err) => {
        if (err) {
          console.error("Error al optimizar base de datos:", err);
        } else {
          console.log("Base de datos optimizada con VACUUM");
        }
      });

      res.json({
        success: true,
        message: "Base de datos limpiada y optimizada",
        deleted: this.changes,
      });
    }
  );
});

// GET /api/stats - Estadísticas de la base de datos
app.get("/api/stats", (req, res) => {
  db.get("SELECT COUNT(*) as total_configs FROM configurations", (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener estadísticas" });
    }

    const stats = fs.statSync(dbPath);
    res.json({
      success: true,
      stats: {
        total_configurations: row.total_configs,
        database_size_mb: (stats.size / (1024 * 1024)).toFixed(2),
        last_modified: stats.mtime,
        cache_info: {
          last_hash: configCache.lastHash,
          last_saved: configCache.lastSaved,
        },
      },
    });
  });
});

// WebSocket handlers (optimizados)
io.on("connection", (socket) => {
  connectedClients++;
  console.log(`Cliente conectado. Total: ${connectedClients}`);

  // Enviar estado actual al nuevo cliente
  if (currentConfig) {
    socket.emit("config", currentConfig);
  }

  // Notificar a todos sobre el número de clientes
  io.emit("clientsCount", connectedClients);

  // Cuando llega una actualización de configuración via WebSocket
  socket.on("updateConfig", (config) => {
    console.log(
      "Configuración actualizada vía WebSocket (no se guarda en BD inmediatamente)"
    );

    // Solo actualizar en memoria para sincronización en tiempo real
    // El guardado en BD se hace desde el cliente con debouncing
    const updatedConfig = { ...currentConfig, ...config };
    currentConfig = updatedConfig;

    // Notifica a todos los clientes excepto al que envió
    socket.broadcast.emit("config", currentConfig);
  });

  // Solicitud de configuración actual
  socket.on("requestConfig", () => {
    if (currentConfig) {
      socket.emit("config", currentConfig);
    }
  });

  socket.on("disconnect", () => {
    connectedClients--;
    console.log(`Cliente desconectado. Total: ${connectedClients}`);
    io.emit("clientsCount", connectedClients);
  });
});

// Manejo de errores
process.on("SIGINT", () => {
  console.log("Cerrando servidor...");
  db.close((err) => {
    if (err) {
      console.error("Error al cerrar base de datos:", err);
    } else {
      console.log("Base de datos cerrada.");
    }
    process.exit(0);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket Server corriendo en http://localhost:${PORT}`);
  console.log(`Base de datos SQLite en: ${dbPath}`);
  console.log(`Sistema de cache y debouncing activo`);
});
