import { Request, Response } from "express";
import { EmailCode, User } from "../models";
import { hashPassword, passwordMatches } from "../utils/password";
import { generateJWT } from "../utils/jwt";
import { randomBytes } from "crypto";
import transporter from "../config/smtp";

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const emailCode = await EmailCode.findOne({
      where: { code },
      include: [{ model: User, as: "user" }],
    });
    if (!emailCode) {
      return res.status(404).json({ error: "Invalid verification code" });
    }
    const user = emailCode.user;
    if (!user) {
      return res.status(404).json({ error: "User not found for this code" });
    }
    user.isVerify = true;
    await user.save();
    await emailCode.destroy();
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying user email:", error);
    res.status(500).json({ error: "Failed to verify user email" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!(await passwordMatches(password, user.password))) {
      return res.status(401).json({ error: "Invalid password" });
    }
    if (!user.isVerify) {
      return res.status(401).json({ error: "Email not verified" });
    }

    const { password: _, ...filterUser } = user.toJSON();
    res.json({
      user: filterUser,
      token: await generateJWT({ id: user.id, email: user.email }),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(Number(req.headers["userId"]));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password: _, ...filterUser } = user.toJSON();
    res.json(filterUser);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email, frontBaseUrl } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const emailCode = await EmailCode.create({
      user_id: user.id,
      code: randomBytes(32).toString("hex"),
    });
    transporter.sendMail({
      from: '"Artiyx - No Reply" <artisandevx@gmail.com>',
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${frontBaseUrl}/${emailCode.code}">here</a> to reset your password.</p>`,
    });
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ error: "Failed to request password reset" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { code } = req.params;
  const { password } = req.body;
  try {
    const emailCode = await EmailCode.findOne({
      where: { code },
      include: [{ model: User, as: "user" }],
    });
    if (!emailCode) {
      return res.status(404).json({ error: "Invalid password reset code" });
    }
    const user = emailCode.user;
    if (!user) {
      return res.status(404).json({ error: "User not found for this code" });
    }
    user.password = await hashPassword(password);
    await user.save();
    await emailCode.destroy();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
