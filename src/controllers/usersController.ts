import { Request, Response } from "express";
import { EmailCode, User } from "../models";
import { hashPassword } from "../utils/password";
import { randomBytes } from "crypto";
import transporter from "../config/smtp";

/**
 * Get All Users
 *
 * Retrieves a list of all users in the system, ordered by creation date (newest first).
 * Requires JWT authentication. Returns user data excluding passwords for security.
 *
 * @returns 200 - Array of user objects (without password field)
 * @returns 500 - Server error fetching users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(
      users.map((users) => {
        return {
          id: users.id,
          first_name: users.first_name,
          last_name: users.last_name,
          email: users.email,
          image: users.image,
          isVerify: users.isVerify,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * Get User By ID
 *
 * Retrieves a specific user's information by their ID.
 * Requires JWT authentication. Returns user data excluding password.
 *
 * @param req.params.id - The user's unique identifier
 * @returns 200 - User object (without password field)
 * @returns 404 - User not found
 * @returns 500 - Server error fetching user
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      image: user.image,
      isVerify: user.isVerify,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * Create User
 *
 * Registers a new user account with email verification.
 * Hashes the password, creates the user record, generates a verification code,
 * and sends a verification email to the user.
 *
 * @param req.body.firstName - User's first name
 * @param req.body.lastName - User's last name
 * @param req.body.email - User's email address (must be unique)
 * @param req.body.password - User's password (will be hashed)
 * @param req.body.country - User's country
 * @param req.body.image - URL to user's profile image
 * @returns 201 - User created successfully (without password field)
 * @returns 500 - Server error creating user (e.g., duplicate email)
 */
export const createUser = async (req: Request, res: Response) => {
  const {
    firstName: first_name,
    lastName: last_name,
    email,
    password,
    country,
    image,
  } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      country,
      image,
    });
    const emailCode = await EmailCode.create({
      user_id: newUser.id,
      code: randomBytes(32).toString("hex"),
    });

    transporter.sendMail({
      from: '"Verify - No Reply" <artisandevx@gmail.com>',
      to: newUser.email,
      subject: "Verify your email",
      text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/auth/verify_email/${emailCode.code}`,
    });
    res.status(201).json({
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      image: newUser.image,
      isVerify: newUser.isVerify,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

/**
 * Update User
 *
 * Updates an existing user's profile information.
 * Requires JWT authentication. Does not allow updating email or password.
 *
 * @param req.params.id - The user's unique identifier
 * @param req.body.firstName - Updated first name
 * @param req.body.lastName - Updated last name
 * @param req.body.country - Updated country
 * @param req.body.image - Updated profile image URL
 * @returns 200 - User updated successfully (without password field)
 * @returns 404 - User not found
 * @returns 500 - Server error updating user
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    firstName: first_name,
    lastName: last_name,
    country,
    image,
  } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.update({ first_name, last_name, country, image });
    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      image: user.image,
      isVerify: user.isVerify,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * Delete User
 *
 * Permanently deletes a user account from the system.
 * Requires JWT authentication. Associated email codes are also deleted due to CASCADE.
 *
 * @param req.params.id - The user's unique identifier
 * @returns 200 - User deleted successfully
 * @returns 404 - User not found
 * @returns 500 - Server error deleting user
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
