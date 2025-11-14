import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

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
