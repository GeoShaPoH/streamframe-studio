import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectedClients: number;
  sendConfig: (config: any) => void;
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

export const useWebSocket = (
  onConfigReceived: (config: any) => void
): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedClients, setConnectedClients] = useState(0);

  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });

    socketIo.on("connect", () => {
      console.log("WebSocket conectado");
      setIsConnected(true);
      socketIo.emit("requestConfig");
    });

    socketIo.on("disconnect", () => {
      console.log("WebSocket desconectado");
      setIsConnected(false);
    });

    socketIo.on("connect_error", (error) => {
      console.error("Error de conexión:", error);
    });

    socketIo.on("config", (config) => {
      console.log("Configuración recibida:", config);
      onConfigReceived(config);
    });

    socketIo.on("clientsCount", (count: number) => {
      setConnectedClients(count);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [onConfigReceived]);

  const sendConfig = useCallback(
    (config: any) => {
      if (socket && isConnected) {
        socket.emit("updateConfig", config);
      }
    },
    [socket, isConnected]
  );

  return {
    socket,
    isConnected,
    connectedClients,
    sendConfig,
  };
};
