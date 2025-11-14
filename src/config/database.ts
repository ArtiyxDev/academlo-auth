import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/**
 * Database connection configuration
 * Uses DATABASE_URL for production (Render.com) or individual env vars for development
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
