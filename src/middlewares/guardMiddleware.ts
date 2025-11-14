import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

/**
 * Authentication Guard Middleware
 *
 * Protects routes by validating JWT tokens from the Authorization header.
 * Extracts the user ID from the token and adds it to the request headers
 * for use in subsequent handlers.
 *
 * Expected header format: "Authorization: Bearer <jwt-token>"
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to the next middleware
 *
 * @returns 401 - If no authorization header, no token, or invalid token
 * @returns next() - Calls next middleware if token is valid
 *
 * Side effects:
 * - Adds userId to req.headers for authenticated requests
 */
export const guardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const jwtPayload = await verifyJWT(token);
    if (!jwtPayload || typeof jwtPayload.id !== "number") {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.headers["userId"] = jwtPayload.id.toString();
    next();
  } catch (error) {
    console.error("Error in guardMiddleware:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
