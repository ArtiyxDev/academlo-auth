import { Request, Response } from "express";
import { EmailCode, User } from "../models";
import { hashPassword, passwordMatches } from "../utils/password";
import { generateJWT } from "../utils/jwt";
import { randomBytes } from "crypto";
import transporter from "../config/smtp";
import { SendSmtpEmail } from "@getbrevo/brevo/dist/api";

/**
 * Verify User Email
 *
 * Verifies a user's email address using a verification code sent via email.
 * Upon successful verification, marks the user as verified and deletes the code.
 *
 * @param req.params.code - The unique verification code from the email link
 * @returns 200 - Email verified successfully
 * @returns 404 - Invalid verification code or user not found
 * @returns 500 - Server error during verification
 */
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

/**
 * User Login
 *
 * Authenticates a user with email and password credentials.
 * Validates the password, checks email verification status, and returns a JWT token.
 *
 * @param req.body.email - User's email address
 * @param req.body.password - User's plain text password
 * @returns 200 - Login successful with user data and JWT token
 * @returns 404 - User not found
 * @returns 401 - Invalid password or email not verified
 * @returns 500 - Server error during login
 */
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

/**
 * Get User Profile
 *
 * Retrieves the authenticated user's profile information.
 * Requires JWT authentication via guardMiddleware.
 * The user ID is extracted from the JWT token and added to request headers.
 *
 * @param req.headers.userId - User ID injected by guardMiddleware from JWT
 * @returns 200 - User profile data (excluding password)
 * @returns 404 - User not found
 * @returns 500 - Server error fetching profile
 */
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

/**
 * Request Password Reset
 *
 * Initiates a password reset process by generating a unique reset code
 * and sending a password reset email to the user.
 *
 * @param req.body.email - User's email address
 * @param req.body.frontBaseUrl - Frontend URL base for constructing the reset link
 * @returns 200 - Password reset email sent successfully
 * @returns 404 - User not found
 * @returns 500 - Server error sending reset email
 */
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
    const message = new SendSmtpEmail();
    message.subject = "Password Reset Request";
    message.htmlContent = `<p>Click the link below to reset your password:</p>
      <a href="${frontBaseUrl}/reset_password/${emailCode.code}">Reset Password</a>`;
    message.sender = { email: "artisandevx@gmail.com" };
    message.to = [{ email: user.email }];
    await transporter.sendTransacEmail(message);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ error: "Failed to request password reset" });
  }
};

/**
 * Reset Password
 *
 * Completes the password reset process using a reset code from the email.
 * Validates the code, hashes the new password, updates the user, and deletes the code.
 *
 * @param req.params.code - The unique password reset code from the email link
 * @param req.body.password - The new password to set (will be hashed)
 * @returns 200 - Password reset successfully
 * @returns 404 - Invalid reset code or user not found
 * @returns 500 - Server error during password reset
 */
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
