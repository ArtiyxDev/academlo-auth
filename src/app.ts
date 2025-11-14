import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";

/**
 * Creates and configures the Express application
 */
const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors()); // Enable CORS for all routes
  app.use(cookieParser(process.env.COOKIE_SECRET)); // Parse cookies
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(morgan("dev")); // HTTP request logger

  // Health check endpoint
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Auth API is running",
      version: "1.0.0",
      endpoints: {
        users: "/users",
        verify: "/users/verify/:code",
        login: "/users/login",
      },
    });
  });

  // API Routes
  app.use("/", routes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  return app;
};

export default createApp;
