import { NextFunction, Request, Response } from "express";

import { TryCatch } from "@/middlewares/try-catch.middleware";

export const SocketFn = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log({ req, res });
  }
);
