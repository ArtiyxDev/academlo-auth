/**
 * Application Entry Point
 * 
 * This is the main entry file for the Academlo Auth API.
 * It initializes the database connection, synchronizes models,
 * and starts the Express server.
 * 
 * Startup sequence:
 * 1. Load environment variables from .env file
 * 2. Test database connection
 * 3. Sync database models (create/update tables)
 * 4. Initialize Express application
 * 5. Start HTTP server on configured port
 * 
 * Environment variables required:
 * - PORT: Server port (default: 3000)
 * - NODE_ENV: Environment mode (development/production)
 * - Database configuration (see config/database.ts)
 * - JWT and email configuration
 */

import dotenv from "dotenv";
import createApp from "./app";
import sequelize from "./config/database";
import "./models"; // Import models to ensure associations are set up

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Initialize database and start server
 */
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");

    // Sync database models
    // In production, use migrations instead of sync
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Database models synchronized");

    // Create and start Express app
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📍 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
