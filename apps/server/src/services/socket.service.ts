// socket.service.ts
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

import { ACTIONS } from "../constants";
import { userSocketMap } from "../db/localDb";
import { CORS_CONFIG } from "../constants/config.constant";

export class SocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: CORS_CONFIG,
    });

    this.io.on(ACTIONS.CONNECTION, this.handleConnection.bind(this));
  }

  private getAllConnectedClients(roomId: string) {
    const clients = this.io.sockets.adapter.rooms.get(roomId) || [];

    return Array.from(clients).map((socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    }));
  }

  private handleConnection(socket: Socket) {
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);

      const clients = this.getAllConnectedClients(roomId);

      clients.forEach(({ socketId }) => {
        this.io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.MOUSE_MOVE, ({ roomId, x, y }) => {
      socket.to(roomId).emit(ACTIONS.MOUSE_MOVE, {
        x,
        y,
        socketId: socket.id,
      });
    });

    socket.on(ACTIONS.DISCONNECTING, () => {
      const rooms = Array.from(socket.rooms).filter(
        (room) => room !== socket.id
      );

      rooms.forEach((roomId) => {
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });
      });
    });

    socket.on(ACTIONS.DISCONNECT, () => {
      delete userSocketMap[socket.id];
    });
  }
}

export let socketService: SocketService;

export function initializeSocketService(server: HttpServer) {
  socketService = new SocketService(server);
}
