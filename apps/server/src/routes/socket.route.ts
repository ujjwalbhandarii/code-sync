import express from "express";
import { SocketFn } from "@/controllers/socket.controller";

const router = express.Router();

router.get("/", SocketFn);

export default router;
