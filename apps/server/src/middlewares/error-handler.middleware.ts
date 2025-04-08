import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/helpers/api-error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
  }

  console.error("Unexpected error:", err);

  console.error(err);
  return res.status(500).json({
    message: "Internal Server Error",
  });
};
