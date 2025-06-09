const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Estado inicial de configuración
let currentConfig = {
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

// Mantener registro de clientes conectados
let connectedClients = 0;

io.on("connection", (socket) => {
  connectedClients++;
  console.log(`Cliente conectado. Total: ${connectedClients}`);

  // Enviar estado actual al nuevo cliente
  socket.emit("config", currentConfig);

  // Notificar a todos sobre el número de clientes
  io.emit("clientsCount", connectedClients);

  // Cuando llega una actualización de configuración
  socket.on("updateConfig", (config) => {
    console.log("Configuración actualizada:", config);
    currentConfig = { ...currentConfig, ...config };

    // Notifica a todos los clientes excepto al que envió
    socket.broadcast.emit("config", currentConfig);
  });

  // Solicitud de configuración actual
  socket.on("requestConfig", () => {
    socket.emit("config", currentConfig);
  });

  socket.on("disconnect", () => {
    connectedClients--;
    console.log(`Cliente desconectado. Total: ${connectedClients}`);
    io.emit("clientsCount", connectedClients);
  });
});

// Endpoint REST para obtener la configuración actual (opcional)
app.get("/api/config", (req, res) => {
  res.json(currentConfig);
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket Server corriendo en http://localhost:${PORT}`);
});
