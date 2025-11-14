import { Request, Response } from "express";
import { EmailCode, User } from "../models";
import { hashPassword } from "../utils/password";
import { randomBytes } from "crypto";
import transporter from "../config/smtp";

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
