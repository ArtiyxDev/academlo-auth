import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Database connection configuration
 * 
 * This module creates and exports a Sequelize instance configured for PostgreSQL.
 * It supports two configuration modes:
 * 
 * 1. Production mode (DATABASE_URL exists):
 *    - Uses a single DATABASE_URL connection string
 *    - Enables SSL for secure connections (e.g., Render.com, Heroku)
 *    - SSL certificates are not validated (rejectUnauthorized: false)
 * 
 * 2. Development mode (individual environment variables):
 *    - Uses separate DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
 *    - No SSL configuration needed for local development
 *    - Defaults to standard PostgreSQL localhost settings
 * 
 * Logging is disabled in both modes to reduce console output.
 * Enable logging by setting 'logging: console.log' for debugging SQL queries.
 */
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions:
        process.env.NODE_ENV === "production"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false, // For Render.com SSL
              },
            }
          : {},
      logging: false,
    })
  : new Sequelize({
      database: process.env.DB_NAME || "movies_db",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      dialect: "postgres",
      logging: false,
    });

export default sequelize;
