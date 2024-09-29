import cors from "cors";
import express from "express";
import { config } from "dotenv";

const PORT = 9999;
const app = express();

config();
app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
    credentials: true,
  })
);
app.use(express.json());

function bootstrap() {
  app.get("/", (req, res) => {
    res.send("Server running...");
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

bootstrap();
