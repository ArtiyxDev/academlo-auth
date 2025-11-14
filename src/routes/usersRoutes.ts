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
