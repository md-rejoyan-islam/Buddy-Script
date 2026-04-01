import { APIError } from "better-auth/api";

import { logger } from "better-auth";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import secret from "../../config/secret";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/app-error";

// Define a custom interface for Errors that might have a status code
interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  code?: string; // Prisma errors have codes
  meta?: Record<string, unknown>; // Prisma errors have meta
}

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = err.message || "Internal Server Error";

  // Use a more specific type than 'any', allowing objects or arrays of error info
  let errorDetails: Record<string, unknown> | Array<unknown> | null = null;

  // Check for 'status' property safely without casting to any
  if (typeof err.status === "number") {
    statusCode = err.status;
  } else if (typeof err.statusCode === "number") {
    statusCode = err.statusCode;
  }

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    // Use the first error message as the main message
    message = err.issues[0]?.message || "Validation Error";

    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Handle Better-Auth API Errors
  else if (err instanceof APIError) {
    const s = Number(err.status);
    statusCode = Number.isInteger(s) && s >= 100 && s < 600 ? s : 400;
    message = err.message || "Authentication Error";
  }

  // Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate entry found";
      // Prisma meta is Record<string, unknown>
      errorDetails = err.meta || null;
    }
  }

  const stack = secret.node_env === "development" ? err.stack : undefined;

  // Log the error for debugging

  logger.error(
    `Global Error Handler [${req.method} ${req.url}]: ${err.message}`,
    {
      method: req.method,
      url: req.url,
      stack: err.stack,
      errorDetails,
    },
  );

  // Ensure valid status code
  if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode >= 600) {
    statusCode = 500;
  }

  // Return direct JSON response without ApiResponse class
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errors: errorDetails,
    stack,
  });

  res.end();
};

export default globalErrorHandler;
