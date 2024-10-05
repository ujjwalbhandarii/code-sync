import cors from "cors";
import http from "http";
import express, { Request, Response } from "express";

import { config } from "dotenv";
import { Server, Socket } from "socket.io";

import { ACTIONS } from "./constants";
import { CodeChangeData, JoinData, SyncCodeData, UserSocketMap } from "./types";

config();
const PORT = 9999;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap: UserSocketMap = {};

// Get all clients connected to a specific room
function getAllConnectedClients(roomId: string) {
  const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

  return clients.map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

io.on(ACTIONS.CONNECTION, (socket: Socket) => {
  console.log("Socket connected:", socket.id);

  // Join room and notify all clients in the room
  socket.on(ACTIONS.JOIN, ({ roomId, username }: JoinData) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Broadcast code changes to everyone in the room except the sender
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }: CodeChangeData) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Sync code with a specific client
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }: SyncCodeData) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.DISCONNECTING, () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave(socket.id);
  });
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => res.send("Server running..."));

// Start the server
function bootstrap() {
  server.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
}

bootstrap();
