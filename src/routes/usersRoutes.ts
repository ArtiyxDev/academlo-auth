import { Router } from "express";
import { guardMiddleware } from "../middlewares/guardMiddleware";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/usersController";
import {
  getProfile,
  login,
  requestPasswordReset,
  resetPassword,
  verifyUserEmail,
} from "../controllers/authController";

/**
 * Users Routes
 * 
 * Defines all user-related and authentication endpoints.
 * 
 * Public routes (no authentication required):
 * - POST /users - Register new user
 * - GET /users/verify/:code - Verify email
 * - POST /users/login - User login
 * - POST /users/reset_password - Request password reset
 * - POST /users/reset_password/:code - Reset password with code
 * 
 * Protected routes (require JWT authentication):
 * - GET /users/me - Get current user profile
 * - GET /users - Get all users (admin functionality)
 * - GET /users/:id - Get specific user
 * - PUT /users/:id - Update user
 * - DELETE /users/:id - Delete user
 */
const router = Router();

router.post("/", createUser);

router.get("/verify/:code", verifyUserEmail);

router.post("/login", login);

router.get("/me", guardMiddleware, getProfile);

router.get("/", guardMiddleware, getAllUsers);

router.get("/:id", guardMiddleware, getUserById);

router.delete("/:id", guardMiddleware, deleteUser);

router.put("/:id", guardMiddleware, updateUser);

router.post("/reset_password", requestPasswordReset);

router.post("/reset_password/:code", resetPassword);

export default router;
