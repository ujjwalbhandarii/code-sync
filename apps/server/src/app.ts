import cors from "cors";
import http from "http";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import { Server, Socket } from "socket.io";
import { ACTIONS } from "./constants";

config();
const PORT = process.env.PORT || 9999;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"],
  },
});

const userSocketMap: Record<string, string> = {};

function getAllConnectedClients(roomId: string) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
}

io.on(ACTIONS.CONNECTION, (socket: Socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify all clients in the room
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.DISCONNECTING, () => {
    const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);

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
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/", (_: Request, res: Response) => res.send("Server running..."));

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
