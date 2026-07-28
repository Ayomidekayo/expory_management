import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/client";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: err.flatten(),
    });
  }

  // Prisma errors
  if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message:
            "A record with the same value already exists.",
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
        });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error.",
  });
}