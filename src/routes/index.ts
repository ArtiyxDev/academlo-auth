import { Router } from "express";
import usersRoutes from "./usersRoutes";

/**
 * Main API Router
 *
 * Aggregates all route modules and exposes them under their respective prefixes.
 *
 * Current routes:
 * - /users - User management and authentication routes
 *
 * To add new route modules:
 * 1. Import the route module
 * 2. Register it with router.use('/path', routeModule)
 */
const router = Router();

router.use("/users", usersRoutes);

export default router;
