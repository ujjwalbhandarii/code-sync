import { Request, Response, NextFunction } from "express";

import { ControllerType } from "@/types";

export const TryCatch =
  (func: ControllerType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
