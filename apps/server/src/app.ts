import cors from "cors";
import http from "http";
import express from "express";

import { config } from "dotenv";
import { Server } from "socket.io";

import socketRoute from "@/routes/socket.route";

config();
const PORT = 9999;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(express.json());

function bootstrap() {
  app.get("/", (req, res) => res.send("Server running..."));

  app.use("/socket", socketRoute);

  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
}

bootstrap();
