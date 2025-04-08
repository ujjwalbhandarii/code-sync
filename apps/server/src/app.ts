import cors from "cors";
import http from "http";
import { config } from "dotenv";
import express, { Request, Response } from "express";

import { CORS_CONFIG } from "./constants/config.constant";
import { initializeSocketService } from "./services/socket.service";

config();

const PORT = process.env.PORT || 9999;

const app = express();
const server = http.createServer(app);

app.use(cors(CORS_CONFIG));
app.use(express.json());

initializeSocketService(server);

app.get("/", (_: Request, res: Response) => res.send("Server running..."));

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
