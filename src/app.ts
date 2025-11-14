import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";

/**
 * Express Application Factory
 * 
 * Creates and configures an Express application with all necessary middleware
 * and route handlers for the authentication API.
 * 
 * Middleware stack:
 * 1. CORS - Enable cross-origin requests
 * 2. Cookie Parser - Parse signed cookies
 * 3. JSON Parser - Parse JSON request bodies
 * 4. URL Encoded Parser - Parse form data
 * 5. Morgan - HTTP request logging
 * 
 * Routes:
 * - / - Health check endpoint
 * - /users - User management and authentication routes
 * - 404 - Not found handler
 * - Error handler - Global error handling middleware
 * 
 * @returns Configured Express application instance
 */
const createApp = (): Application => {
  const app = express();

  // Middleware configuration
  app.use(cors()); // Enable CORS for all routes (configure for production)
  app.use(cookieParser(process.env.COOKIE_SECRET)); // Parse and verify signed cookies
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
  app.use(morgan("dev")); // HTTP request logger (use 'combined' in production)

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

  // API Routes - Mount all application routes
  app.use("/", routes);

  // 404 handler - Catch all unmatched routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Global error handling middleware - Catch all unhandled errors
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
