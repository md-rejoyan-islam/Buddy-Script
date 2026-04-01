import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./app/lib/auth";
import globalErrorHandler from "./app/middlewares/error_handler";
import routes from "./app/routes";
import { morganMiddleware } from "./app/utils";
import corsOptions from "./config/cors";

const app: Express = express();

app.use(cors(corsOptions));

// Better Auth handler — must be before body parsers
app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(cookieParser());
app.use(express.json());
app.use(morganMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Appify API" });
});

app.use("/api/v1", routes);

// ---------------------------------------------
// Error Handling
// ---------------------------------------------
app.use((req: Request, res: Response) => {
  throw new Error("Route not found");
});

// Global Error Handler
app.use(globalErrorHandler);

// Global error handler

export default app;
